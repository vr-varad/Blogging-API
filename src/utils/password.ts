import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import { Request } from 'express'

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
    _id: string
    email: string
    role: string
}) => {
    return jwt.sign(payload, String(config.JWT_SECRET), {
        expiresIn: '1d'
    })
}

const ValidateToken = (req: Request) => {
    const token = req.get('Authorisation')?.split(' ')[1]
    if (token) {
        const payload = jwt.verify(token, String(config.JWT_SECRET))
        // req.user = payload
        return payload
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
