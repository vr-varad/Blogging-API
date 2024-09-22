/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import Logger from '../../utils/logger'
import { Blog, Category, Tag } from '../model'

class BlogRepository {
    async createBlog(
        title: string,
        content: string,
        author: mongoose.Types.ObjectId,
        category: Array<string>,
        tags: Array<string>
    ) {
        try {
            const blog = await Blog.create({
                title,
                content,
                author,
                category: [],
                tags: []
            })
            for (const tag of tags) {
                const existingTag = await Tag.findOne({ name: tag })
                if (!existingTag) {
                    const newTag = await Tag.create({ name: tag })
                    blog.tags.push(newTag._id)
                } else {
                    blog.tags.push(existingTag._id)
                }
            }

            for (const cat of category) {
                const existingCategory = await Category.findOne({
                    name: cat
                })
                if (!existingCategory) {
                    const newCategory = await Category.create({ name: cat })
                    blog.category.push(newCategory._id)
                } else {
                    blog.category.push(existingCategory._id)
                }
            }

            await blog.save()

            return blog
        } catch (error) {
            Logger.error(`Error creating blog: ${error}`)
            throw new Error(`Error creating blog: ${(error as Error).message}`)
        }
    }
    async deleteBlog(blogId: mongoose.Types.ObjectId) {
        try {
            const blog = await Blog.findByIdAndDelete(blogId)
            return blog
        } catch (error) {
            Logger.error(`Error deleting blog: ${error}`)
            throw new Error(`Error deleting blog: ${(error as Error).message}`)
        }
    }
    async updateBlog(
        blogId: mongoose.Types.ObjectId,
        title: string | undefined,
        content: string | undefined,
        category: string | undefined
    ) {
        try {
            const blog = await Blog.findById(blogId)
            if (blog) {
                if (category) {
                    let existingCategory = await Category.findOne({
                        name: category
                    })
                    if (!existingCategory || category !== 'undefined') {
                        existingCategory = await Category.create({
                            name: category,
                            description: ''
                        })
                    }
                    if (!blog.category.includes(existingCategory._id)) {
                        blog.category.push(existingCategory._id)
                    }
                }
                blog.title = title || blog.title
                blog.content = content || blog.content
                await blog.save()
                return blog
            }
            throw new Error(`Error updating blog`)
        } catch (error) {
            Logger.error(`Error updating blog: ${error}`)
            throw new Error(`Error updating blog: ${(error as Error).message}`)
        }
    }
    async getAllBlogs(limit: number = 10, offset: number = 0) {
        try {
            const blogs = await Blog.find({}).skip(offset).limit(limit)
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
