import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Styles/invoice.css"; // Custom styles for the invoice

const Invoice = () => {
  const { state } = useLocation();
  const { customerDetails } = state;
  const [quantities, setQuantities] = useState({
    sassoCoil: 0,
    sassoSpraySmall: 0,
    sassoSprayLarge: 0,
    fekkoStarch: 0,
    romaCoil: 0,
    romaSpray: 0,
    kel360: 0,
    kelCharcoal: 0,
    kelKids: 0,
  });

  const prices = {
    sassoCoil: 5,
    sassoSpraySmall: 8,
    sassoSprayLarge: 12,
    fekkoStarch: 7,
    romaCoil: 6,
    romaSpray: 9,
    kel360: 10,
    kelCharcoal: 15,
    kelKids: 20,
  };

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    setQuantities({ ...quantities, [name]: value });
  };

  const calculateTotal = () => {
    return Object.keys(quantities).reduce((acc, key) => {
      return acc + quantities[key] * prices[key];
    }, 0);
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const handleCancel = () => {
    navigate("/qrcodescanner"); // Navigate back to QR Code Scanner page
  };

  return (
    <div className="invoice-container">
      <h2>Invoice for {customerDetails.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(quantities).map((key) => (
            <tr key={key}>
              <td>{key.replace(/([A-Z])/g, " $1")}</td>
              <td>${prices[key]}</td>
              <td>
                <input
                  type="number"
                  name={key}
                  value={quantities[key]}
                  onChange={handleQuantityChange}
                  min="0"
                  className="quantity-input"
                />
              </td>
              <td>${quantities[key] * prices[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ${calculateTotal()}</h3>
      <div className="btn-container">
        <button className="btn-confirm">Confirm and Print Invoice</button>
        <button className="btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Invoice;
