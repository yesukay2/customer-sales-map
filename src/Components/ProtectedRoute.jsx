import Props from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Return the children if authenticated, otherwise redirect to the login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: Props.node.isRequired,
};
