import React from "react";

const statusClasses = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const BookingCard = ({ booking, onViewPayment }) => {
  const {
    userId,
    pickup,
    drop,
    createdAt,
    paymentScreenshotUrl,
    rideStatus,
    seats,
    totalSeats,
    totalFare,
  } = booking;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 hover:shadow-xl transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Left: Booking details */}
      <div className="flex-1">
        <span
          className={`inline-block mb-2 px-3 py-1 text-sm font-semibold rounded-full ${
            statusClasses[rideStatus] || "bg-gray-100 text-gray-700"
          }`}
        >
          {rideStatus.charAt(0).toUpperCase() + rideStatus.slice(1)}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <p className="text-gray-800 font-medium text-sm">
            {userId?.name || "Unknown"} | {userId?.phone || "N/A"}
          </p>
        </div>

        <p className="text-gray-600 text-sm mt-1">
          Pickup: {pickup} | Drop: {drop}
        </p>

        {/* Seats and Fare Info */}
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Seats:</span> Male: {seats?.male || 0}
            , Female: {seats?.female || 0}
          </p>
          <p>
            <span className="font-medium">Total Seats:</span> {totalSeats}
          </p>
          <p>
            <span className="font-medium">Total Fare:</span> ₹{totalFare}
          </p>
        </div>

        <p className="text-gray-500 text-xs mt-2">
          Booked On: {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      {/* Right: Payment Button */}
      {paymentScreenshotUrl && (
        <button
          onClick={() => onViewPayment(paymentScreenshotUrl, booking)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:scale-105 transform transition-all shadow-md self-end sm:self-auto"
        >
          View Payment
        </button>
      )}
    </div>
  );
};

export default BookingCard;
