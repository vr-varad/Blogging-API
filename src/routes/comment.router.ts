/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { deleteComment, updateComment } from '../controller/comment.controller'
import AuthMiddleware from '../middleware/CommonAuth'

const router = express.Router()

router.use(AuthMiddleware)
router.put('/:id', updateComment)
router.delete('/:id', deleteComment)

export { router as CommentRouter }
