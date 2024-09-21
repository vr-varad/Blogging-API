import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'

interface User extends JwtPayload {
    _id: mongoose.Types.ObjectId
    email: string
    role: string
}

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}
