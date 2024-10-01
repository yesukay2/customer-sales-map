// server.js
import express from "express";
import process from "process";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "./Routes/loginRoute.js";
import qrCodeScan from "./Routes/qrCodeScan.js";
import registerCustomer from "./Routes/registerCustomer.js";
import signUpRoute from "./Routes/signUpRoute.js";
import customerList from "./Routes/customerList.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Use the routes
app.use("/csm/login", loginRoute);
app.use("/csm/qr-code", qrCodeScan);
app.use("/csm/qr-code/update-last-scanned", qrCodeScan);
app.use("/csm/customers/register", registerCustomer);
app.use("/csm/customers", customerList);
app.use("/csm/signup", signUpRoute);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
