/**
 * @file app.error.ts
 * Base AppError class and all derived HTTP error classes.
 * All errors extend Error so instanceof checks work correctly in middleware.
 */

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        // Restore prototype chain (needed when extending built-ins in TS)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class NotImplementedError extends AppError {
    constructor(message: string) {
        super(message, 501);
    }
}