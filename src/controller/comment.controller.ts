/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'
import { CommentService } from '../services'
import { UpdateCommentInputs } from '../dto/Comment'
import Logger from '../utils/logger'
import mongoose from 'mongoose'

const commentService = new CommentService()

const updateComment = async (req: Request, res: Response) => {
    try {
        const { id: objectId } = req.params
        const commentId = new mongoose.Types.ObjectId(objectId)
        const { content }: UpdateCommentInputs = req.body
        const comment = await commentService.UpdateComment(commentId, content)
        return res.json({
            success: true,
            comment
        })
    } catch (error) {
        Logger.error(
            `Error during updating comment: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: (error as Error).message
        })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const { id: objectId } = req.params
        const commentId = new mongoose.Types.ObjectId(objectId)
        const comment = await commentService.DeleteComment(commentId)
        return res.json({
            success: true,
            comment
        })
    } catch (error) {
        Logger.error(
            `Error during deleting comment: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: (error as Error).message
        })
    }
}

export { updateComment, deleteComment }
