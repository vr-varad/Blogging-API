/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import AuthMiddleware from '../middleware/CommonAuth'
import {
    CreateBlog,
    DeleteBlog,
    GetAllBlogs,
    GetBlogById,
    UpdateBlog
} from '../controller/blog.controller'

const router = express.Router()

router.get('/', GetAllBlogs)
router.get('/:id', GetBlogById)
router.use(AuthMiddleware)
router.post('/', CreateBlog)
router.put('/:id', UpdateBlog)
router.delete('/:id', DeleteBlog)

export { router as BlogRouter }
