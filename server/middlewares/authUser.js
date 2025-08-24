import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      currentStreak: decoded.currentStreak,
      maxStreak: decoded.maxStreak,
      totalTests: decoded.totalTests,
      weeklyStreak: decoded.weeklyStreak,
      totalPoints: decoded.totalPoints,
      currentPeriodPoints: decoded.currentPeriodPoints,
    };

    next();
  });
};
