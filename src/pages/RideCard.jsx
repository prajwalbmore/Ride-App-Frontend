import React from "react";
import { MapPin, Clock, Car, User, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RideCard = ({ ride, isUser = false, setOpen }) => {
  const navigate = useNavigate();
  if (!ride) return null;
  const { user } = useAuth();
  const statusColors = {
    active: "bg-green-500",
    completed: "bg-blue-100",
    cancelled: "bg-red-100",
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin size={18} />
          {ride.from} → {ride.to}
        </h2>
        {!isUser && (
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
              statusColors[ride.status] || "bg-gray-100"
            } bg-white/20 backdrop-blur-md`}
          >
            {ride.status}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-blue-600" />
          <p>
            <strong>Date:</strong> {ride.date} &nbsp;|&nbsp;
            <strong>Time:</strong> {ride.departureTime} → {ride.arrivalTime}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <User size={18} className="text-blue-600" />
          <p>
            <strong>Driver:</strong> {ride?.driverId?.name} (
            {ride?.driverId?.phone})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Car size={18} className="text-blue-600" />
          <p>
            <strong>Vehicle:</strong> {ride?.vehicle?.model} (
            {ride?.vehicle?.number})
          </p>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Seats Available</p>
            <p className="text-lg font-semibold text-gray-900">
              {ride.seatsAvailable}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Fare</p>
            <div className="flex items-center justify-end gap-1 text-xl font-bold text-blue-600">
              <IndianRupee size={18} />
              {ride.fare}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
        <button
          disabled={isUser && ride.seatsAvailable === 0}
          onClick={() => {
            if (!user) navigate("/login");
            if (isUser) {
              setOpen();
            } else {
              navigate(`/booking/${ride._id}`);
            }
          }}
          className={`bg-gradient-to-r from-blue-600 disabled:cursor-not-allowed to-blue-500 text-white px-5 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 active:scale-95 transition-al`}
        >
          {!isUser ? "View Bookings" : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default RideCard;
