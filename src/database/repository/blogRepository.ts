/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import Logger from '../../utils/logger'
import { Blog, Category, Comment } from '../model'

class BlogRepository {
    async createBlog(
        title: string,
        content: string,
        author: string,
        category: Array<string>,
        tags: Array<string>,
        comments: Array<string>
    ) {
        try {
            const blog = await Blog.create({
                title,
                content,
                author,
                category,
                tags,
                comments
            })
            return blog
        } catch (error) {
            Logger.error(`Error creating blog: ${error}`)
            throw new Error(`Error creating blog: ${(error as Error).message}`)
        }
    }
    async deleteBlog(blogId: string) {
        try {
            const blog = await Blog.findByIdAndDelete(blogId)
            if (blog === null) {
                Logger.error(`Blog with blogId ${blogId} doesn't exist.`)
                throw new Error(`Blog Not Found`)
            }
            return blog
        } catch (error) {
            Logger.error(`Error deleting blog: ${error}`)
            throw new Error(`Error deleting blog: ${(error as Error).message}`)
        }
    }
    async updateBlog(
        blogId: string,
        title: string,
        content: string,
        category: string
    ) {
        try {
            const blog = await Blog.findById(blogId)
            if (blog === null) {
                Logger.error(`Blog with blogId ${blogId} doesn't exist.`)
                throw new Error(`Blog Not Found`)
            }
            let existingCategory = await Category.findOne({ name: category })
            if (!existingCategory) {
                existingCategory = await Category.create({
                    name: category,
                    description: ''
                })
            }
            blog.title = title || blog.title
            blog.content = content || blog.content
            if (!blog.category.includes(existingCategory._id)) {
                blog.category.push(existingCategory._id)
            }
            await blog.save()
            return blog
        } catch (error) {
            Logger.error(`Error updating blog: ${error}`)
            throw new Error(`Error updating blog: ${(error as Error).message}`)
        }
    }
    async getAllBlogs() {
        try {
            const blogs = await Blog.find({})
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getAllBlogsFromAuthorId(authorId: mongoose.Types.ObjectId) {
        try {
            const blogs = await Blog.find({
                author: authorId
            })
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async addCommentToBlog(
        blogId: mongoose.Types.ObjectId,
        commentContent: string,
        commentAuthor: string
    ) {
        try {
            const blog = await Blog.findById(blogId)
            if (!blog) {
                Logger.error(`Blog with blogId ${blogId} doesn't exist.`)
                throw new Error(`Blog Not Found`)
            }
            const comment = await Comment.create({
                content: commentContent,
                author: commentAuthor,
                blogId: blog._id
            })
            blog.comments.push(comment._id)
            await blog.save()
            return blog
        } catch (error) {
            Logger.error(`Error adding comment to blogs: ${error}`)
            throw new Error(
                `Error adding comments to blogs: ${(error as Error).message}`
            )
        }
    }
    async addTagsToBlog(
        blogId: mongoose.Types.ObjectId,
        tag: mongoose.Types.ObjectId
    ) {
        try {
            const blog = await Blog.findById(blogId)
            if (blog == null) {
                Logger.error(`Blog with blogId ${blogId} doesn't exist.`)
                throw new Error(`Blog Not Found`)
            }
            blog.tags.push(tag)
            await blog.save()
            return blog
        } catch (error) {
            Logger.error(`Error adding tags to blogs: ${error}`)
            throw new Error(
                `Error adding tags to blogs: ${(error as Error).message}`
            )
        }
    }
    async getBlogsById(blogId: mongoose.Types.ObjectId) {
        try {
            const blog = await Blog.findById(blogId)
            if (blog == null) {
                Logger.error(`Blog with blogId ${blogId} doesn't exist.`)
                throw new Error(`Blog Not Found`)
            }
            return blog
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getBlogsByTags(tag: mongoose.Types.ObjectId) {
        try {
            const blogs = await Blog.find({})
            if (blogs.length < 1) return []
            const blogWithTags = blogs.filter((blog) => {
                blog.tags.includes(tag)
            })
            return blogWithTags
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getBlogsByCategory(category: mongoose.Types.ObjectId) {
        try {
            const blogs = await Blog.find({})
            if (blogs.length < 1) return []
            const blogWithCategory = blogs.filter((blog) => {
                blog.tags.includes(category)
            })
            return blogWithCategory
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
}

export default BlogRepository
