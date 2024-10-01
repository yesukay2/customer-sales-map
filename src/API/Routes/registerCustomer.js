// routes/registerCustomer.js
import express from "express";
import { registerCustomer } from "../Controller/customerRegistration.js";

const router = express.Router();

// Register a new customer
router.post("/", registerCustomer);

export default router;
