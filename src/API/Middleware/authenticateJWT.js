import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Bearer token

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Save the user info to the request
    next();
  });
};
