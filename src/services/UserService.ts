import { UserRepository } from '../database'
import Logger from '../utils/logger'
import {
    GeneratePasswordHash,
    GenerateSalt,
    GenerateToken,
    VerifyPassword
} from '../utils/password'

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
                throw new Error('Error in Signing Up User')
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
                _id: String(newUser._id),
                email: newUser.email,
                role: newUser.role
            })

            return {
                success: true,
                message: 'User Successfully Created',
                token
            }
        } catch (error) {
            Logger.error(`Error signing up user: ${(error as Error).message}`)
            throw new Error('Failed to sign up user')
        }
    }

    async SignIn(email: string, password: string) {
        try {
            const user = await this.repository.GetUserByEmail(email)
            if (!user) {
                Logger.error(
                    `SignIn attempt failed: User with email ${email} does not exist`
                )
                throw new Error('User does not exist')
            }
            const isValidPassword = await VerifyPassword(
                password,
                user.passwordhash,
                user.salt
            )
            if (isValidPassword) {
                const token = GenerateToken({
                    _id: String(user._id),
                    email: user.email,
                    role: user.role
                })
                return {
                    success: true,
                    message: 'User Successfully Signed In',
                    token
                }
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
}

export default UserService
