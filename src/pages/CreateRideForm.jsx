import React from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useAddRideMutation } from "../ApiSlice/rideApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Reusable input component
const InputField = ({ label, name, type = "text", placeholder }) => {
  const { setFieldValue, values } = useFormikContext();

  // Date picker
  if (type === "date") {
    return (
      <div>
        <label className="block text-gray-700 mb-1">{label}</label>
        <DatePicker
          selected={values[name] ? new Date(values[name]) : null}
          onChange={(date) => {
            setFieldValue(name, date ? date.toISOString().split("T")[0] : "");
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-sm mt-1"
        />
      </div>
    );
  }

  // Normal input
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

const CreateRideForm = ({ onClose, refetch }) => {
  const { user } = useAuth();
  const [createRide] = useAddRideMutation();

  const initialValues = {
    from: "",
    to: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
    seatsAvailable: "",
    vehicleModel: "",
    vehicleNumber: "",
  };

  const validationSchema = Yup.object({
    from: Yup.string().required("From city is required"),
    to: Yup.string().required("To city is required"),
    date: Yup.string().required("Date is required"),
    departureTime: Yup.string().required("Departure time is required"),
    arrivalTime: Yup.string().required("Arrival time is required"),
    fare: Yup.number()
      .typeError("Fare must be a number")
      .required("Fare is required"),
    seatsAvailable: Yup.number()
      .typeError("Seats must be a number")
      .required("Seats available is required"),
    vehicleModel: Yup.string().required("Vehicle model is required"),
    vehicleNumber: Yup.string().required("Vehicle number is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const rideData = {
        ...values,
        driverId: user._id,
        vehicle: {
          model: values.vehicleModel,
          number: values.vehicleNumber,
        },
      };
      delete rideData.vehicleModel;
      delete rideData.vehicleNumber;

      const res = await createRide(rideData).unwrap();

      if (res.success) {
        toast.success(res.message);
        refetch();
        resetForm();
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create ride");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-2">
            <InputField label="From" name="from" placeholder="Departure city" />
            <InputField label="To" name="to" placeholder="Destination city" />

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Date" name="date" type="date" />
              <InputField
                label="Departure Time"
                name="departureTime"
                type="time"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Arrival Time" name="arrivalTime" type="time" />
              <InputField
                label="Fare"
                name="fare"
                type="number"
                placeholder="Fare amount"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Seats Available"
                name="seatsAvailable"
                type="number"
                placeholder="Number of seats"
              />
              <InputField
                label="Vehicle Model"
                name="vehicleModel"
                placeholder="Car model"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Vehicle Number"
                name="vehicleNumber"
                placeholder="Car number"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold mt-3"
            >
              {isSubmitting ? "Creating..." : "Create Ride"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateRideForm;
