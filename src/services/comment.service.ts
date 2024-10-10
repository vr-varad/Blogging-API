/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import { CommentRepository } from '../database'
import Logger from '../utils/logger'
import {
    NotFoundError,
    ServiceError,
    UnAuthorizedError
} from '../utils/errorHandler'

class CommentService {
    readonly commentRepository: CommentRepository

    constructor() {
        this.commentRepository = new CommentRepository()
    }

    async UpdateComment(
        authorId: mongoose.Types.ObjectId,
        commentId: mongoose.Types.ObjectId,
        content: string
    ) {
        try {
            const comment =
                await this.commentRepository.getCommentFromCommentId(commentId)
            if (!comment) {
                throw new NotFoundError('Comment Not Found')
            }
            if (comment.authorId.toString() != authorId.toString()) {
                throw new UnAuthorizedError(
                    'UnAuthorized: You are not the author of this comment'
                )
            }
            const updatedComment = await this.commentRepository.updateComment(
                commentId,
                content
            )
            return updatedComment
        } catch (error) {
            Logger.error(`Error Updating Comment Service: ${error}`)
            throw new ServiceError(
                `Error Updating Comment Service: ${(error as Error).message}`
            )
        }
    }
    async DeleteComment(
        authorId: mongoose.Types.ObjectId,
        commentId: mongoose.Types.ObjectId
    ) {
        try {
            const comment =
                await this.commentRepository.getCommentFromCommentId(commentId)
            if (!comment) {
                throw new NotFoundError('Comment Not Found')
            }
            if (comment.authorId.toString() != authorId.toString()) {
                throw new UnAuthorizedError(
                    'UnAuthorized: You are not the author of this comment'
                )
            }
            const deletedComment =
                await this.commentRepository.deleteComment(commentId)
            return deletedComment
        } catch (error) {
            Logger.error(`Error Deleting Comment: ${error}`)
            throw new ServiceError(
                `Error Deleting Comment: ${(error as Error).message}`
            )
        }
    }
}

export default CommentService
