import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//function to register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if ((!name || !email || !password))
      return res.json({
        success: false,
        message: "Missing Details",
      });

    //checks if the user already exists
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //hashing of password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        name: user.name,
        currentStreak: user.currentStreak || 0,
        maxStreak: user.maxStreak || 0,
        totalTests: user.totalTests || 0,
        totalPoints: user.totalPoints || 0,
        currentPeriodPoints: user.currentPeriodPoints || 0,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,
      success: true,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//function to sign in user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    //checks if the user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    //compares the inputed password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        currentStreak: user.currentStreak || 0,
        maxStreak: user.maxStreak || 0,
        totalTests: user.totalTests || 0,
        totalPoints: user.totalPoints || 0,
        currentPeriodPoints: user.currentPeriodPoints || 0,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      token,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};
