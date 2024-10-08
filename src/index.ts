import express from 'express'
import config from './config/config'
import Logger from './utils/logger'
import expressApp from './express-app'
import { connectDB } from './database'

export const app = express()
expressApp(app)
const StartServer = async () => {
    await connectDB()
    app.listen(config.PORT, () => {
        Logger.log(`Server Starting at Port: ${config.PORT}`)
    })
}

void StartServer()
