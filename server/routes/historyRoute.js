import express from 'express'
import { addHistory, deleteAllHistory, deleteHistoryEntry, getHistory } from '../controllers/historyController.js'
import { authUser } from "../middlewares/authUser.js";

const historyRouter = express.Router()

historyRouter.post('/add', authUser, addHistory)
historyRouter.get('/:userId', authUser, getHistory)
historyRouter.delete('/:id', authUser, deleteHistoryEntry)
historyRouter.delete('/delete-all/:userId', authUser, deleteAllHistory)

export default historyRouter