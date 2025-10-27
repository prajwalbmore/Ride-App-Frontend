import { configureStore } from "@reduxjs/toolkit";
import { bookingApi } from "../ApiSlice/bookingApi";
import { rideApi } from "../ApiSlice/rideApi";
import { authApi } from "../ApiSlice/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [rideApi.reducerPath]: rideApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(authApi.middleware, rideApi.middleware, bookingApi.middleware),
});
