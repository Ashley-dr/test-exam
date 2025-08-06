import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../services/auth.services";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    setMessage("");
    setLoading(true);

    login(formValue.username, formValue.password).then(
      () => {
        navigate("/");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="bg-[#0000006c] w-max justify-self-center py-5 p-5 mt-10 rounded-xl">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form className="space-y-5">
          <div className="space-x-5">
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username" component="div" />
          </div>

          <div className="space-x-5">
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          <div>
            <button type="submit" disabled={loading}>
              {loading && <span>Loading...</span>}
              <span>Login</span>
            </button>
          </div>

          {message && <div>{message}</div>}
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
