import BaseError from './baseError'

class ServiceError extends BaseError {
    constructor(description: string) {
        super(500, 'Service Error', description)
    }
}

class DatabaseError extends BaseError {
    constructor(description: string) {
        super(300, 'Database Error', description)
    }
}

class NotFoundError extends BaseError {
    constructor(description: string) {
        super(300, 'Not Found Error', description)
    }
}

class UnAuthorizedError extends BaseError {
    constructor(description: string) {
        super(401, 'UnAuthorized Error', description)
    }
}

export { ServiceError, DatabaseError, NotFoundError, UnAuthorizedError }
