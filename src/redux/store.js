import { configureStore } from '@reduxjs/toolkit';
import ridesApi from "./features/rides/ridesApi"

export const store = configureStore({
  reducer: {
    [ridesApi.reducerPath]: ridesApi.reducer, // ✅ Add API reducer properly
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ridesApi.middleware), // ✅ Only add API middleware
});
