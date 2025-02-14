import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service.js';
import { ApiResponse } from '../../shared/responses/api-response.js';
import { AuthException } from '../exceptions/base-auth.exception.js';
import { IAuthController } from './i-auth.controller.js';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception.js';
import { EmailAlreadyExistsException } from '../../users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../../users/exceptions/username-already-exists.exception.js';

export class AuthController implements IAuthController {
    constructor(private readonly authService: AuthService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            await this.authService.register(req.body);
            ApiResponse.created(res, { message: 'User registered successfully' });
        } catch (error) {
            if (error instanceof EmailAlreadyExistsException || 
                error instanceof UsernameAlreadyExistsException) {
                ApiResponse.badRequest(res, error.message, error.errorCode);
            } else {
                ApiResponse.error(res, error);
            }
        }
    }


    async login(req: Request, res: Response): Promise<void> {
        try {
            const token = await this.authService.login(req.body);
            ApiResponse.success(res, { token });
        } catch (error) {
            if (error instanceof InvalidCredentialsException) {
                ApiResponse.unauthorized(res, error.message, error.errorCode);
            } else {
                ApiResponse.error(res, error);
            }
        }
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new InvalidTokenException('No token provided');
            }

            await this.authService.changePassword(token, req.body);
            ApiResponse.success(res, { message: 'Password changed successfully' });
        } catch (error) {
            if (error instanceof InvalidTokenException) {
                ApiResponse.unauthorized(res, error.message, error.errorCode);
            } else if (error instanceof InvalidCredentialsException) {
                ApiResponse.badRequest(res, error.message, error.errorCode);
            } else {
                ApiResponse.error(res, error);
            }
        }
    }
}