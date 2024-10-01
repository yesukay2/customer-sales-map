import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "./Styles/qrCodeScanner.css";

const serverLink = import.meta.env.VITE_SERVER_LINK;

const ScanQRCode = () => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true); // Show loading spinner
      const response = await axios.get(
        `${serverLink}/csm/qr-code/${values.qrCode}`
      );
      setCustomerDetails(response.data);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Customer not found.");
        setCustomerDetails(null);
      } else {
        setErrorMessage("Error scanning QR Code.");
      }
    }
    setIsLoading(false); // Hide loading spinner
    setSubmitting(false);
  };

  const handleScan = (data) => {
    if (data) {
      setScanning(false);

      // Check the structure of 'data' and extract the QR code value
      const qrCode = typeof data === "string" ? data : data.text || data.code;

      // If qrCode is found, submit it to the backend
      if (qrCode) {
        handleSubmit({ qrCode }, { setSubmitting: () => {} });
      } else {
        setErrorMessage("QR Code data not found.");
      }
    }
  };

  const handleRestockClick = async () => {
    if (customerDetails) {
      const id = customerDetails._id;
      try {
        const formattedDate = format(new Date(), "dd/MM/yyyy hh:mm a");
        await axios.patch(
          `${serverLink}/csm/qr-code/update-last-scanned/${id}`,
          {
            lastScanned: formattedDate,
          }
        );
        navigate("/invoice", { state: { customerDetails } });
      } catch (error) {
        console.error("Error updating lastScanned:", error);
      }
    }
  };

  const handleInStockClick = async () => {
    if (customerDetails) {
      const id = customerDetails._id;
      try {
        const formattedDate = format(new Date(), "dd/MM/yyyy hh:mm a");
        await axios.patch(
          `${serverLink}/csm/qr-code/update-last-scanned/${id}`,
          {
            lastScanned: formattedDate,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCustomerDetails(null);
      } catch (error) {
        console.error("Error updating lastScanned:", error);
      }
    }
  };

  return (
    <div className="scan-container">
      <h2>Scan QR Code</h2>
      <div>
        {scanning ? (
          <div className="scanner">
            <QrScanner
              onError={(err) => {
                setErrorMessage(err.message);
                console.error(err);
              }}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <div className="scanner-error">{errorMessage}</div>
            <button className="btn-stop" onClick={() => setScanning(false)}>
              Stop Scanning
            </button>
          </div>
        ) : (
          <button className="btn-scan" onClick={() => setScanning(true)}>
            Scan QR Code with Camera
          </button>
        )}
      </div>
      <Formik
        initialValues={{ qrCode: "" }}
        validationSchema={Yup.object().shape({
          qrCode: Yup.string().required("QR Code is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Field
              type="text"
              name="qrCode"
              placeholder="Enter QR code manually"
              className="input-field"
              value={values.qrCode}
              onChange={(e) => setFieldValue("qrCode", e.target.value)}
            />
            <ErrorMessage name="qrCode" component="div" className="error" />
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-submit"
            >
              {isSubmitting || isLoading ? "Submitting..." : "Submit QR Code"}
            </button>
          </Form>
        )}
      </Formik>
      {isLoading && <div className="loading-spinner">Loading...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {customerDetails && (
        <div className="customer-details">
          <p>Customer: {customerDetails.name}</p>
          <p>Shop Name: {customerDetails.shopName}</p>
          <p>Phone: {customerDetails.phone}</p>
          <button className="btn-restock" onClick={handleRestockClick}>
            Restock
          </button>
          <button className="btn-in-stock" onClick={handleInStockClick}>
            In-stock
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;
