import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Import the useAuth hook
import "./Styles/loginPage.css";

const serverLink = import.meta.env.VITE_SERVER_LINK;

// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum")
    .required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from the context

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const loginData = {
      email: values.email,
      password: values.password,
    };

    setSubmitting(true);
    try {
      const res = await axios.post(`${serverLink}/csm/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("token", res.data.token);
      login(); // Call the login function to update authentication state
      navigate("/customerMap", { replace: true });
    } catch (error) {
      setErrors({
        serverError: error.response
          ? error.response.data.message
          : "Invalid credentials.",
      });
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="form">
            {errors.serverError && (
              <p className="error">{errors.serverError}</p>
            )}

            <div className="inputGroup">
              <label>Email</label>
              <Field
                type="email"
                name="email"
                className="input"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="inputGroup">
              <label>Password</label>
              <Field
                type="password"
                name="password"
                className="input"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting} className="button">
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="link-container">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
