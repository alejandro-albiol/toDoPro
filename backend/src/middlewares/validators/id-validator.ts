import { Request } from 'express';
import { BaseValidator } from './base-validator.js';
import { ErrorCode } from '../../shared/exceptions/enums/error-code.enum.js';

export class IdValidator extends BaseValidator {
    static validate(paramName: string) {
        return this.validateRules([
            (req: Request) => {
                const id = req.params[paramName];
                return !this.isValidId(id) ? {
                    code: ErrorCode.INVALID_ID_FORMAT,
                    message: `Invalid ${paramName} format`
                } : null;
            }
        ]);
    }
}