import { NextFunction, Request, Response } from 'express'

const AdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user.role === 'admin') {
        return next()
    }
    return res.json({
        message: 'User Not Authorized'
    })
}

export default AdminMiddleware
