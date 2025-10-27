import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useCreateBookingMutation } from "../ApiSlice/bookingApi";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const BookingModal = ({ setOpen, selected }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [bookRide] = useCreateBookingMutation();

  if (!selected) return null;

  const qrData = JSON.stringify({
    rideId: selected._id,
    from: selected.from,
    to: selected.to,
    date: selected.date,
    fare: selected.fare,
  });

  // 📸 Handle image upload
  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setFieldValue("paymentScreenshot", file);
    }
  };

  const handleRemoveImage = (setFieldValue) => {
    setUploadedImage(null);
    setFieldValue("paymentScreenshot", null);
  };

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    pickup: Yup.string().required("Pickup location is required"),
    drop: Yup.string().required("Drop location is required"),
    maleSeats: Yup.number()
      .min(0, "Can't be negative")
      .max(6, "Max 6 seats allowed")
      .required(),
    femaleSeats: Yup.number()
      .min(0, "Can't be negative")
      .max(6, "Max 6 seats allowed")
      .required(),
    paymentScreenshot: Yup.mixed().required("Payment screenshot is required"),
  }).test(
    "at-least-one-seat",
    "At least 1 seat (male or female) is required",
    (values) => (values.maleSeats || 0) + (values.femaleSeats || 0) > 0
  );

  const initialValues = {
    pickup: selected.from || "",
    drop: selected.to || "",
    maleSeats: 0,
    femaleSeats: 0,
    paymentScreenshot: null,
  };

  // 🚀 Submit handler
  const handleSubmit = async (values) => {
    try {
      const totalSeats = Number(values.maleSeats) + Number(values.femaleSeats);
      const totalFare = totalSeats * selected.fare;

      const formData = new FormData();
      formData.append("rideId", selected._id);
      formData.append("pickup", values.pickup);
      formData.append("drop", values.drop);
      formData.append("maleSeats", values.maleSeats);
      formData.append("femaleSeats", values.femaleSeats);
      formData.append("totalSeats", totalSeats);
      formData.append("totalFare", totalFare);
      formData.append("paymentScreenshot", values.paymentScreenshot);

      const res = await bookRide(formData).unwrap();
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="space-y-5">
      {/* Confirmation Text */}
      <p className="text-gray-700">
        You’re about to confirm your booking from <b>{selected.from}</b> to{" "}
        <b>{selected.to}</b>. Are you sure you want to continue?
      </p>

      {/* QR Code Section */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 font-medium mb-2">
          Payment QR Code
        </p>
        <div className="flex justify-center">
          <QRCodeCanvas
            value={qrData}
            size={120}
            bgColor="#ffffff"
            fgColor="#2563eb"
            level="M"
            includeMargin
          />
        </div>
      </div>

      {/* Booking Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => {
          const totalSeats =
            Number(values.maleSeats || 0) + Number(values.femaleSeats || 0);
          const totalFare = totalSeats * selected.fare;

          return (
            <Form className="space-y-4">
              {/* Pickup & Drop Fields */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium">Pickup</label>
                  <Field
                    name="pickup"
                    placeholder="Pickup Location"
                    className="border p-2 rounded-lg w-full"
                  />
                  {touched.pickup && errors.pickup && (
                    <p className="text-red-500 text-sm">{errors.pickup}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Drop</label>
                  <Field
                    name="drop"
                    placeholder="Drop Location"
                    className="border p-2 rounded-lg w-full"
                  />
                  {touched.drop && errors.drop && (
                    <p className="text-red-500 text-sm">{errors.drop}</p>
                  )}
                </div>
              </div>

              {/* Male / Female Seats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Male Seats
                  </label>
                  <Field
                    name="maleSeats"
                    type="number"
                    min="0"
                    max="6"
                    className="border p-2 rounded-lg w-full"
                  />
                  {touched.maleSeats && errors.maleSeats && (
                    <p className="text-red-500 text-sm">{errors.maleSeats}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Female Seats
                  </label>
                  <Field
                    name="femaleSeats"
                    type="number"
                    min="0"
                    max="6"
                    className="border p-2 rounded-lg w-full"
                  />
                  {touched.femaleSeats && errors.femaleSeats && (
                    <p className="text-red-500 text-sm">{errors.femaleSeats}</p>
                  )}
                </div>
              </div>

              {/* At least one seat error */}
              {typeof errors["at-least-one-seat"] === "string" && (
                <p className="text-red-500 text-sm">
                  {errors["at-least-one-seat"]}
                </p>
              )}

              {/* Total Info */}
              <div className="mt-2 bg-blue-50 p-3 rounded-lg flex flex-col gap-1">
                <p className="text-gray-700">
                  <b>Total Seats:</b> {totalSeats}
                </p>
                <p className="text-gray-700">
                  <b>Total Fare:</b> ₹{totalFare.toFixed(2)}
                </p>
              </div>

              {/* Upload Screenshot */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Upload Payment Screenshot
                </p>

                {!uploadedImage ? (
                  <label
                    htmlFor="upload"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer p-4 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    <Upload size={22} className="text-blue-600" />
                    <p className="text-sm text-blue-700 font-medium">
                      Upload Image
                    </p>
                    <input
                      type="file"
                      id="upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setFieldValue)}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-fit mx-auto">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Preview"
                      className="rounded-xl shadow-md border border-gray-100 max-h-52 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(setFieldValue)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {touched.paymentScreenshot && errors.paymentScreenshot && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentScreenshot}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={totalSeats === 0}
                  className={`px-5 py-2 rounded-lg text-white transition ${
                    totalSeats === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Confirm & Pay ₹{totalFare.toFixed(2)}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default BookingModal;
