import { NextFunction, Request, Response } from 'express'
import { ValidateToken } from '../utils/password'

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const signature = ValidateToken(req)
    if (signature) {
        return next()
    }
    return res.json({
        message: 'User Not Authorized'
    })
}

export default AuthMiddleware
