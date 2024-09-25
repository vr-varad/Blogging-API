/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
    createCategory,
    getAllCategory
} from '../controller/category.controller'
import AuthMiddleware from '../middleware/CommonAuth'
import AdminMiddleware from '../middleware/AdminAuth'

const router = express.Router()

router.get('/', getAllCategory)
router.use(AuthMiddleware)
router.use(AdminMiddleware)
router.post('/', createCategory)

export { router as CategoryRouter }
