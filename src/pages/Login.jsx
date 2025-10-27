import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../ApiSlice/authApi";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [Login] = useLoginMutation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    console.log("Form Data:", values);
    try {
      const res = await Login(values).unwrap();
      await login(res?.data);
      if (res?.success) {
        toast.success(res.message);
        if (res?.data?.user?.role === "user") {
          navigate("/");
        } else {
          navigate("/driver");
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(res.message);
      console.log(error);
    }
  };

  return (
    <div className="py-5 flex items-center justify-center px-4 min-h-[90vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back!
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Log in to your account to book your next ride
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter your password"
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
              Log In
            </button>
          </Form>
        </Formik>

        <p className="mt-6 text-gray-500 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
