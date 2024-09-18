/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import { Comment } from '../model'
import Logger from '../../utils/logger'

class CommentRepository {
    async getAllCommentsFromPostId(postId: mongoose.Types.ObjectId) {
        try {
            const comments = await Comment.find({
                postId
            })
            return comments
        } catch (error) {
            Logger.error(`Error getting comments: ${error}`)
            throw new Error(
                `Error getting comments: ${(error as Error).message}`
            )
        }
    }
    async getAllCommentsFromUserId(authorId: mongoose.Types.ObjectId) {
        try {
            const comments = await Comment.find({
                author: authorId
            })
            return comments
        } catch (error) {
            Logger.error(`Error getting comments: ${error}`)
            throw new Error(
                `Error getting comments: ${(error as Error).message}`
            )
        }
    }
}

export default CommentRepository
