import { createClient } from 'redis'
import Logger from './logger'

const redisClient = createClient()

redisClient
    .connect()
    .then(() => Logger.success('Redis Client Started'))
    .catch((err: Error) =>
        Logger.warn(`Redis connection error: ${err.message}`)
    )

export default redisClient
