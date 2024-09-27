/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import AuthMiddleware from '../middleware/CommonAuth'
import {
    AddComment,
    CreateBlog,
    DeleteBlog,
    GetAllBlogs,
    GetBlogById,
    GetBlogsByCategory,
    GetBlogsdByAuthor,
    GetBlogsdByTag,
    UpdateBlog
} from '../controller/blog.controller'

const router = express.Router()

router.get('/', GetAllBlogs)
router.get('/:id', GetBlogById)
router.use(AuthMiddleware)
router.post('/', CreateBlog)
router.put('/:id', UpdateBlog)
router.delete('/:id', DeleteBlog)
router.post('/:id/comment', AddComment)
router.get('/author/:authorName', GetBlogsdByAuthor)
router.get('/tag/:tagName', GetBlogsdByTag)
router.get('/category/:categoryName', GetBlogsByCategory)

export { router as BlogRouter }
