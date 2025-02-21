import { configureStore } from '@reduxjs/toolkit';
import ridesApi from "./features/rides/ridesApi";
import requestsApi from "./features/request/requestsApi"; // Import the new request API

export const store = configureStore({
  reducer: {
    [ridesApi.reducerPath]: ridesApi.reducer, // ✅ API reducer
    [requestsApi.reducerPath]: requestsApi.reducer, // ✅ API reducer for requests
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ridesApi.middleware, requestsApi.middleware), // ✅ Add request API middleware
});

export default store;
