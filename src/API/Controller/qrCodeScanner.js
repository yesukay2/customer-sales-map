// controllers/QRCodeScannerController.js
import Customer from "../Model/Customer.js"; // Assuming you have a Customer model

export const scanQRCode = async (req, res) => {
  const qrCode = req.params.qrCode;
  try {
    const customer = await Customer.findOne({ qrCode: qrCode });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLastScanned = async (req, res) => {
  const id = req.params.id;
  const { lastScanned } = req.body;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.lastScanned = lastScanned;
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
