import mongoose from 'mongoose'
import config from '../config/config'
import Logger from '../utils/logger'

const connectDB = async () => {
    try {
        await mongoose.connect(config.DATABASE_URL as string, {
            dbName: 'Blogging-API',
            maxPoolSize: 10,
            minPoolSize: 2
        })
        Logger.log('DB Connected')
    } catch (error) {
        Logger.error((error as Error).message)
        process.exit(1)
    }
}

export default connectDB
