class BaseError extends Error {
    public statusCode: number
    public name: string
    public description: string

    constructor(statusCode: number, name: string, description: string) {
        super(description)
        this.statusCode = statusCode
        this.name = name
        this.description = description
        Error.captureStackTrace(this, this.constructor)
    }
}

export default BaseError
