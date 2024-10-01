import { createContext, useContext, useState, useEffect } from "react";
import Props from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    }
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    localStorage.removeItem("token"); // Clear the token on logout
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: Props.node.isRequired,
};
