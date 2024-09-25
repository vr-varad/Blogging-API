/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import Logger from '../../utils/logger'
import { User } from '../model'

class UserRepository {
    async createUser(
        username: string,
        bio: string,
        email: string,
        passwordhash: string,
        salt: string,
        role: string
    ) {
        try {
            const user = await User.create({
                username,
                bio,
                email,
                passwordhash,
                salt,
                role
            })
            return user
        } catch (error) {
            Logger.error(`Error creating user: ${error}`)
            throw new Error(`Error creating user: ${(error as Error).message}`)
        }
    }

    async UpdateUser(
        userId: string,
        username: string,
        bio: string,
        email: string
    ) {
        try {
            const user = await User.findById(userId)
            if (!user) {
                Logger.error(`User with userId ${userId} doesn't exist`)
                throw new Error('User not found')
            } else {
                user.username = username || user.username
                user.bio = bio || user.bio
                user.email = email || user.email
                await user.save()
                const { passwordhash, salt, ...safeUser } = user
                return safeUser
            }
        } catch (error) {
            Logger.error(`Error updating user with ID ${userId}: ${error}`)
            throw new Error(`Error updating user: ${(error as Error).message}`)
        }
    }

    async GetUser() {
        try {
            const users = await User.find({})
            const safeUsers = users.map((user) => {
                const { passwordhash, salt, ...safeUser } = user
                return safeUser
            })
            return safeUsers
        } catch (error) {
            Logger.error(`Error getting user: ${error}`)
            throw new Error(`Error getting user: ${(error as Error).message}`)
        }
    }

    async GetUserById(userId: mongoose.Types.ObjectId) {
        try {
            const user = await User.findById(userId)
            if (!user) {
                Logger.warn(`User with UserId ${userId} Not Found`)
                return null
            }
            return user
        } catch (error) {
            Logger.error(`Error getting user with ID ${userId}: ${error}`)
            throw new Error(`Error getting user: ${(error as Error).message}`)
        }
    }

    async GetUserByName(userName: string) {
        try {
            const user = await User.findOne({
                username: userName
            })
            if (!user) {
                Logger.warn(`User with UserName ${userName} Not Found`)
                return null
            }
            return user
        } catch (error) {
            Logger.error(`Error getting user with name ${userName}: ${error}`)
            throw new Error(`Error getting user: ${(error as Error).message}`)
        }
    }

    async GetUserByEmail(userEmail: string) {
        try {
            const user = await User.findOne({
                email: userEmail
            })
            if (!user) {
                Logger.warn(`User with UserEmail ${userEmail} Not Found`)
                return null
            }
            return user
        } catch (error) {
            Logger.error(`Error getting user with email ${userEmail}: ${error}`)
            throw new Error(`Error getting user: ${(error as Error).message}`)
        }
    }
}

export default UserRepository
