import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const previousEnvironment = {
  nodeEnv: process.env.NODE_ENV,
  signingSecret: process.env.STORAGE_SIGNING_SECRET
};

try {
  process.env.NODE_ENV = 'test';
  delete process.env.STORAGE_SIGNING_SECRET;

  const { LocalStorageProvider, S3GcsStorageProviderAdapter } = await import('../providers/storageProvider.js');
  const developmentProvider = new LocalStorageProvider();
  const developmentUrl = await developmentProvider.getSignedUrl({
    storageKey: 'test-tenant/document.pdf',
    tenantId: 'test-tenant'
  });
  assert.match(developmentUrl, /[?&]sig=[a-f0-9]{64}$/);
  await assert.rejects(
    developmentProvider.getSignedUrl({
      storageKey: 'test-tenant-other/document.pdf',
      tenantId: 'test-tenant'
    }),
    /Tenant Security Access Denied/
  );

  process.env.NODE_ENV = 'production';
  assert.throws(() => new LocalStorageProvider(), /STORAGE_SIGNING_SECRET must be configured in production/);

  const configuredSecret = 'test-only-storage-signing-secret';
  process.env.STORAGE_SIGNING_SECRET = configuredSecret;
  const productionProvider = new LocalStorageProvider();
  const key = 'test-tenant/document.pdf';
  const productionUrl = await productionProvider.getSignedUrl({ storageKey: key, tenantId: 'test-tenant' });
  const url = new URL(productionUrl, 'https://example.invalid');
  const expiration = url.searchParams.get('exp');
  const signature = url.searchParams.get('sig');
  assert.ok(expiration);
  assert.equal(
    signature,
    crypto.createHmac('sha256', configuredSecret).update(`${key}:${expiration}`).digest('hex')
  );

  const cloudProvider = new S3GcsStorageProviderAdapter();
  await assert.rejects(
    cloudProvider.getSignedUrl({ storageKey: key, tenantId: 'test-tenant' }),
    /Cloud storage signed URL generation is not implemented/
  );
  await assert.rejects(cloudProvider.delete(key, 'test-tenant'), /Cloud storage deletion is not implemented/);

  console.log('PASS storageProviderTests: signing secret and tenant-safe provider failures');
} finally {
  if (previousEnvironment.nodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previousEnvironment.nodeEnv;

  if (previousEnvironment.signingSecret === undefined) delete process.env.STORAGE_SIGNING_SECRET;
  else process.env.STORAGE_SIGNING_SECRET = previousEnvironment.signingSecret;
}
