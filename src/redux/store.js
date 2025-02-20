import { configureStore } from '@reduxjs/toolkit'
import ridesApi from "./features/rides/ridesApi"
import requestSlice from "./features/request/requestSlice" // Import the new slice

export const store = configureStore({
  reducer: {
    [ridesApi.reducerPath]: ridesApi.reducer, // ✅ Add API reducer properly
    requests: requestSlice // Add request slice to Redux store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ridesApi.middleware) // ✅ Only add API middleware
})