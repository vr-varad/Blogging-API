/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { userSignIn, userSignUp } from '../controller/UserController'

const router = express.Router()

router.post('/signup', userSignUp)
router.post('/signin', userSignIn)

export { router as UserRouter }
