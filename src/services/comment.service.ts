/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import { CommentRepository } from '../database'
import Logger from '../utils/logger'

class CommentService {
    readonly commentRepository: CommentRepository

    constructor() {
        this.commentRepository = new CommentRepository()
    }

    async UpdateComment(commentId: mongoose.Types.ObjectId, content: string) {
        try {
            const comment = await this.commentRepository.updateComment(
                commentId,
                content
            )
            return comment
        } catch (error) {
            Logger.error(`Error Updating Comment Service: ${error}`)
            throw new Error(
                `Error Updating Comment Service: ${(error as Error).message}`
            )
        }
    }
    async DeleteComment(commentId: mongoose.Types.ObjectId) {
        try {
            const comment =
                await this.commentRepository.deleteComment(commentId)
            return comment
        } catch (error) {
            Logger.error(`Error Deleting Comment: ${error}`)
            throw new Error(
                `Error Deleting Comment: ${(error as Error).message}`
            )
        }
    }
}

export default CommentService
