/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import { BlogRepository } from '../database'
import Logger from '../utils/logger'
import CommentRepository from '../database/repository/comment.repository'
import CategoryRepository from '../database/repository/category.repository'

class BlogService {
    readonly blogRepository: BlogRepository
    readonly commentRepository: CommentRepository
    readonly categoryRepository: CategoryRepository
    constructor() {
        this.blogRepository = new BlogRepository()
        this.commentRepository = new CommentRepository()
        this.categoryRepository = new CategoryRepository()
    }

    async CreateBlog(inputData: {
        title: string
        content: string
        author: mongoose.Types.ObjectId
        category: Array<string>
        tags: Array<string>
    }) {
        try {
            const { title, content, author, category, tags } = inputData
            const blog = await this.blogRepository.createBlog(
                title,
                content,
                author,
                category,
                tags
            )
            return blog
        } catch (error) {
            Logger.error(`Error creating blog: ${error}`)
            throw new Error(`Error creating blog: ${(error as Error).message}`)
        }
    }
    async UpdateBlog(
        blogId: mongoose.Types.ObjectId,
        authorId: mongoose.Types.ObjectId,
        inputData: Partial<{
            title: string
            content: string
            category: string
        }>
    ) {
        try {
            const blog = await this.blogRepository.getBlogsById(blogId)

            if (!blog) {
                throw new Error('Blog not found')
            }

            if (!blog.author.equals(authorId)) {
                throw new Error(
                    'Unauthorized: You are not the author of this blog'
                )
            }

            const { title, content, category } = inputData

            const updatedBlog = await this.blogRepository.updateBlog(
                blogId,
                title || blog.title,
                content || blog.content,
                category
            )
            return updatedBlog
        } catch (error) {
            Logger.error(`Error updating blog: ${error}`)
            throw new Error(`Error updating blog: ${(error as Error).message}`)
        }
    }
    async DeleteBlog(
        blogId: mongoose.Types.ObjectId,
        authorId: mongoose.Types.ObjectId
    ) {
        try {
            const blog = await this.blogRepository.getBlogsById(blogId)

            if (!blog) {
                throw new Error('Blog not found')
            }

            if (!blog.author.equals(authorId)) {
                throw new Error(
                    'Unauthorized: You are not the author of this blog'
                )
            }
            await this.blogRepository.deleteBlog(blogId)
            return blog
        } catch (error) {
            Logger.error(`Error deleting blog: ${error}`)
            throw new Error(`Error deleting blog: ${(error as Error).message}`)
        }
    }
    async GetAllBlogs(page: number, pageSize: number) {
        try {
            const limit = pageSize
            const offset = (page - 1) * pageSize
            const blogs = await this.blogRepository.getAllBlogs(limit, offset)
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async GetBlogById(blogId: mongoose.Types.ObjectId) {
        try {
            const blog = await this.blogRepository.getBlogsById(blogId)
            if (!blog) {
                throw new Error(`Blog With Id ${blogId} Not Found`)
            }
            return blog
        } catch (error) {
            Logger.error(`Error getting blog: ${error}`)
            throw new Error(`Error getting blog: ${(error as Error).message}`)
        }
    }
    async GetAllBlogsFromAuthorId(authorId: mongoose.Types.ObjectId) {
        try {
            const blogs =
                await this.blogRepository.getAllBlogsFromAuthorId(authorId)
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }

    async AddCommentToBlog(
        blogId: mongoose.Types.ObjectId,
        authorId: mongoose.Types.ObjectId,
        content: string
    ) {
        try {
            const blog = await this.blogRepository.getBlogsById(blogId)
            if (!blog) {
                throw new Error(`Blog with Id ${blogId} not found`)
            }
            const comment = await this.commentRepository.addComment(
                blogId,
                authorId,
                content
            )
            blog.comments.push(comment._id)
            await blog.save()
            return blog
        } catch (error) {
            Logger.error(`Error addding comment to blogs: ${error}`)
            throw new Error(
                `Error addding comment to blogs: ${(error as Error).message}`
            )
        }
    }
}
export default BlogService
