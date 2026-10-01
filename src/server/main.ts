import express from 'express';
import fs from 'fs';
import path from 'path';
import { apiRouter } from './routes/apiRouter.js';
import { correlationIdMiddleware } from './middleware/authMiddleware.js';
import { db } from './db/database.js';

export async function startServer() {
  const app = express();
  // In Cloud Run or production containers, process.env.PORT is the port Cloud Run routes traffic to
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = '0.0.0.0';

  // Body Parsing & Correlation ID
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(correlationIdMiddleware as any);

  // Health Endpoints at root level (Cloud Run & container health checks)
  const healthCheckHandler = (req: express.Request, res: express.Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'RZ® Minetrix BOS Shared Core Backend',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  };

  app.get('/health', healthCheckHandler);
  app.get('/healthz', healthCheckHandler);
  app.get('/api/health', healthCheckHandler);
  app.get('/api/v1/health', healthCheckHandler);

  app.get('/health/liveness', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'RZ® Minetrix BOS Shared Core Backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.get('/health/readiness', async (req, res) => {
    const isDbReady = db.tenants.size > 0;
    const adapterHealth = await db.persistenceAdapter.executeHealthCheck();

    res.status(200).json({
      status: isDbReady ? 'READY' : 'NOT_READY',
      db: adapterHealth.status,
      persistenceEngine: adapterHealth.engine,
      tablesCount: adapterHealth.tablesCount,
      timestamp: new Date().toISOString()
    });
  });

  // Shared Core API v1 Gateway Router
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'API endpoint not found.' });
  });
  app.use('/health', (_req, res) => {
    res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Health endpoint not found.' });
  });

  // Check if compiled frontend exists in dist
  const distDir = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  const hasBuiltFrontend = fs.existsSync(indexHtmlPath);

  // Development vs Production Frontend Delivery
  // Only load Vite if dist/index.html does not exist AND NODE_ENV is not production
  if (!hasBuiltFrontend && process.env.NODE_ENV !== 'production') {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
      console.log('[SERVER] Vite development middleware attached.');
    } catch (err: any) {
      console.warn('[SERVER] Vite dev middleware unavailable, serving static/fallback:', err.message);
    }
  } else {
    // Production static asset serving
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
    }
    app.get('*', (req, res) => {
      if (fs.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>RZ® Minetrix BOS</title></head><body><div id="root"><h1>RZ® Minetrix BOS</h1><p>Initializing...</p></div></body></html>');
      }
    });
    console.log(`[SERVER] Static production assets attached from: ${distDir}`);
  }

  // 1. Primary listener: bind to the port expected by Cloud Run (process.env.PORT || 3000)
  const primaryServer = app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(` RZ® Minetrix BOS Shared Core Backend Running`);
    console.log(` Primary Server URL: http://${HOST}:${PORT}`);
    console.log(` Health Check: http://${HOST}:${PORT}/health`);
    console.log(` API Base Route: http://${HOST}:${PORT}/api/v1`);
    console.log(`=======================================================`);
  });

  // 2. If Cloud Run gave a port other than 3000, attempt secondary listener on 3000 safely
  if (PORT !== 3000) {
    try {
      const secondaryServer = app.listen(3000, HOST, () => {
        console.log(`[SERVER] Secondary listener active on port 3000`);
      });
      secondaryServer.on('error', (err: any) => {
        console.log(`[SERVER] Port 3000 secondary listener bypassed: ${err.message}`);
      });
    } catch (err: any) {
      console.log(`[SERVER] Port 3000 secondary listen bypass: ${err.message}`);
    }
  }

  // Graceful shutdown signals for Cloud Run lifecycle
  const handleShutdown = (signal: string) => {
    console.log(`[SERVER] ${signal} signal received: closing HTTP servers`);
    primaryServer.close(() => {
      console.log('[SERVER] Primary server closed cleanly');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  return { app, server: primaryServer };
}

// Auto-start if run directly
startServer().catch((err) => {
  console.error('[FATAL] Failed to start RZ Minetrix Server:', err);
  process.exit(1);
});
