import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import "./Styles/CustomerRegistration.css";

const serverLink = import.meta.env.VITE_SERVER_LINK;

// Validation schema using Yup
const CustomerRegistrationSchema = Yup.object().shape({
  name: Yup.string().required("Customer name is required"),
  email: Yup.string().email("Invalid email").nullable(),
  phone: Yup.string()
    .matches(
      /^0\d{9}$/,
      "Phone number must be exactly 10 digits and start with 0"
    )
    .required("Phone number is required"),
  shopName: Yup.string().required("Shop name is required"),
  shopLocation: Yup.string().required("Shop location is required"),
  latitude: Yup.number().required("Latitude is required"),
  longitude: Yup.number().required("Longitude is required"),
});

const CustomerRegistration = () => {
  const [qrCode, setQrCode] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Customer Data:", values);

      // Simulate QR code generation
      const generatedQrCode = `QRCode_${values.name}_${Date.now()}`;
      setQrCode(generatedQrCode);

      // Prepare data for submission
      const customerData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        qrCode: generatedQrCode,
        shopName: values.shopName,
        shopLocation: values.shopLocation,
        geolocation: {
          type: "Point",
          coordinates: [values.longitude, values.latitude], // [longitude, latitude]
        },
      };

      // Submit data to the server using Axios
      const response = await axios.post(
        `${serverLink}/csm/customers/register`,
        customerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response from server:", response.data);

      // Reset the form upon successful submission
      resetForm();
      setQrCode(null); // Reset QR code display

      // Optionally, you can handle the response and show success message if needed
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally, handle error state
    } finally {
      setSubmitting(false);
    }
  };

  // Function to get the user's current location
  const getCurrentLocation = async (setFieldValue) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFieldValue("latitude", latitude);
          setFieldValue("longitude", longitude);

          // Fetch place name using Google Maps Geocoding API
          const apiKey = "AIzaSyCFjf_qjHwnZHf9vAiYo9mkyQecuhx46Mo";
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            if (response.data.results.length > 0) {
              const placeName = response.data.results[0].formatted_address;
              setFieldValue("shopLocation", placeName);
            } else {
              alert("No address found for this location.");
            }
          } catch (error) {
            console.error("Error fetching place name:", error);
            alert("Unable to retrieve place name. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="regCustomerContainer">
      <h2>Register Customer</h2>
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          shopName: "",
          shopLocation: "",
          latitude: "",
          longitude: "",
        }}
        validationSchema={CustomerRegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="inputGroup">
              <label>Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter customer name"
              />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="inputGroup">
              <label>Email</label>
              <Field type="email" name="email" placeholder="Enter email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="inputGroup">
              <label>Phone</label>
              <Field
                type="text"
                name="phone"
                placeholder="Enter phone number"
              />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>

            <div className="inputGroup">
              <label>Shop Name</label>
              <Field
                type="text"
                name="shopName"
                placeholder="Enter shop name"
              />
              <ErrorMessage name="shopName" component="div" className="error" />
            </div>

            <div className="inputGroup">
              <label>Shop Location</label>
              <Field
                type="text"
                name="shopLocation"
                placeholder="Enter shop location"
                readOnly
              />
              <ErrorMessage
                name="shopLocation"
                component="div"
                className="error"
              />
              <button
                type="button"
                onClick={() => getCurrentLocation(setFieldValue)}
                id="getLocationBtn"
              >
                Get Location
              </button>
            </div>

            <Field type="hidden" name="latitude" />
            <Field type="hidden" name="longitude" />

            <button type="submit" disabled={isSubmitting} id="customerRegBtn">
              {isSubmitting ? "Registering..." : "Register Customer"}
            </button>
          </Form>
        )}
      </Formik>

      {qrCode && (
        <div className="qrCodeContainer">
          <h3>QR Code Generated: {qrCode}</h3>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistration;
