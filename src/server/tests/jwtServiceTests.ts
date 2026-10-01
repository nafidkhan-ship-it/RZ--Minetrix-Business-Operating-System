import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const previousEnvironment = {
  nodeEnv: process.env.NODE_ENV,
  privateKey: process.env.RSA_PRIVATE_KEY,
  publicKey: process.env.RSA_PUBLIC_KEY
};

try {
  process.env.NODE_ENV = 'test';
  delete process.env.RSA_PRIVATE_KEY;
  delete process.env.RSA_PUBLIC_KEY;

  const { JwtService } = await import('../security/jwtService.js');
  const developmentService = new JwtService();
  const developmentToken = developmentService.signToken({
    userId: 'jwt-test-user',
    email: 'jwt-test@example.invalid',
    fullName: 'JWT Test',
    tenantId: 'jwt-test-tenant',
    companyId: 'jwt-test-company',
    roles: ['TEST']
  });
  assert.equal(developmentService.verifyToken(developmentToken)?.sub, 'jwt-test-user');

  process.env.NODE_ENV = 'production';
  assert.throws(() => new JwtService(), /must be configured in production/);

  process.env.RSA_PRIVATE_KEY = 'configured-private-key';
  assert.throws(() => new JwtService(), /must be configured together/);

  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  process.env.RSA_PRIVATE_KEY = privateKey;
  process.env.RSA_PUBLIC_KEY = publicKey;

  const productionService = new JwtService();
  const productionToken = productionService.signToken({
    userId: 'jwt-production-test-user',
    email: 'jwt-production-test@example.invalid',
    fullName: 'JWT Production Test',
    tenantId: 'jwt-test-tenant',
    companyId: 'jwt-test-company',
    roles: ['TEST']
  });
  assert.equal(productionService.verifyToken(productionToken)?.sub, 'jwt-production-test-user');
  assert.equal(productionService.getKeyMetadata().status, 'PRODUCTION_KEY_LOADED');

  console.log('PASS jwtServiceTests: dev key generation and production key requirements');
} finally {
  if (previousEnvironment.nodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previousEnvironment.nodeEnv;

  if (previousEnvironment.privateKey === undefined) delete process.env.RSA_PRIVATE_KEY;
  else process.env.RSA_PRIVATE_KEY = previousEnvironment.privateKey;

  if (previousEnvironment.publicKey === undefined) delete process.env.RSA_PUBLIC_KEY;
  else process.env.RSA_PUBLIC_KEY = previousEnvironment.publicKey;
}
