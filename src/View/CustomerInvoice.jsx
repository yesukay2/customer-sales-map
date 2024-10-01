import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const InvoiceSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer name is required"),
  customerEmail: Yup.string()
    .email("Invalid email")
    .required("Customer email is required"),
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Item name is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be at least 0"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Must be at least 1 item"),
    })
  ),
});

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  const handleSubmit = (values) => {
    // Store the values for invoice preview
    setInvoiceData(values);
  };

  return (
    <div style={styles.container}>
      <h2>Generate Invoice</h2>

      <Formik
        initialValues={{
          customerName: "",
          customerEmail: "",
          items: [
            {
              name: "",
              price: 0,
              quantity: 1,
            },
          ],
        }}
        validationSchema={InvoiceSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div>
              <label>Customer Name</label>
              <Field
                type="text"
                name="customerName"
                placeholder="Enter customer name"
              />
              <ErrorMessage
                name="customerName"
                component="div"
                style={styles.error}
              />
            </div>

            <div>
              <label>Customer Email</label>
              <Field
                type="email"
                name="customerEmail"
                placeholder="Enter customer email"
              />
              <ErrorMessage
                name="customerEmail"
                component="div"
                style={styles.error}
              />
            </div>

            <FieldArray name="items">
              {({ remove, push }) => (
                <div>
                  <h3>Items Purchased</h3>
                  {values.items.map((item, index) => (
                    <div key={index} style={styles.item}>
                      <div>
                        <label>Item Name</label>
                        <Field
                          name={`items[${index}].name`}
                          placeholder="Item name"
                        />
                        <ErrorMessage
                          name={`items[${index}].name`}
                          component="div"
                          style={styles.error}
                        />
                      </div>

                      <div>
                        <label>Price</label>
                        <Field
                          name={`items[${index}].price`}
                          type="number"
                          placeholder="Item price"
                        />
                        <ErrorMessage
                          name={`items[${index}].price`}
                          component="div"
                          style={styles.error}
                        />
                      </div>

                      <div>
                        <label>Quantity</label>
                        <Field
                          name={`items[${index}].quantity`}
                          type="number"
                          placeholder="Item quantity"
                        />
                        <ErrorMessage
                          name={`items[${index}].quantity`}
                          component="div"
                          style={styles.error}
                        />
                      </div>

                      <button type="button" onClick={() => remove(index)}>
                        Remove Item
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => push({ name: "", price: 0, quantity: 1 })}
                  >
                    Add Item
                  </button>
                </div>
              )}
            </FieldArray>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating Invoice..." : "Generate Invoice"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Display Invoice Preview */}
      {invoiceData && (
        <div style={styles.invoicePreview}>
          <h3>Invoice Preview</h3>
          <p>
            <strong>Customer Name:</strong> {invoiceData.customerName}
          </p>
          <p>
            <strong>Customer Email:</strong> {invoiceData.customerEmail}
          </p>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">
                  <strong>Total Amount</strong>
                </td>
                <td>
                  $
                  {invoiceData.items
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

// Basic styling
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: "0.8em",
  },
  item: {
    marginBottom: "20px",
  },
  invoicePreview: {
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ccc",
  },
};

export default InvoiceGenerator;
