import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAddRideMutation } from "../redux/features/rides/ridesApi";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { compose } from "@reduxjs/toolkit";

const PublishRide = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDescription, setRouteDescription] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const startLocation = watch('startLocation');
  const endLocation = watch('endLocation');

  // Use the mutation hook from RTK Query
  const [addRide, { isLoading, error }] = useAddRideMutation();

  // Initialize map once component mounts
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Create map
      mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update route when start or end location changes
  useEffect(() => {
    if (mapRef.current && startLocation && endLocation) {
      // Clear previous routing if it exists
      if (mapRef.current.routing) {
        mapRef.current.removeControl(mapRef.current.routing);
      }

      // Use OpenStreetMap Nominatim to geocode locations
      const fetchCoordinates = async () => {
        try {
          // Geocode start location
          const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startLocation)}`);
          const startData = await startRes.json();
          
          // Geocode end location
          const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endLocation)}`);
          const endData = await endRes.json();
          
          if (startData.length > 0 && endData.length > 0) {
            const startCoords = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
            const endCoords = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];
            
            // Add routing control
            mapRef.current.routing = L.Routing.control({
              waypoints: [
                L.latLng(startCoords[0], startCoords[1]),
                L.latLng(endCoords[0], endCoords[1])
              ],
              routeWhileDragging: true,
              lineOptions: {
                styles: [{ color: '#6366F1', weight: 5 }]
              },
              show: true,
              addWaypoints: true,
              draggableWaypoints: true,
              fitSelectedRoutes: true
            }).addTo(mapRef.current);
            
            // Get route data when route calculation completes
            mapRef.current.routing.on('routesfound', function(e) {
              const routes = e.routes;
              const route = routes[0]; // Get first route
              
              // Extract coordinates
              const coords = route.coordinates.map(c => [c.lat, c.lng]);
              setRouteCoordinates(coords);
              
              // Extract route summary
              const summary = route.summary;
              setRouteDescription(
                `Route: ${startLocation} to ${endLocation} via ${route.name || 'custom route'}. ` +
                `Total distance: ${(summary.totalDistance / 1000).toFixed(1)} km. ` +
                `Estimated travel time: ${Math.round(summary.totalTime / 60)} minutes.`
              );
            });
          }
        } catch (err) {
          console.error("Error fetching coordinates:", err);
        }
      };
      
      fetchCoordinates();
    }
  }, [startLocation, endLocation]);

  const onSubmit = async (formData) => {
    try {
      // Convert string values to numbers where needed
      const rideData = {
        ...formData,
        drivingexp: parseInt(formData.experience),
        vehicle: formData.carModel,
        price: parseFloat(formData.price),
        seatsAvailable: parseInt(formData.seatsAvailable),
        phoneNumber: formData.phone,
        // routeCoordinates: routeCoordinates,
        routeDescription: routeDescription,
      };
      console.log(formData)
      console.log(rideData)
     
      // Use the mutation to send data to the API
      const response = await addRide(rideData).unwrap();
    
      
      setSubmitSuccess(true);
      reset();
      
      console.log("Ride created successfully:", response);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating ride:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Publish a Ride</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Ride published successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error.data?.message || error.error || "Failed to publish ride"}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Driver Name */}
            <div>
              <label className="block text-gray-700">Driver Name</label>
              <input
                type="text"
                {...register("driverName", { required: true })}
                className="border rounded w-full p-2"
                placeholder="Enter your name"
              />
              {errors.driverName && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-gray-700">Department</label>
              <input
                type="text"
                {...register("department", { required: true })}
                className="border rounded w-full p-2"
                placeholder="Your department"
              />
              {errors.department && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-700">Year</label>
              <input
                type="text"
                {...register("year", { required: true })}
                className="border rounded w-full p-2"
                placeholder="Academic year"
              />
              {errors.year && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                {...register("age", { required: true, min: 18 })}
                className="border rounded w-full p-2"
                placeholder="Your age"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.type === 'min' ? 'You must be at least 18' : 'This field is required'}</p>}
            </div>

            {/* Experience - renamed to match backend field */}
            <div>
              <label className="block text-gray-700">Driving Experience (Years)</label>
              <input
                type="number"
                {...register("experience", { required: true, min: 0 })}
                className="border rounded w-full p-2"
                placeholder="Enter years of experience"
              />
              {errors.experience && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Start Location */}
            <div>
              <label className="block text-gray-700">Start Location</label>
              <input
                type="text"
                {...register("startLocation", { required: true })}
                className="border rounded w-full p-2"
                placeholder="Enter pickup location"
              />
              {errors.startLocation && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* End Location */}
            <div>
              <label className="block text-gray-700">End Location</label>
              <input
                type="text"
                {...register("endLocation", { required: true })}
                className="border rounded w-full p-2"
                placeholder="Enter destination"
              />
              {errors.endLocation && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="border rounded w-full p-2"
              />
              {errors.date && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Time */}
            <div>
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                {...register("time", { required: true })}
                className="border rounded w-full p-2"
              />
              {errors.time && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Car Model - will be mapped to 'vehicle' in backend */}
            <div>
              <label className="block text-gray-700">Car Model</label>
              <input
                type="text"
                {...register("carModel", { required: true })}
                className="border rounded w-full p-2"
                placeholder="Enter car model"
              />
              {errors.carModel && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Seats Available */}
            <div>
              <label className="block text-gray-700">Seats Available</label>
              <input
                type="number"
                {...register("seatsAvailable", { required: true, min: 1 })}
                className="border rounded w-full p-2"
                placeholder="Enter available seats"
              />
              {errors.seatsAvailable && <p className="text-red-500 text-sm">{errors.seatsAvailable.type === 'min' ? 'At least 1 seat is required' : 'This field is required'}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
                className="border rounded w-full p-2"
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm">Enter a valid 10-digit phone number</p>}
            </div>

            {/* Price - fixed the field name */}
            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: true, min: 0 })}
                className="border rounded w-full p-2"
                placeholder="Enter price of the trip"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.type === 'min' ? 'Price cannot be negative' : 'This field is required'}</p>}
            </div>

            {/* Route Description */}
            {routeDescription && (
              <div>
                <label className="block text-gray-700">Route Information</label>
                <div className="border rounded w-full p-2 bg-gray-50">
                  {routeDescription}
                </div>
              </div>
            )}
              <div className="h-full">
          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Select Your Route</label>
            <p className="text-sm text-gray-500">Enter start and end locations, then customize your route by dragging waypoints</p>
          </div>
          <div 
            ref={mapContainerRef} 
            className="h-96 rounded-lg border border-gray-300 overflow-hidden" 
          />
          {routeCoordinates.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              <p>You can adjust your route by dragging the blue waypoint markers. The route will be saved with your ride.</p>
            </div>
          )}
        </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`w-full ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded`}
              disabled={isLoading || !routeCoordinates.length}
            >
              {isLoading ? 'Publishing...' : 'Publish Ride'}
            </button>
          </form>
        </div>
        
        {/* Map Section */}
      
      </div>
    </div>
  );
};

export default PublishRide;