import express from 'express'
import { authUser } from '../middlewares/authUser.js'
import { getStreak, updateStreak } from '../controllers/streakController.js'

const streakRouter = express.Router()

streakRouter.post("/update", authUser, updateStreak)
streakRouter.get("/", authUser, getStreak)

export default streakRouter