/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import Logger from '../../utils/logger'
import { Blog, Category, Tag } from '../model'
import redisClient from '../../utils/redisClient'
import { BlogDoc } from '../model/Blog'

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
                if (existingTag) {
                    blog.tags.push(existingTag._id)
                }
            }

            for (const cat of category) {
                const existingCategory = await Category.findOne({
                    name: cat
                })
                if (existingCategory) {
                    blog.category.push(existingCategory._id)
                }
            }

            await blog.save()

            await redisClient.del('blogs')
            await redisClient.del('blogsByAuthor')
            await redisClient.del('blogsByTag')
            await redisClient.del('blogsByCategory')

            return blog
        } catch (error) {
            Logger.error(`Error creating blog: ${error}`)
            throw new Error(`Error creating blog: ${(error as Error).message}`)
        }
    }
    async deleteBlog(blogId: mongoose.Types.ObjectId) {
        try {
            const blog = await Blog.findByIdAndDelete(blogId)
            if (!blog) {
                Logger.warn(`Blog with Id ${blogId} Not Found`)
                return null
            }

            await redisClient.del('blogs')
            await redisClient.del('blogsByAuthor')
            await redisClient.del('blogsByTag')
            await redisClient.del('blogsByCategory')

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
            if (!blog) {
                Logger.warn(`Blog With BlogId ${blogId} Not Found`)
                return null
            }
            if (category) {
                const existingCategory = await Category.findOne({
                    name: category
                })
                if (existingCategory) {
                    if (!blog.category.includes(existingCategory._id)) {
                        blog.category.push(existingCategory._id)
                    }
                }
            }
            blog.title = title || blog.title
            blog.content = content || blog.content
            await blog.save()

            await redisClient.del('blogs')
            await redisClient.del('blogsByAuthor')
            await redisClient.del('blogsByTag')
            await redisClient.del('blogsByCategory')

            return blog
        } catch (error) {
            Logger.error(`Error updating blog: ${error}`)
            throw new Error(`Error updating blog: ${(error as Error).message}`)
        }
    }
    async getAllBlogs(limit: number = 10, offset: number = 0) {
        try {
            const cachedBlogs = await redisClient.get('blogs')
            if (cachedBlogs) {
                return JSON.parse(cachedBlogs) as BlogDoc
            }
            const blogs = await Blog.find({}).skip(offset).limit(limit)
            await redisClient.set('blogs', JSON.stringify(blogs), {
                EX: 60 * 60
            })
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getAllBlogsFromAuthorId(authorId: mongoose.Types.ObjectId) {
        try {
            const cachedBlogsByAuthor = await redisClient.get('blogsByAuthor')
            if (cachedBlogsByAuthor) {
                return JSON.parse(cachedBlogsByAuthor) as BlogDoc
            }
            const blogs = await Blog.find({
                author: authorId
            })
            await redisClient.set('blogsByAuthor', JSON.stringify(blogs), {
                EX: 60 * 60
            })
            if (blogs.length === 0) {
                Logger.warn(`No blogs found for author with Id ${authorId}`)
            }
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getBlogsById(blogId: mongoose.Types.ObjectId) {
        try {
            const cachedBlog = await redisClient.get(`blog:${blogId}`)
            if (cachedBlog) {
                return JSON.parse(cachedBlog) as BlogDoc
            }
            const blog = await Blog.findById(blogId).populate([
                'category',
                'tags',
                'author',
                'comments'
            ])
            if (!blog) {
                Logger.warn(`Blog with blogId ${blogId} doesn't exist.`)
                return null
            }
            await redisClient.set(`blog:${blogId}`, JSON.stringify(blog), {
                EX: 60 * 60
            })
            return blog
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getBlogsByTags(tag: mongoose.Types.ObjectId) {
        try {
            const cachedBlogsByTag = await redisClient.get('blogsByTag')
            if (cachedBlogsByTag) {
                return JSON.parse(cachedBlogsByTag) as BlogDoc
            }
            const blogs = await Blog.find({ tags: { $in: [tag] } })
            if (blogs.length) {
                await redisClient.set('blogsByTag', JSON.stringify(blogs), {
                    EX: 60 * 60
                })
            }
            return blogs.length ? blogs : null
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async getBlogsByCategory(category: mongoose.Types.ObjectId) {
        try {
            const cachedBlogsByCategory =
                await redisClient.get('blogsByCategory')
            if (cachedBlogsByCategory) {
                return JSON.parse(cachedBlogsByCategory) as BlogDoc
            }
            const blogs = await Blog.find({ category: { $in: [category] } })
            await redisClient.set('blogsByCategory', JSON.stringify(blogs), {
                EX: 60 * 60
            })
            return blogs.length ? blogs : null
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
}

export default BlogRepository
