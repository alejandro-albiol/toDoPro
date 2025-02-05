import { HashService } from "../../../../src/shared/services/hash.service.js";
import argon2 from 'argon2';

jest.mock('argon2');

describe('HashService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (argon2.hash as jest.Mock).mockResolvedValue('hashedpassword123');
        (argon2.verify as jest.Mock).mockResolvedValue(true);
    });

    describe('hashPassword', () => {
        it('should hash password successfully', async () => {
            const result = await HashService.hashPassword('password123');
            expect(result).toBe('hashedpassword123');
            expect(argon2.hash).toHaveBeenCalledWith('password123');
        });

        it('should handle hashing errors', async () => {
            (argon2.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

            await expect(HashService.hashPassword('password123'))
                .rejects
                .toThrow('An unexpected error occurred while hashing password, please try again later');
        });
    });

    describe('verifyPassword', () => {
        it('should verify password successfully', async () => {
            const result = await HashService.verifyPassword('password123', 'hashedpassword123');
            expect(result).toBe(true);
            expect(argon2.verify).toHaveBeenCalledWith('hashedpassword123', 'password123');
        });

        it('should return false for non-matching passwords', async () => {
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            const result = await HashService.verifyPassword('wrongpassword', 'hashedpassword123');
            expect(result).toBe(false);
        });

        it('should handle verification errors', async () => {
            (argon2.verify as jest.Mock).mockRejectedValue(new Error('Verification failed'));

            await expect(HashService.verifyPassword('password123', 'hashedpassword123'))
                .rejects
                .toThrow('An unexpected error occurred while verifying password, please try again later');
        });
    });
});
