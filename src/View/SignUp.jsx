import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Styles/SignUp.css";

const serverLink = import.meta.env.VITE_SERVER_LINK;

// Validation schema using Yup
const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short!")
    .max(50, "Name is too long!")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const handleSubmit = (values, { setSubmitting }) => {
    axios.post(`${serverLink}/csm/signup`, values).then(() => {
      setSubmitting(false);
      navigate("/login");
    });
  };

  return (
    <div className="container">
      <h2 className="title">Create an Account</h2>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label className="label">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter your name"
                className="input"
              />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="input-group">
              <label className="label">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input"
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="input-group">
              <label className="label">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="input"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="link-container">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in here
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
