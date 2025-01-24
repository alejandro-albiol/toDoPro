import { Request, Response, NextFunction } from 'express';
import { TaskValidator } from '../../../src/middlewares/validators/task-validator';
import { ErrorCode } from '../../../src/shared/exceptions/enums/error-code.enum.js';

describe('TaskValidator', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            body: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('validateCreate', () => {
        const validator = TaskValidator.validateCreate();

        it('should pass valid task data', () => {
            mockRequest.body = {
                title: 'Valid Task Title',
                description: 'Valid description',
                user_id: '1'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should fail with invalid title', () => {
            mockRequest.body = {
                title: 'ab',
                description: 'Valid description',
                user_id: '1'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'error',
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            code: ErrorCode.INVALID_TITLE
                        })
                    ])
                })
            );
        });

        it('should fail with too long description', () => {
            mockRequest.body = {
                title: 'Valid Title',
                description: 'a'.repeat(501),
                user_id: '1'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'error',
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            code: ErrorCode.INVALID_DESCRIPTION
                        })
                    ])
                })
            );
        });

        it('should fail with invalid user_id', () => {
            mockRequest.body = {
                title: 'Valid Title',
                description: 'Valid description',
                user_id: 'invalid'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'error',
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            code: ErrorCode.INVALID_ID_FORMAT
                        })
                    ])
                })
            );
        });
    });

    describe('validateUpdate', () => {
        const validator = TaskValidator.validateUpdate();

        it('should pass valid update data', () => {
            mockRequest.body = {
                title: 'Updated Title',
                description: 'Updated description'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should pass with partial update data', () => {
            mockRequest.body = {
                title: 'Updated Title'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should fail with invalid title in update', () => {
            mockRequest.body = {
                title: 'ab'
            };

            validator(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'error',
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            code: ErrorCode.INVALID_TITLE
                        })
                    ])
                })
            );
        });
    });
}); 