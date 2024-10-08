/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'
import { BlogService } from '../services'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import {
    AddCommentInputs,
    CreateBlogInputs,
    UpdateBlogInputs
} from '../dto/Blog'
import Logger from '../utils/logger'

interface User extends JwtPayload {
    _id: mongoose.Types.ObjectId
    email: string
    role: string
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user: User
        }
    }
}

const blogService = new BlogService()

const CreateBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, category, tags }: CreateBlogInputs = req.body
        const { _id: author } = req.user
        const blog = await blogService.CreateBlog({
            title,
            content,
            author,
            category,
            tags
        })
        return res.status(201).json({
            success: true,
            blog
        })
    } catch (error) {
        Logger.error(`Error during creating blog: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error creating blog',
            error: (error as Error).message
        })
    }
}
const GetAllBlogs = async (req: Request, res: Response) => {
    try {
        const pageParam = req.query.page
        const pageSizeParam = req.query.pageSize
        const page = typeof pageParam === 'string' ? parseInt(pageParam) : 1
        const pageSize =
            typeof pageSizeParam === 'string' ? parseInt(pageSizeParam) : 10
        const blogs = await blogService.GetAllBlogs(page, pageSize)
        return res.status(200).json({
            success: true,
            ...blogs
        })
    } catch (error) {
        Logger.error(`Error during getting blog: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error getting blog',
            error: (error as Error).message
        })
    }
}
const GetBlogById = async (req: Request, res: Response) => {
    try {
        const { id: objectId } = req.params
        const blogId = new mongoose.Types.ObjectId(objectId)
        const blog = await blogService.GetBlogById(blogId)
        return res.status(200).json({
            success: true,
            blog
        })
    } catch (error) {
        Logger.error(`Error during getting blog: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error getting blog',
            error: (error as Error).message
        })
    }
}

const UpdateBlog = async (req: Request, res: Response) => {
    try {
        const { _id: authorId } = req.user
        const { id: objectId } = req.params
        const blogId = new mongoose.Types.ObjectId(objectId)
        const { title, content, category }: UpdateBlogInputs = req.body
        const updatedBlog = await blogService.UpdateBlog(blogId, authorId, {
            title,
            content,
            category
        })
        return res.status(200).json({
            success: true,
            updatedBlog
        })
    } catch (error) {
        Logger.error(`Error during updating blog: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error updating blog',
            error: (error as Error).message
        })
    }
}
const DeleteBlog = async (req: Request, res: Response) => {
    try {
        const { _id: authorId } = req.user
        const { id: objectId } = req.params
        const blogId = new mongoose.Types.ObjectId(objectId)

        const deletedBlog = await blogService.DeleteBlog(blogId, authorId)
        return res.status(200).json({
            success: true,
            deletedBlog
        })
    } catch (error) {
        Logger.error(`Error during updating blog: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error deleting blog',
            error: (error as Error).message
        })
    }
}

const AddComment = async (req: Request, res: Response) => {
    try {
        const { id: objectId } = req.params
        const blogId = new mongoose.Types.ObjectId(objectId)
        const { _id: authorId } = req.user
        const { content }: AddCommentInputs = req.body
        const blog = await blogService.AddCommentToBlog(
            blogId,
            authorId,
            content
        )
        return res.status(200).json({
            success: true,
            blog
        })
    } catch (error) {
        Logger.error(
            `Error during adding comment to blog: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error adding comment to blog',
            error: (error as Error).message
        })
    }
}

const GetBlogsdByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorName } = req.params
        const blogs = await blogService.GetAllBlogsFromAuthor(authorName)
        return res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        Logger.error(
            `Error during getting blog by author: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error getting blog by author',
            error: (error as Error).message
        })
    }
}

const GetBlogsdByTag = async (req: Request, res: Response) => {
    try {
        const { tagName } = req.params
        const blogs = await blogService.GetAllBlogsFromTags(tagName)
        return res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        Logger.error(
            `Error during getting blog by tag: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error getting blog by tags',
            error: (error as Error).message
        })
    }
}
const GetBlogsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryName } = req.params
        const blogs = await blogService.GetAllBlogsFromCategory(categoryName)
        return res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        Logger.error(
            `Error during getting blog by category: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error getting blog by category',
            error: (error as Error).message
        })
    }
}

export {
    CreateBlog,
    GetAllBlogs,
    GetBlogById,
    UpdateBlog,
    DeleteBlog,
    AddComment,
    GetBlogsByCategory,
    GetBlogsdByTag,
    GetBlogsdByAuthor
}
