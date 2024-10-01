import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import { GiPadlock } from "react-icons/gi";
import { useAuth } from "../Context/AuthContext"; // Import the useAuth hook
import "./Styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from the context

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("menu-open", !menuOpen);
  };

  const handleLogout = () => {
    // Call the logout function from the context to update authentication state
    logout();

    // Optionally remove the token from local storage
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  };

  // Dummy state for login status, replace with actual authentication logic
  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <header className={`header ${menuOpen ? "menu-open" : ""}`}>
      <div className="logo">
        <img src={logo} alt="Company Logo" />
      </div>
      <nav className={`nav-buttons ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/customerMap"
          className={({ isActive }) =>
            isActive ? "active-link" : "inactive-link"
          }
          onClick={toggleMenu}
        >
          Customer Map
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "active-link" : "inactive-link"
          }
          onClick={toggleMenu}
        >
          Customers
        </NavLink>

        <NavLink
          to="/qrcodescanner"
          className={({ isActive }) =>
            isActive ? "active-link" : "inactive-link"
          }
          onClick={toggleMenu}
        >
          Scan QR
        </NavLink>

        <NavLink
          to="/customerRegistration"
          className={({ isActive }) =>
            isActive ? "active-link" : "inactive-link"
          }
          onClick={toggleMenu}
        >
          Register Customer
        </NavLink>

        {/* Conditional rendering of Login/Logout based on login status */}
        {isLoggedIn ? (
          <div className="logout-button" onClick={handleLogout}>
            <span className="logout-text">Logout</span>
            <GiPadlock />
          </div>
        ) : (
          <NavLink
            to="/login"
            id="login-button"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={toggleMenu}
          >
            Login
          </NavLink>
        )}
      </nav>
      <button className="menu-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
      </button>
    </header>
  );
};

export default Header;
