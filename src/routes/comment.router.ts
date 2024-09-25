/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { deleteComment, updateComment } from '../controller/comment.controller'

const router = express.Router()

router.put('/:id', updateComment)
router.delete('/:id', deleteComment)

export { router as CommentRouter }
