import express, { Application } from 'express'
import cors from 'cors'
import {
    UserRouter,
    BlogRouter,
    CommentRouter,
    CategoryRouter,
    TagRouter
} from './routes'
import Limiter from './utils/rateLimiting'

const expressApp = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(Limiter)
    app.use('/api/v1/user', UserRouter)
    app.use('/api/v1/blogs', BlogRouter)
    app.use('/api/v1/comments', CommentRouter)
    app.use('/api/v1/categories', CategoryRouter)
    app.use('/api/v1/tags', TagRouter)
}

export default expressApp
