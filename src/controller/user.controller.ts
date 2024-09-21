/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'
import { UserService } from '../services'
import { UserSignInInput } from '../dto/User'
import Logger from '../utils/logger'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'

interface User extends JwtPayload {
    _id: mongoose.Types.ObjectId
    email: string
    role: string
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user: User
        }
    }
}

const userService = new UserService()

const userSignUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, bio }: UserSignInInput =
            req.body
        const response = await userService.SignUp(
            username,
            bio,
            email,
            password,
            role
        )
        return res.status(201).json({
            success: true,
            message: response.message,
            token: response.token
        })
    } catch (error) {
        Logger.error(`Error during user sign up: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error signing up user',
            error: (error as Error).message
        })
    }
}

const userSignIn = async (req: Request, res: Response) => {
    try {
        const { email, password }: UserSignInInput = req.body
        const response = await userService.SignIn(email, password)
        return res.status(200).json({
            success: true,
            message: response.message,
            token: response.token
        })
    } catch (error) {
        Logger.error(`Error during user sign in: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error signing in user',
            error: (error as Error).message
        })
    }
}

const userProfile = async (req: Request, res: Response) => {
    try {
        const { _id: userId } = req.user
        const user = await userService.GetProfile(userId)
        return res.status(200).json({
            success: true,
            ...user
        })
    } catch (error) {
        Logger.error(`Error during user sign in: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error signing in user',
            error: (error as Error).message
        })
    }
}

export { userSignUp, userSignIn, userProfile }
