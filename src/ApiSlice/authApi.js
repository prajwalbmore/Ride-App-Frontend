import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BaseUrl = "https://ride-app-backend-liq8.onrender.com/api";
// const BaseUrl = "http://localhost:5000/api";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
  endpoints: (builder) => ({
    getRides: builder.query({
      query: () => "/rides",
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    
  }),
});

export const {
  useGetRidesQuery,
  useLoginMutation,
  useRegisterMutation,
} = authApi;
