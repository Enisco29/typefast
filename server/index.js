import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import historyRouter from "./routes/historyRoute.js";
import leaderboardRouter from "./routes/leaderboardRoute.js";
import streakRouter from "./routes/streakRouter.js";

const app = express();

await connectDB();

//middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: false,
}));
app.use(express.json());

//routes
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/users", userRouter)
app.use("/api/history", historyRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/streak", streakRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
