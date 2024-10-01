import express from "express";
import { getCustomers } from "../Controller/customerList.js";

const router = express.Router();

// Route to fetch all customers
router.get("/", getCustomers);

export default router;
