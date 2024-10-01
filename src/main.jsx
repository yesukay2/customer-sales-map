import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import CustomerRegistration from "./View/CustomerRegistration";
import LoginPage from "./View/loginPage";
import CustomerList from "./View/Customers";
import ScanQRCode from "./View/qrCodeScanner";
import CustomerMap from "./View/customerMap";
import SignUp from "./View/signUp";
import Invoice from "./View/Invoice";
import ProtectedRoute from "./Components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div
        style={{
          color: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        An Error Occurred!!
      </div>
    ),
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUp /> },
      {
        path: "/customerRegistration",
        element: (
          <ProtectedRoute>
            <CustomerRegistration />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customers",
        element: (
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customerMap",
        element: (
          <ProtectedRoute>
            <CustomerMap />
          </ProtectedRoute>
        ),
      },
      {
        path: "/qrcodescanner",
        element: (
          <ProtectedRoute>
            <ScanQRCode />
          </ProtectedRoute>
        ),
      },
      {
        path: "/invoice",
        element: (
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<LoginPage />} />
  </React.StrictMode>
);
