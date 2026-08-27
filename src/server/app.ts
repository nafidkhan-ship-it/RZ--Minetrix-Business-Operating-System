import express from 'express';
import { apiRouter } from './routes/apiRouter.js';
import { correlationIdMiddleware } from './middleware/authMiddleware.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { securityHeadersMiddleware } from './middleware/securityHeaders.js';
import { getReadinessPayload } from './health/readiness.js';

export function createCoreApp(): express.Express {
  const app = express();

  app.set('trust proxy', 1);
  app.use(securityHeadersMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(correlationIdMiddleware as express.RequestHandler);

  app.get('/health/liveness', (_req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  app.get('/health/readiness', async (_req, res) => {
    const payload = await getReadinessPayload();
    res.status(payload.status === 'READY' ? 200 : 503).json(payload);
  });

  app.use('/api/v1', apiRouter);

  return app;
}
