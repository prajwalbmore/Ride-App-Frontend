import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useConfirmAndRejectBookingMutation,
  useGetBookingsQuery,
} from "../ApiSlice/bookingApi";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import BookingCard from "./BookingCard";
import { toast } from "sonner";
import { IMAGEBASEURL } from "../app/app.constant";

const BookingsDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetBookingsQuery(id);
  const [confirmReject] = useConfirmAndRejectBookingMutation();

  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selected, setSelected] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  const bookings = data?.data || [];

  const grouped = useMemo(
    () => ({
      pending: bookings.filter((b) => b.rideStatus === "pending"),
      confirmed: bookings.filter((b) => b.rideStatus === "confirmed"),
      completed: bookings.filter((b) => b.rideStatus === "completed"),
      rejected: bookings.filter((b) => b.rideStatus === "rejected"),
    }),
    [bookings]
  );

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <div className="text-center text-red-500 font-medium">
        Failed to fetch booking details.
      </div>
    );
  if (!bookings.length)
    return (
      <div className="text-center text-gray-600 font-medium">
        No bookings found.
      </div>
    );

  const handleViewScreenshot = (url, booking) => {
    setSelected(booking);
    setImageUrl(`${IMAGEBASEURL}/${url}`);
    setOpen(true);
  };

  const tabClasses = (tab) =>
    `px-4 py-1 font-medium rounded-full transition text-sm sm:text-base ${
      activeTab === tab
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  const handleSubmit = async (status) => {
    try {
      const res = await confirmReject({
        data: { action: status },
        id: selected?._id,
      }).unwrap();

      if (res.success) {
        setOpen(false);
        toast.success(res.message);
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="mx-auto py-6 px-4 sm:px-6 md:px-16 lg:px-24 mt-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Bookings by Status
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap overflow-x-auto">
        {["pending", "confirmed", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={tabClasses(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {(grouped?.[activeTab] || []).length ? (
          grouped[activeTab].map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              activeTab={activeTab}
              onViewPayment={handleViewScreenshot}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No {activeTab} bookings found.
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Payment Screenshot"
      >
        <div className="flex flex-col items-center gap-4">
          <img
            src={imageUrl}
            alt="Payment Screenshot"
            className="max-h-[70vh] sm:max-h-[80vh] w-auto object-contain rounded-lg"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleSubmit("confirm")}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-lg font-medium transition"
            >
              Confirm
            </button>

            <button
              onClick={() => handleSubmit("reject")}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg font-medium transition"
            >
              Reject
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingsDetails;
