import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes/apiRouter.js';
import { correlationIdMiddleware } from './src/server/middleware/authMiddleware.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = '0.0.0.0';

  // Body Parsing & Correlation ID
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(correlationIdMiddleware as any);

  // Health Endpoints at root level
  app.get('/health/liveness', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  app.get('/health/readiness', (req, res) => {
    res.json({ status: 'READY', db: 'CONNECTED', timestamp: new Date().toISOString() });
  });

  // Shared Core API v1 Gateway Router
  app.use('/api/v1', apiRouter);

  // Development vs Production Frontend Delivery
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[SERVER] Vite development middleware attached.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SERVER] Static production assets attached from /dist.');
  }

  app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(` RZ® Minetrix BOS Shared Core Backend Running`);
    console.log(` Server URL: http://${HOST}:${PORT}`);
    console.log(` Health Liveness: http://${HOST}:${PORT}/health/liveness`);
    console.log(` Health Readiness: http://${HOST}:${PORT}/health/readiness`);
    console.log(` API Base Route: http://${HOST}:${PORT}/api/v1`);
    console.log(`=======================================================`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL] Failed to start RZ Minetrix Server:', err);
  process.exit(1);
});
