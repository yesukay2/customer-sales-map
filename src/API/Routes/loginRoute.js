// routes/loginRoute.js
import express from "express";
import { loginUser } from "../Controller/loginController.js";

const router = express.Router();
// User login
router.post("/", loginUser);

export default router;
