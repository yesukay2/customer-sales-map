// routes/qrCodeScan.js
import express from "express";
import { scanQRCode } from "../Controller/qrCodeScanner.js";
import { updateLastScanned } from "../Controller/qrCodeScanner.js";

const router = express.Router();

// Scan QR code and get customer details
router.get("/:qrCode", scanQRCode);

// update customer lastScanned
router.patch("/:id", updateLastScanned);

export default router;
