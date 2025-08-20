// models/History.js
import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  durationSeconds: {
    type: Number,
    required: true,
  },
  charactersTyped: {
    type: Number,
    required: true,
  },
  textLength: {
    type: Number,
    required: true,
  },
  dateISO: {
    type: Date,
    default: Date.now,
  },
});

const  History =  mongoose.model("History", HistorySchema);

export default History
