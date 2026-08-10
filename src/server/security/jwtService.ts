import crypto from 'crypto';

export interface JwtHeader {
  alg: 'RS256';
  typ: 'JWT';
  kid: string;
}

export interface JwtPayload {
  iss: string;
  aud: string;
  sub: string; // userId
  exp: number;
  iat: number;
  tenantId: string;
  companyId: string;
  branchId?: string;
  email: string;
  fullName: string;
  roles: string[];
}

export class JwtService {
  private privateKeyPem: string;
  private publicKeyPem: string;
  private keyId: string = 'rz-rsa-key-2026-v1';
  private issuer: string = 'rz-minetrix-bos';
  private audience: string = 'rz-minetrix-clients';

  constructor() {
    if (process.env.RSA_PRIVATE_KEY && process.env.RSA_PUBLIC_KEY) {
      this.privateKeyPem = process.env.RSA_PRIVATE_KEY;
      this.publicKeyPem = process.env.RSA_PUBLIC_KEY;
    } else {
      // Auto-generate 2048-bit RSA Keypair for development/testing
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });
      this.privateKeyPem = privateKey;
      this.publicKeyPem = publicKey;
    }
  }

  public getPublicKeyPem(): string {
    return this.publicKeyPem;
  }

  public getKeyMetadata() {
    return {
      algorithm: 'RS256 (RSA-256 Asymmetric Signing)',
      keyId: this.keyId,
      issuer: this.issuer,
      audience: this.audience,
      keyType: 'RSA 2048-bit',
      status: process.env.RSA_PRIVATE_KEY ? 'PRODUCTION_KEY_LOADED' : 'DEVELOPMENT_DYNAMIC_RSA_KEYPAIR'
    };
  }

  public signToken(userClaims: {
    userId: string;
    email: string;
    fullName: string;
    tenantId: string;
    companyId: string;
    branchId?: string;
    roles: string[];
  }): string {
    const header: JwtHeader = {
      alg: 'RS256',
      typ: 'JWT',
      kid: this.keyId
    };

    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      iss: this.issuer,
      aud: this.audience,
      sub: userClaims.userId,
      exp: now + 86400, // 24 hours
      iat: now,
      tenantId: userClaims.tenantId,
      companyId: userClaims.companyId,
      branchId: userClaims.branchId,
      email: userClaims.email,
      fullName: userClaims.fullName,
      roles: userClaims.roles
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const signer = crypto.createSign('SHA256');
    signer.update(dataToSign);
    signer.end();

    const signature = signer.sign(this.privateKeyPem, 'base64url');
    return `${dataToSign}.${signature}`;
  }

  public verifyToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [encodedHeader, encodedPayload, signature] = parts;
      const dataToVerify = `${encodedHeader}.${encodedPayload}`;

      const verifier = crypto.createVerify('SHA256');
      verifier.update(dataToVerify);
      verifier.end();

      const isValid = verifier.verify(this.publicKeyPem, signature, 'base64url');
      if (!isValid) return null;

      const payload: JwtPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));

      // Claim checks
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null; // Expired
      }
      if (payload.iss !== this.issuer || payload.aud !== this.audience) {
        return null; // Invalid issuer/audience
      }

      return payload;
    } catch (err) {
      return null;
    }
  }
}

export const jwtService = new JwtService();
