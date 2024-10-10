/* eslint-disable @typescript-eslint/restrict-template-expressions */
import mongoose from 'mongoose'
import Logger from '../utils/logger'
import {
    TagRepository,
    CommentRepository,
    CategoryRepository,
    BlogRepository,
    UserRepository
} from '../database'
import {
    NotFoundError,
    ServiceError,
    UnAuthorizedError
} from '../utils/errorHandler'

class BlogService {
    readonly blogRepository: BlogRepository
    readonly commentRepository: CommentRepository
    readonly categoryRepository: CategoryRepository
    readonly tagRepository: TagRepository
    readonly userRepository: UserRepository
    constructor() {
        this.blogRepository = new BlogRepository()
        this.commentRepository = new CommentRepository()
        this.categoryRepository = new CategoryRepository()
        this.tagRepository = new TagRepository()
        this.userRepository = new UserRepository()
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
            throw new ServiceError(
                `Error creating blog: ${(error as Error).message}`
            )
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
                throw new NotFoundError('Blog not found')
            }

            if (blog.author._id !== authorId) {
                throw new UnAuthorizedError(
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
            throw new ServiceError(
                `Error updating blog: ${(error as Error).message}`
            )
        }
    }
    async DeleteBlog(
        blogId: mongoose.Types.ObjectId,
        authorId: mongoose.Types.ObjectId
    ) {
        try {
            const blog = await this.blogRepository.getBlogsById(blogId)

            if (!blog) {
                throw new NotFoundError('Blog not found')
            }

            if (!blog.author.equals(authorId)) {
                throw new UnAuthorizedError(
                    'Unauthorized: You are not the author of this blog'
                )
            }
            await this.blogRepository.deleteBlog(blogId)
            return blog
        } catch (error) {
            Logger.error(`Error deleting blog: ${error}`)
            throw new ServiceError(
                `Error deleting blog: ${(error as Error).message}`
            )
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
            throw new ServiceError(
                `Error getting blogs: ${(error as Error).message}`
            )
        }
    }
    async GetBlogById(blogId: mongoose.Types.ObjectId) {
        try {
            const blog = await this.blogRepository.getBlogsById(blogId)
            if (!blog) {
                throw new NotFoundError(`Blog With Id ${blogId} Not Found`)
            }
            return blog
        } catch (error) {
            Logger.error(`Error getting blog: ${error}`)
            throw new ServiceError(
                `Error getting blog: ${(error as Error).message}`
            )
        }
    }
    async GetAllBlogsFromAuthor(authorName: string) {
        try {
            const author = await this.userRepository.GetUserByName(authorName)
            if (!author) {
                throw new NotFoundError(
                    `Author With name ${authorName} Not Found`
                )
            }
            const authorId = author._id
            const blogs =
                await this.blogRepository.getAllBlogsFromAuthorId(authorId)
            return blogs
        } catch (error) {
            Logger.error(
                `Error getting blogs for author ${authorName}: ${(error as Error).message}`
            )
            throw new ServiceError(
                `Error getting blogs for author ${authorName}: ${(error as Error).message}`
            )
        }
    }

    async GetAllBlogsFromTags(tagName: string) {
        try {
            const tag = await this.tagRepository.getTagByName(tagName)
            if (!tag) {
                throw new NotFoundError(`Tag with name ${tagName} not found`)
            }
            const tagId = tag._id
            const blogs = await this.blogRepository.getBlogsByTags(tagId)
            return blogs
        } catch (error) {
            Logger.error(
                `Error getting blogs for tag ${tagName}: ${(error as Error)?.message}`
            )
            throw new ServiceError(
                `Error getting blogs for tag ${tagName}: ${(error as Error)?.message}`
            )
        }
    }

    async GetAllBlogsFromCategory(categoryName: string) {
        try {
            const category =
                await this.categoryRepository.getCategoryByName(categoryName)
            if (!category) {
                throw new NotFoundError(
                    `Category with name ${categoryName} not found`
                )
            }
            const categoryId = category._id
            const blogs =
                await this.blogRepository.getBlogsByCategory(categoryId)
            return blogs
        } catch (error) {
            Logger.error(
                `Error getting blogs for category ${categoryName}: ${(error as Error)?.message}`
            )
            throw new ServiceError(
                `Error getting blogs for category ${categoryName}: ${(error as Error)?.message}`
            )
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
                throw new NotFoundError(`Blog with Id ${blogId} not found`)
            }
            const comment = await this.commentRepository.addComment(
                blogId,
                authorId,
                content
            )
            const updateBlog = await this.blogRepository.addCommenttoBlog(
                blogId,
                comment._id
            )
            return updateBlog
        } catch (error) {
            Logger.error(`Error addding comment to blogs: ${error}`)
            throw new ServiceError(
                `Error addding comment to blogs: ${(error as Error).message}`
            )
        }
    }
}
export default BlogService
