import express from 'express'
import config from './config/config'
import Logger from './utils/logger'
import expressApp from './express-app'
import { connectDB } from './database'

const StartServer = async () => {
    const app = express()
    await connectDB()
    expressApp(app)
    app.listen(config.PORT, () => {
        Logger.log(`Serever Starting at Port: ${config.PORT}`)
    })
}

void StartServer()
