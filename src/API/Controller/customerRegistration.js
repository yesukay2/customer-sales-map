// controllers/CustomerRegistrationController.js
import Customer from "../Model/Customer.js"; // Assuming you have a Customer model

export const registerCustomer = async (req, res) => {
  const { name, email, phone, qrCode, shopName, geolocation } = req.body;

  const newCustomer = new Customer({
    name,
    email,
    phone,
    qrCode,
    shopName,
    geolocation,
  });

  try {
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
