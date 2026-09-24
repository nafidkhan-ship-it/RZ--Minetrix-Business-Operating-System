import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const distServerCjs = path.join(__dirname, 'dist', 'server.cjs');
  const rootServerJs = path.join(__dirname, 'server.js');

  // In production (Cloud Run deployment), execute pre-bundled CommonJS server
  if (fs.existsSync(distServerCjs)) {
    await import(`file://${distServerCjs}`);
  } else if (fs.existsSync(rootServerJs)) {
    await import(`file://${rootServerJs}`);
  } else {
    // In development (via tsx server.ts)
    try {
      await import('./src/server/main.js');
    } catch {
      await import('./src/server/main.ts');
    }
  }
}

bootstrap().catch((err) => {
  console.error('[FATAL] Failed to start RZ Minetrix Server:', err);
  process.exit(1);
});
