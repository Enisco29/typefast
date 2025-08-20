import express from 'express'
import { getLeaderboard } from '../controllers/leaderboardController.js'
import { authUser } from '../middlewares/authUser.js'

const leaderboardRouter = express.Router()

leaderboardRouter.get('/', authUser, getLeaderboard)

export default leaderboardRouter