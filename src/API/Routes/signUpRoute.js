// routes/signUpRoute.js
import express from "express";
import { signUpUser } from "../Controller/signUpController.js";

const router = express.Router();

// User signup
router.post("/", signUpUser);

export default router;
