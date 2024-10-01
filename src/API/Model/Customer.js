import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: true },
  qrCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  shopName: { type: String, required: true },
  //   shopLocation: { type: String, required: true },
  geolocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  lastScanned: { type: String, default: null },
});

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
