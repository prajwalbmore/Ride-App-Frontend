import React, { useMemo, useState } from "react";
import { useGetRidesByDriverIdQuery } from "../ApiSlice/rideApi";
import { useAuth } from "../context/AuthContext";
import RideCard from "./RideCard";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal"; // Assuming you have a reusable Modal component
import CreateRideForm from "./CreateRideForm";

const DriverRides = () => {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGetRidesByDriverIdQuery(user._id);
  const [selected, setSelect] = useState({});
  const [filter, setFilter] = useState({ status: "all", search: "" });
  const [openModal, setOpenModal] = useState(false);

  const tabs = ["all", "ongoing", "active", "completed"];

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
            My Rides
          </h1>

          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by city or driver..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Create Ride
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter({ ...filter, status: tab })}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter.status === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition-colors`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Ride Cards */}
        {filteredRides?.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-2 transition-all">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                setOpen={() => {
                  setSelect(ride);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10 text-sm sm:text-base">
            No rides found.
          </div>
        )}

        {/* Create Ride Modal */}
        {openModal && (
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            title="Create New Ride"
            size="lg"
          >
            <CreateRideForm
              onClose={() => setOpenModal(false)}
              refetch={refetch}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DriverRides;
