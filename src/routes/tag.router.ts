/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { createTag, getAllTags } from '../controller/tag.controller'
import AdminMiddleware from '../middleware/AdminAuth'
import AuthMiddleware from '../middleware/CommonAuth'

const router = express.Router()

router.get('/', getAllTags)
router.use(AuthMiddleware)
router.use(AdminMiddleware)
router.post('/', createTag)

export { router as TagRouter }
