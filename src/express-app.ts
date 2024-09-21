import express, { Application } from 'express'
import cors from 'cors'
import { UserRouter } from './routes'

const expressApp = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use('/api/v1/user', UserRouter)
}

export default expressApp
