import jwt from 'jsonwebtoken';
import { TokenExpiredException } from '../exceptions/token-expired.exception.js';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';
import { InvalidJwtSecretException } from '../exceptions/invalid-jwt-secret.exception.js';

export class JwtService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new InvalidJwtSecretException(
        'JWT_SECRET is not defined in environment variables',
      );
    }
    this.secretKey = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRES_IN || '3600';
  }

  generateToken(userId: string, username: string): string {
    return jwt.sign({ userId, username }, this.secretKey, {
      expiresIn: this.expiresIn,
    });
  }

  verifyToken(token: string): { userId: string; username: string } {
    try {
      return jwt.verify(token, this.secretKey) as {
        userId: string;
        username: string;
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredException('Token expired');
      }
      throw new InvalidTokenException('Invalid token');
    }
  }
}
