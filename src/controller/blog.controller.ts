/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'
import { BlogService } from '../services'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { CreateBlogInputs, UpdateBlogInputs } from '../dto/Blog'
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
        const blogs = await blogService.GetAllBlogs()
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
            message: 'Error updating blog',
            error: (error as Error).message
        })
    }
}

export { CreateBlog, GetAllBlogs, GetBlogById, UpdateBlog, DeleteBlog }
