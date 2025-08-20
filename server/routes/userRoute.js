import express from "express";
import { login, logout, register } from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/signup", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, (req, res) => {
  res.json({
    success: true,
    user: {
      email: req.user.email,
      name: req.user.name,
    },
  });
});
userRouter.get("/logout", authUser, logout)

export default userRouter;
