import mongoose from 'mongoose'
import { UserRepository } from '../database'
import Logger from '../utils/logger'
import {
    GeneratePasswordHash,
    GenerateSalt,
    GenerateToken,
    VerifyPassword
} from '../utils/password'
import {
    NotFoundError,
    ServiceError,
    UnAuthorizedError
} from '../utils/errorHandler'

class UserService {
    readonly repository: UserRepository
    constructor() {
        this.repository = new UserRepository()
    }

    async SignUp(
        username: string,
        bio: string,
        email: string,
        password: string,
        role: string
    ) {
        try {
            const user = await this.repository.GetUserByEmail(email)
            if (user) {
                Logger.log('User Already Exists')
                return
            }

            const salt = await GenerateSalt()

            const passwordhash = await GeneratePasswordHash(salt, password)

            const newUser = await this.repository.createUser(
                username,
                bio,
                email,
                passwordhash,
                salt,
                role
            )

            const token = GenerateToken({
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role
            })

            return token
        } catch (error) {
            Logger.error(`Error signing up user: ${(error as Error).message}`)
            throw new ServiceError('Failed to sign up user')
        }
    }

    async SignIn(email: string, password: string) {
        try {
            const user = await this.repository.GetUserByEmail(email)
            if (!user) {
                throw new NotFoundError(
                    `SignIn attempt failed: User with email ${email} not found`
                )
            }
            const isValidPassword = await VerifyPassword(
                password,
                user.passwordhash,
                user.salt
            )
            if (isValidPassword) {
                const token = GenerateToken({
                    _id: user._id,
                    email: user.email,
                    role: user.role
                })
                return token
            }
            Logger.warn(
                `SignIn failed: Invalid password for user with email ${email}`
            )
            return {
                success: false,
                message: 'Invalid password'
            }
        } catch (error) {
            Logger.error(`Error signing in user: ${(error as Error).message}`)
            throw new Error('Failed to sign in user')
        }
    }

    async GetProfile(userId: mongoose.Types.ObjectId) {
        try {
            const user = await this.repository.GetUserById(userId)
            return {
                user
            }
        } catch (error) {
            Logger.error(`Error getting user: ${(error as Error).message}`)
            throw new ServiceError('Failed to get a user')
        }
    }

    async DeleteProfile(
        userId: mongoose.Types.ObjectId,
        userEmail: string,
        role: string
    ) {
        try {
            const user = await this.repository.GetUserByEmail(userEmail)
            let deletedUser
            if (user) {
                if (role === 'admin') {
                    deletedUser = await this.repository.DeleteUser(userId)
                } else if (role === 'user') {
                    if (user._id.toString() !== userId.toString()) {
                        throw new UnAuthorizedError('User Not Authorised')
                    }
                    deletedUser = await this.repository.DeleteUser(userId)
                } else {
                    throw new UnAuthorizedError('Invalid Role')
                }
                return deletedUser
            }
            throw new NotFoundError('User Not Found')
        } catch (error) {
            Logger.error(`Error deleting user: ${(error as Error).message}`)
            throw new ServiceError('Failed to delete a user')
        }
    }
}

export default UserService
