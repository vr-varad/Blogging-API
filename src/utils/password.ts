import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config/config'
import { Request } from 'express'
import mongoose from 'mongoose'

interface User extends JwtPayload {
    _id: mongoose.Types.ObjectId
    email: string
    role: string
}

const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

const GeneratePasswordHash = async (salt: string, password: string) => {
    return await bcrypt.hash(password, salt)
}

const VerifyPassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
) => {
    return (await GeneratePasswordHash(salt, enteredPassword)) === savedPassword
}
const GenerateToken = (payload: {
    _id: mongoose.Types.ObjectId
    email: string
    role: string
}) => {
    return jwt.sign(payload, String(config.JWT_SECRET), {
        expiresIn: '1d'
    })
}

const ValidateToken = (req: Request) => {
    const token = req.get('Authorization')?.split(' ')[1]
    if (token) {
        const payload = jwt.verify(token, String(config.JWT_SECRET))

        if (
            typeof payload === 'object' &&
            payload !== null &&
            '_id' in payload
        ) {
            const userPayload = payload as User
            req.user = userPayload
            return userPayload
        }
    }
    return false
}

export {
    GenerateSalt,
    GeneratePasswordHash,
    VerifyPassword,
    GenerateToken,
    ValidateToken
}
