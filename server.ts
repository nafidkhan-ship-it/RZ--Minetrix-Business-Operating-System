import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createCoreApp } from './src/server/app.js';
import { notFoundHandler, errorHandler } from './src/server/middleware/errorHandler.js';
import { initializeDatabase } from './src/server/db/database.js';
import { isProduction, validateJwtSecurityConfig } from './src/server/config/securityConfig.js';
import { getCorsConfigSummary } from './src/server/middleware/corsMiddleware.js';
import { jwtService } from './src/server/security/jwtService.js';

async function startServer() {
  const jwtCheck = validateJwtSecurityConfig();
  if (isProduction() && !jwtCheck.ok) {
    console.error(`[Security] ${jwtCheck.message}`);
    process.exit(1);
  }

  await initializeDatabase();

  const app = createCoreApp();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = '0.0.0.0';

  if (!isProduction()) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[SERVER] Vite development middleware attached.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SERVER] Static production assets attached from /dist.');
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, HOST, () => {
    const cors = getCorsConfigSummary();
    console.log('=======================================================');
    console.log(' RZ® Minetrix BOS Shared Core Backend Running');
    console.log(` Server URL: http://${HOST}:${PORT}`);
    console.log(` Health Liveness: http://${HOST}:${PORT}/health/liveness`);
    console.log(` Health Readiness: http://${HOST}:${PORT}/health/readiness`);
    console.log(` API Base Route: http://${HOST}:${PORT}/api/v1`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` CORS origins: ${cors.allowedOrigins.join(', ') || '(none configured)'}`);
    console.log(` JWT key source: ${jwtService.getKeySource()}`);
    console.log('=======================================================');
  });
}

startServer().catch((err) => {
  console.error('[FATAL] Failed to start RZ Minetrix Server:', err instanceof Error ? err.message : err);
  process.exit(1);
});
