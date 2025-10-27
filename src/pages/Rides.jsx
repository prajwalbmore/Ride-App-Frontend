import React, { useState, useMemo } from "react";
import { useGetRidesQuery } from "../ApiSlice/rideApi";
import RideCard from "./RideCard";
import BookingModal from "./BookingModal";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

const Rides = () => {
  const { data, isLoading } = useGetRidesQuery();
  const [open, setOpen] = useState(false);
  const [selected, setSelect] = useState({});
  const [filter, setFilter] = useState({ status: "all", search: "" });

  const filteredRides = useMemo(() => {
    return data?.data?.filter((ride) => {
      const matchesStatus =
        filter.status === "all" || ride.status === filter.status;
      const matchesSearch =
        ride.from.toLowerCase().includes(filter.search.toLowerCase()) ||
        ride.to.toLowerCase().includes(filter.search.toLowerCase()) ||
        ride.driverId.name.toLowerCase().includes(filter.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [data?.data, filter]);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-8 md:px-12 lg:px-20 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Available Rides
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by city or driver..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Ride Cards */}
        {filteredRides?.length > 0 ? (
          <div
            className="
              grid 
              gap-5 
              md:grid-cols-1 
              lg:grid-cols-2 
              transition-all
            "
          >
            {filteredRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                isUser
                setOpen={() => {
                  setSelect(ride);
                  setOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10 text-sm sm:text-base">
            No rides found.
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Ride Booking"
        size="md"
      >
        <BookingModal setOpen={setOpen} selected={selected} />
      </Modal>
    </div>
  );
};

export default Rides;
