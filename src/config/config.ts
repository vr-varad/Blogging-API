import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

export default {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET
}
