/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import { Comment } from '../model'
import Logger from '../../utils/logger'

class CommentRepository {
    async addComment(
        blogId: mongoose.Types.ObjectId,
        authorId: mongoose.Types.ObjectId,
        content: string
    ) {
        try {
            const comment = await Comment.create({
                blogId,
                content,
                authorId
            })
            return comment
        } catch (error) {
            Logger.error(`Error adding comments: ${error}`)
            throw new Error(
                `Error adding comments: ${(error as Error).message}`
            )
        }
    }
    async deleteComment(commentId: mongoose.Types.ObjectId) {
        try {
            const comment = await Comment.findByIdAndDelete({
                commentId
            })
            return comment
        } catch (error) {
            Logger.error(`Error deleting comments: ${error}`)
            throw new Error(
                `Error deleting comments: ${(error as Error).message}`
            )
        }
    }
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
                authorId
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
