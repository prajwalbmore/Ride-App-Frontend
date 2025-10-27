import React, { useMemo, useState } from "react";
import {
  useAddQRMutation,
  useGetRidesByDriverIdQuery,
} from "../ApiSlice/rideApi";
import { useAuth } from "../context/AuthContext";
import RideCard from "./RideCard";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import CreateRideForm from "./CreateRideForm";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const DriverRides = () => {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGetRidesByDriverIdQuery(user?._id);
  const [AddQR] = useAddQRMutation();
  const [filter, setFilter] = useState({ status: "all", search: "" });
  const [selectedRide, setSelectedRide] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const tabs = ["all", "ongoing", "active", "completed"];

  // 🔍 Filter rides efficiently
  const filteredRides = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((ride) => {
      const matchesStatus =
        filter.status === "all" || ride.status === filter.status;
      const search = filter.search.toLowerCase();
      const matchesSearch =
        ride.from.toLowerCase().includes(search) ||
        ride.to.toLowerCase().includes(search) ||
        ride.driverId?.name?.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [data?.data, filter]);

  // 📸 Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // ❌ Remove selected image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  // 🚀 Upload QR image to backend
  const handleUploadQR = async () => {
    if (!imageFile) return alert("Please select an image first.");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("qrCode", imageFile);

      const res = await AddQR(formData).unwrap();

      if (res?.success) {
        toast.success(res.message);
        setOpenUploadModal(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(res.message);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-8 md:px-12 lg:px-20 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            My Rides
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by city or driver..."
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex gap-5">
              <button
                onClick={() => setOpenCreateModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Create Ride
              </button>
              <button
                onClick={() => setOpenUploadModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Upload size={18} /> Upload QR
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter((prev) => ({ ...prev, status: tab }))}
              className={`px-4 py-1 font-medium rounded-full text-sm sm:text-base transition-colors ${
                filter.status === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Ride Cards */}
        {filteredRides.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-2 transition-all">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                setOpen={() => {
                  setSelectedRide(ride);
                  setOpenCreateModal(true);
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
        {openCreateModal && (
          <Modal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            title={selectedRide ? "Edit Ride" : "Create New Ride"}
            size="lg"
          >
            <CreateRideForm
              onClose={() => setOpenCreateModal(false)}
              refetch={refetch}
              selectedRide={selectedRide}
            />
          </Modal>
        )}

        {/* Upload QR Modal */}
        {openUploadModal && (
          <Modal
            open={openUploadModal}
            onClose={() => setOpenUploadModal(false)}
            title="Upload QR Code"
            size="lg"
          >
            <div className="border-t pt-4 mt-4 text-center">
              {!uploadedImage ? (
                <label
                  htmlFor="upload"
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer p-6 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-all"
                >
                  <Upload size={24} className="text-blue-600" />
                  <p className="text-sm text-blue-700 font-medium">
                    Click to Upload
                  </p>
                  <input
                    type="file"
                    id="upload"
                    accept="image/*"
                    onChange={handleImageUpload}
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
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* ✅ Upload Button */}
              <div className="mt-5">
                <button
                  onClick={handleUploadQR}
                  disabled={uploading}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload QR"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DriverRides;

// import React, { useMemo, useState } from "react";
// import { useGetRidesByDriverIdQuery } from "../ApiSlice/rideApi";
// import { useAuth } from "../context/AuthContext";
// import RideCard from "./RideCard";
// import Spinner from "../components/Spinner";
// import Modal from "../components/Modal"; // Assuming you have a reusable Modal component
// import CreateRideForm from "./CreateRideForm";
// import { Upload } from "lucide-react";

// const DriverRides = () => {
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const { user } = useAuth();
//   const { data, isLoading, refetch } = useGetRidesByDriverIdQuery(user._id);
//   const [selected, setSelect] = useState({});
//   const [filter, setFilter] = useState({ status: "all", search: "" });
//   const [openModal, setOpenModal] = useState(false);
//   const [openUpload, setOpenUpload] = useState(false);

//   const tabs = ["all", "ongoing", "active", "completed"];

//   const filteredRides = useMemo(() => {
//     return data?.data?.filter((ride) => {
//       const matchesStatus =
//         filter.status === "all" || ride.status === filter.status;
//       const matchesSearch =
//         ride.from.toLowerCase().includes(filter.search.toLowerCase()) ||
//         ride.to.toLowerCase().includes(filter.search.toLowerCase()) ||
//         ride.driverId.name.toLowerCase().includes(filter.search.toLowerCase());
//       return matchesStatus && matchesSearch;
//     });
//   }, [data?.data, filter]);

//   if (isLoading) return <Spinner />;
//   // 📸 Handle image upload
//   const handleImageUpload = (e, setFieldValue) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedImage(URL.createObjectURL(file));
//       setFieldValue("paymentScreenshot", file);
//     }
//   };

//   const handleRemoveImage = (setFieldValue) => {
//     setUploadedImage(null);
//     setFieldValue("paymentScreenshot", null);
//   };
//   return (
//     <div className="bg-gray-50 py-6 px-4 sm:px-8 md:px-12 lg:px-20 min-h-screen">
//       <div className="mx-auto max-w-7xl">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
//             My Rides
//           </h1>

//           {/* Top Actions */}
//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <input
//               type="text"
//               placeholder="Search by city or driver..."
//               value={filter.search}
//               onChange={(e) => setFilter({ ...filter, search: e.target.value })}
//               className="w-full sm:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//             <button
//               onClick={() => setOpenModal(true)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
//             >
//               Create Ride
//             </button>
//             <button
//               onClick={() => setOpenUpload(true)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
//             >
//               Upload QR
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-3 mb-6 overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setFilter({ ...filter, status: tab })}
//               className={`px-4 py-1 font-medium rounded-full transition text-sm sm:text-base ${
//                 filter.status === tab
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               } transition-colors`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Ride Cards */}
//         {filteredRides?.length > 0 ? (
//           <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-2 transition-all">
//             {filteredRides.map((ride) => (
//               <RideCard
//                 key={ride._id}
//                 ride={ride}
//                 setOpen={() => {
//                   setSelect(ride);
//                   setOpenModal(true);
//                 }}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-600 mt-10 text-sm sm:text-base">
//             No rides found.
//           </div>
//         )}

//         {/* Create Ride Modal */}
//         {openModal && (
//           <Modal
//             open={openModal}
//             onClose={() => setOpenModal(false)}
//             title="Create New Ride"
//             size="lg"
//           >
//             <CreateRideForm
//               onClose={() => setOpenModal(false)}
//               refetch={refetch}
//             />
//           </Modal>
//         )}
//         {/* Create Ride Modal */}
//         {openUpload && (
//           <Modal
//             open={openUpload}
//             onClose={() => setOpenUpload(false)}
//             title="Create New Ride"
//             size="lg"
//           >
//             <div className="border-t pt-4 mt-4">
//               <p className="text-sm text-gray-600 font-medium mb-2">
//                 Upload Payment Screenshot
//               </p>

//               {!uploadedImage ? (
//                 <label
//                   htmlFor="upload"
//                   className="flex flex-col items-center justify-center gap-2 cursor-pointer p-4 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-all"
//                 >
//                   <Upload size={22} className="text-blue-600" />
//                   <p className="text-sm text-blue-700 font-medium">
//                     Upload Image
//                   </p>
//                   <input
//                     type="file"
//                     id="upload"
//                     accept="image/*"
//                     onChange={(e) => handleImageUpload(e, setFieldValue)}
//                     className="hidden"
//                   />
//                 </label>
//               ) : (
//                 <div className="relative w-fit mx-auto">
//                   <img
//                     src={uploadedImage}
//                     alt="Uploaded Preview"
//                     className="rounded-xl shadow-md border border-gray-100 max-h-52 object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(setFieldValue)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               )}

//               {/* {touched.paymentScreenshot && errors.paymentScreenshot && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.paymentScreenshot}
//                 </p>
//               )} */}
//             </div>
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DriverRides;
