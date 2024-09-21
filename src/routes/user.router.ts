/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
    userProfile,
    userSignIn,
    userSignUp
} from '../controller/user.controller'
import AuthMiddleware from '../middleware/CommonAuth'

const router = express.Router()

router.post('/signup', userSignUp)
router.post('/signin', userSignIn)
router.use(AuthMiddleware)
router.get('/profile', userProfile)

export { router as UserRouter }
