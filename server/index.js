import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();

await connectDB();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/users", userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
