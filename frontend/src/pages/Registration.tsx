import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../services/auth.services";

const Register: React.FC = () => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(3).max(20).required("Username is required"),
    password: Yup.string().min(6).max(40).required("Password is required"),
  });

  const handleRegister = (formValue: {
    username: string;
    password: string;
  }) => {
    setMessage("");
    setSuccessful(false);

    register(formValue.username, formValue.password).then(
      (response) => {
        setMessage(response.data.message || "Registration successful!");
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="bg-[#0000006c] w-max justify-self-center py-5 p-5 mt-10 rounded-xl">
      <h2>Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        <Form className="space-y-5">
          {!successful && (
            <>
              <div className="space-x-5">
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" />
                <ErrorMessage name="username" component="div" />
              </div>
              <div className="space-x-6.5">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" />
                <ErrorMessage name="password" component="div" />
              </div>
              <button type="submit">Sign Up</button>
            </>
          )}

          {message && (
            <div style={{ color: successful ? "green" : "red" }}>{message}</div>
          )}
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
