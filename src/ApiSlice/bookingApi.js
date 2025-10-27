import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
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
      query: () => "/book",
    }),
    getBookings: builder.query({
      query: (id) => `/book/${id}`,
    }),
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/book",
        method: "POST",
        body: data,
      }),
    }),
    confirmAndRejectBooking: builder.mutation({
      query: ({ data, id }) => ({
        url: `/book/confirm/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRidesQuery,
  useCreateBookingMutation,
  useGetBookingsQuery,
  useConfirmAndRejectBookingMutation,
} = bookingApi;
