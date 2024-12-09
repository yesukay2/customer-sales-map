// controllers/LoginController.js
import User from "../Model/User.js"; // Assuming you have a User model
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  console.log("route");
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = user.generateAuthToken();
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
