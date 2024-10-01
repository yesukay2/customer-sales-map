import Customer from "../Model/Customer.js";

// Controller function to fetch all customers
export const getCustomers = async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();

    // If customers are found, send them in the response
    if (customers) {
      return res.status(200).json(customers);
    } else {
      return res.status(404).json({ message: "No customers found" });
    }
  } catch (error) {
    // Handle any errors during the database query
    console.error("Error fetching customers:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
