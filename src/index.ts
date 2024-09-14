import express, { Request, Response } from 'express'
import config from './config/config'
import Logger from './utils/logger'

const app = express()

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'HEllo from the server'
    })
})

app.listen(config.PORT, () => {
    Logger.log(`Serever Starting at Port: ${config.PORT}`)
})
