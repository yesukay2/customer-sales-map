// import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
    </AuthProvider>
  );
}

export default App;
