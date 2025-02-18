import React, { useEffect, useState } from "react";
import {useFetchRideByIdQuery } from "../../redux/features/ride/ridesApi";

const Drawer = ({ rideId, setSelectedRideId }) => {
  const { data: ride, isLoading, isError } = useFetchRideByIdQuery(rideId);

  return (
    <div className="drawer drawer-open fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="drawer-side w-80 bg-white p-4 shadow-lg h-full">
        {/* Close Drawer */}
        <button
          onClick={() => setSelectedRideId(null)}
          className="btn btn-sm btn-circle absolute top-2 right-2"
        >
          ✕
        </button>

        {/* Loading & Error Handling */}
        {isLoading && <p>Loading...</p>}
        {isError && <p className="text-red-500">Error loading ride details.</p>}

        {/* Ride Details */}
        {ride && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Ride Details</h2>
            <p><strong>Driver:</strong> {ride.driverName}</p>
            <p><strong>Department:</strong> {ride.department}</p>
            <p><strong>Year:</strong> {ride.year}</p>
            <p><strong>Age:</strong> {ride.age}</p>
            <p><strong>Experience:</strong> {ride.experience} years</p>
            <p><strong>Start:</strong> {ride.startLocation}</p>
            <p><strong>End:</strong> {ride.endLocation}</p>
            <p><strong>Date:</strong> {ride.date}</p>
            <p><strong>Time:</strong> {ride.time}</p>
            <p><strong>Car Model:</strong> {ride.carModel}</p>
            <p><strong>Seats Available:</strong> {ride.seatsAvailable}</p>
            <p><strong>Phone:</strong> {ride.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
