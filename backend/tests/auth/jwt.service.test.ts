import jwt from 'jsonwebtoken';
import { JwtService } from '../../src/auth/service/jwt.service.js';
import { InvalidJwtSecretException } from '../../src/auth/exceptions/invalid-jwt-secret.exception.js';
import { TokenExpiredException } from '../../src/auth/exceptions/token-expired.exception.js';
import { InvalidTokenException } from '../../src/auth/exceptions/invalid-token.exception.js';

describe('JwtService', () => {
    let jwtService: JwtService;
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            JWT_SECRET: 'test-secret',
            JWT_EXPIRES_IN: '1h'
        };
        jwtService = new JwtService();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('constructor', () => {
        it('should throw InvalidJwtSecretException when JWT_SECRET is not defined', () => {
            delete process.env.JWT_SECRET;
            expect(() => new JwtService()).toThrow(InvalidJwtSecretException);
        });
    });

    describe('generateToken', () => {
        it('should generate valid JWT token', () => {
            const token = jwtService.generateToken('123', 'testuser');
            expect(token).toBeDefined();
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            expect(decoded.userId).toBe('123');
            expect(decoded.username).toBe('testuser');
        });
    });

    describe('verifyToken', () => {
        it('should verify valid token', () => {
            const token = jwtService.generateToken('123', 'testuser');
            const decoded = jwtService.verifyToken(token);
            
            expect(decoded.userId).toBe('123');
            expect(decoded.username).toBe('testuser');
        });

        it('should throw TokenExpiredException for expired token', () => {
            process.env.JWT_EXPIRES_IN = '0s';
            const service = new JwtService();
            const token = service.generateToken('123', 'testuser');

            setTimeout(() => {
                expect(() => service.verifyToken(token))
                    .toThrow(TokenExpiredException);
            }, 100);
        });

        it('should throw InvalidTokenException for invalid token', () => {
            expect(() => jwtService.verifyToken('invalid.token'))
                .toThrow(InvalidTokenException);
        });
    });
});