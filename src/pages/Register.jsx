import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values) => {
    console.log("Registration Data:", values);
    // API call to register the user
  };

  return (
    <div className="py-5 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md border border-gray-300 w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Sign up to start booking your rides
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Prajwal Mmore"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="prajwal@yopmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <Field
                type="text"
                name="phone"
                placeholder="8390426319"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Sign Up
            </button>
          </Form>
        </Formik>

        <p className="mt-6 text-gray-500 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
