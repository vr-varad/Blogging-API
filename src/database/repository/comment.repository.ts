/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import { Comment } from '../model'
import Logger from '../../utils/logger'
import redisClient from '../../utils/redisClient'
import { DatabaseError } from '../../utils/errorHandler'

class CommentRepository {
    async addComment(
        blogId: mongoose.Types.ObjectId,
        authorId: mongoose.Types.ObjectId,
        content: string
    ) {
        try {
            const comment = new Comment({
                blogId,
                content,
                authorId
            })

            await redisClient.del('blogs')

            return comment
                .save()
                .then((comment) => comment.populate('authorId'))
        } catch (error) {
            Logger.error(`Error adding comments: ${error}`)
            throw new DatabaseError(
                `Error adding comments: ${(error as Error).message}`
            )
        }
    }
    async updateComment(commentId: mongoose.Types.ObjectId, content: string) {
        try {
            const comment = await Comment.findByIdAndUpdate(
                commentId,
                {
                    content
                },
                { new: true }
            )
            if (!comment) {
                Logger.warn(`Comment With CommentId ${commentId} Not Found`)
                return null
            }
            return comment
        } catch (error) {
            Logger.error(`Error updating comments: ${error}`)
            throw new DatabaseError(
                `Error updating comments: ${(error as Error).message}`
            )
        }
    }
    async deleteComment(commentId: mongoose.Types.ObjectId) {
        try {
            const comment = await Comment.findByIdAndDelete(commentId)
            if (!comment) {
                Logger.warn(`Comment With CommentId ${commentId} Not Found`)
                return null
            }

            await redisClient.del('blogs')

            return comment
        } catch (error) {
            Logger.error(`Error deleting comments: ${error}`)
            throw new DatabaseError(
                `Error deleting comments: ${(error as Error).message}`
            )
        }
    }
    async getAllCommentsFromPostId(postId: mongoose.Types.ObjectId) {
        try {
            const comments = await Comment.find({
                postId
            }).lean()
            return comments
        } catch (error) {
            Logger.error(
                `Error getting comments from postId ${postId}: ${error}`
            )
            throw new DatabaseError(
                `Error getting comments: ${(error as Error).message}`
            )
        }
    }
    async getAllCommentsFromUserId(authorId: mongoose.Types.ObjectId) {
        try {
            const comments = await Comment.find({
                authorId
            }).lean()
            return comments
        } catch (error) {
            Logger.error(
                `Error getting comments from authorId ${authorId}: ${error}`
            )
            throw new Error(
                `Error getting comments: ${(error as Error).message}`
            )
        }
    }

    async getCommentFromCommentId(commentId: mongoose.Types.ObjectId) {
        try {
            const comment = await Comment.findById(commentId).lean()
            if (!comment) {
                Logger.warn(`Comment not found for ID: ${commentId}`)
                return null
            }
            return comment
        } catch (error) {
            Logger.error(
                `Error getting comment from commentId ${commentId}: ${error}`
            )
            throw new DatabaseError(
                `Error getting comment: ${(error as Error).message}`
            )
        }
    }
}

export default CommentRepository
