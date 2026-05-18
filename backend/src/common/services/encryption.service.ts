import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * AUDIT #14: AES-256-GCM encryption for sensitive credentials at rest.
 *
 * Format: base64(iv || authTag || ciphertext)
 *   - iv: 12 bytes (GCM standard)
 *   - authTag: 16 bytes
 *   - ciphertext: variable
 *
 * The encryption key is derived from ENCRYPTION_KEY env var via scrypt.
 * Generate a key with: `openssl rand -base64 32`
 */
@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 12;
  private readonly tagLength = 16;
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const rawKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!rawKey) {
      // Fail closed in production, allow dev fallback with a loud warning
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'ENCRYPTION_KEY env var is required in production. Generate one with: openssl rand -base64 32',
        );
      }
      this.logger.warn(
        '⚠️  ENCRYPTION_KEY not set — using ephemeral dev key. DO NOT use in production.',
      );
      this.key = crypto.randomBytes(this.keyLength);
    } else {
      // Derive a 32-byte key deterministically from whatever the user supplied
      this.key = crypto.scryptSync(rawKey, 'ecrh-encryption-salt-v1', this.keyLength);
    }
  }

  encrypt(plaintext: string | null | undefined): string | null {
    if (!plaintext) return null;
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
      const authTag = cipher.getAuthTag();
      return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
    } catch (err) {
      this.logger.error('Encryption failed', err);
      throw new InternalServerErrorException('Failed to encrypt credential');
    }
  }

  decrypt(payload: string | null | undefined): string | null {
    if (!payload) return null;
    try {
      const buf = Buffer.from(payload, 'base64');
      const iv = buf.subarray(0, this.ivLength);
      const authTag = buf.subarray(this.ivLength, this.ivLength + this.tagLength);
      const ciphertext = buf.subarray(this.ivLength + this.tagLength);
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);
      return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
    } catch (err) {
      this.logger.error('Decryption failed — payload may be tampered or key rotated', err);
      throw new InternalServerErrorException('Failed to decrypt credential');
    }
  }

  /** True if a stored value looks like a v1 encrypted payload (for migration helpers). */
  isEncrypted(value: string | null | undefined): boolean {
    if (!value) return false;
    try {
      const buf = Buffer.from(value, 'base64');
      return buf.length > this.ivLength + this.tagLength;
    } catch {
      return false;
    }
  }
}
