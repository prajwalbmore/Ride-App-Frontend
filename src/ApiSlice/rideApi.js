import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const BaseUrl = "https://ride-app-backend-liq8.onrender.com/api";
const BaseUrl = "http://localhost:5000/api";
export const rideApi = createApi({
  reducerPath: "rideApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get token from your Redux store or localStorage
      const token = localStorage.getItem("token"); // or from state: getState().auth.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRides: builder.query({
      query: () => "/rides",
    }),
    getRidesByDriverId: builder.query({
      query: (id) => `/rides/${id}`,
    }),
    addRide: builder.mutation({
      query: (data) => ({
        url: "/rides",
        method: "POST",
        body: data,
      }),
    }),
    addQR: builder.mutation({
      query: (data) => ({
        url: "/auth/add-qr",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRidesQuery,
  useAddRideMutation,
  useGetRidesByDriverIdQuery,
  useAddQRMutation,
} = rideApi;
