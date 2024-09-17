/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BlogRepository } from '../database'
import Logger from '../utils/logger'

class BlogService {
    readonly repository: BlogRepository
    constructor(repository: BlogRepository) {
        this.repository = repository
    }

    async PostBlog(inputData: {
        title: string
        content: string
        author: string
        category: string
        tags: Array<string>
        comments: Array<string>
    }) {
        try {
            const { title, content, author, category, tags, comments } =
                inputData
            const blog = await this.repository.createBlog(
                title,
                content,
                author,
                category,
                tags,
                comments
            )
            return blog
        } catch (error) {
            Logger.error(`Error creating blog: ${error}`)
            throw new Error(`Error creating blog: ${(error as Error).message}`)
        }
    }
    async UpdateBlog(
        blogId: string,
        inputData: Partial<{
            title: string
            content: string
            category: string
        }>
    ) {
        try {
            const { title, content, category } = inputData
            const blog = await this.repository.updateBlog(
                blogId,
                String(title),
                String(content),
                String(category)
            )
            return blog
        } catch (error) {
            Logger.error(`Error updating blog: ${error}`)
            throw new Error(`Error updating blog: ${(error as Error).message}`)
        }
    }
    async DeleteBlog(blogId: string) {
        try {
            const blog = await this.repository.deleteBlog(blogId)
            return blog
        } catch (error) {
            Logger.error(`Error deleting blog: ${error}`)
            throw new Error(`Error deleting blog: ${(error as Error).message}`)
        }
    }
    async GetAllBlogs() {
        try {
            const blogs = await this.repository.getAllBlogs()
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
    async GetAllBlogsFromAuthorId(authorId: string) {
        try {
            const blogs =
                await this.repository.getAllBlogsFromAuthorId(authorId)
            return blogs
        } catch (error) {
            Logger.error(`Error getting blogs: ${error}`)
            throw new Error(`Error getting blogs: ${(error as Error).message}`)
        }
    }
}
export default BlogService
