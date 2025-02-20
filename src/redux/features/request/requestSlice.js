import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
    rideRequests: [] // Stores ride requests
};

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        addRideRequest: (state, action) => {
            const existingRequest = state.rideRequests.find(request => request.id === action.payload.id);
            if (!existingRequest) {
                state.rideRequests.push(action.payload);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Ride Request Added!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Request Already Exists",
                    text: "This ride request is already added!",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK"
                });
            }
        },
        removeRideRequest: (state, action) => {
            state.rideRequests = state.rideRequests.filter(request => request.id !== action.payload.id);
        },
        clearRideRequests: (state) => {
            state.rideRequests = [];
        }
    }
});

// Export actions and reducer
export const { addRideRequest, removeRideRequest, clearRideRequests } = requestSlice.actions;
export default requestSlice.reducer;