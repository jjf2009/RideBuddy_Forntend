import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCar, FaUserAlt, FaRoute } from "react-icons/fa";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAuth } from "firebase/auth";
import { useAddRideRequestMutation,useFetchAllRequestsQuery } from "../../redux/features/request/requestsApi";

const Card = ({ ride }) => {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [addRideRequest, { isLoading, isSuccess, error }] = useAddRideRequestMutation();
  const { data: existingRequests= [] } = useFetchAllRequestsQuery();
  const [showModal, setShowModal] = useState(false); // Modal state
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (existingRequests && currentUserId) {
      const hasRequested = existingRequests.some(
        (req) => req.userId === currentUserId && req.rideId === ride.id
      );
      setAlreadyRequested(hasRequested);
    }
  }, [existingRequests, currentUserId, ride?.id]);

  useEffect(() => {
    if (isSuccess) {
      setShowModal(true);
      setAlreadyRequested(true);
    }
  }, [isSuccess]);

  const removeUndefined = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== undefined && key !== "id")
    );
  };
  
  const handleAddToRequest = async () => {
  
    if (!currentUserId) {
      console.error("Error: User not authenticated!");
      return;
    }
    
    if (alreadyRequested) {
      console.warn("User has already requested this ride.");
      return;
    }
  
    const cleanedRide = removeUndefined(ride); // ✅ Remove undefined fields
  
    // console.log(cleanedRide, { userId: currentDriverId });
  
    try {
      await addRideRequest({
        ...cleanedRide, // ✅ Ensure ride is properly structured
        userId: auth.currentUser?.uid,
        requesterName:auth.currentUser.displayName,
        profileImg :auth.currentUser.photoURL,
        rideId: ride.id,
      });
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Create WhatsApp message
  // const createWhatsAppMessage = () => {
  //   const message = `Hello ${ride?.driverName}, I'm interested in your ride from ${ride?.startLocation} to ${ride?.endLocation} on ${ride?.date} at ${ride?.time}. Is it still available?`;
  //   return encodeURIComponent(message);
  // };
  
  // Initialize map when showing it
  useEffect(() => {
    if (showMap && !mapRef.current && mapContainerRef.current) {
      // Create map
      mapRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5); // Center to India
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // If ride has route coordinates, display them
      if (ride?.routeCoordinates && ride.routeCoordinates.length > 0) {
        try {
          // Create polyline from coordinates
          const polyline = L.polyline(ride.routeCoordinates, {
            color: '#3B82F6',
            weight: 5
          }).addTo(mapRef.current);
          
          // Set map view to fit the route
          mapRef.current.fitBounds(polyline.getBounds());
          
          // Add markers for start and end
          const startPoint = ride.routeCoordinates[0];
          const endPoint = ride.routeCoordinates[ride.routeCoordinates.length - 1];
          
          L.marker(startPoint).addTo(mapRef.current)
            .bindPopup(`<b>Start:</b> ${ride.startLocation}`);
          
          L.marker(endPoint).addTo(mapRef.current)
            .bindPopup(`<b>End:</b> ${ride.endLocation}`);
        } catch (err) {
          console.error("Error displaying route:", err);
        }
      } else {
        // If no coordinates available, just mark start and end points based on geocoding
        const geocodeAndMark = async () => {
          try {
            // Geocode start location
            const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ride.startLocation)}`);
            const startData = await startRes.json();
            
            // Geocode end location
            const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ride.endLocation)}`);
            const endData = await endRes.json();
            
            if (startData.length > 0 && endData.length > 0) {
              const startCoords = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
              const endCoords = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];
              
              // Add markers
              L.marker(startCoords).addTo(mapRef.current)
                .bindPopup(`<b>Start:</b> ${ride.startLocation}`);
              
              L.marker(endCoords).addTo(mapRef.current)
                .bindPopup(`<b>End:</b> ${ride.endLocation}`);
              
              // Fit bounds to markers
              const bounds = L.latLngBounds([startCoords, endCoords]);
              mapRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
          } catch (err) {
            console.error("Error geocoding locations:", err);
          }
        };
        
        geocodeAndMark();
      }
    }
    
    return () => {
      if (mapRef.current && !showMap) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap, ride]);
  
  return (
    <div className="rounded-lg transition-shadow duration-300 border p-4 shadow-md hover:shadow-lg">
      <div className="flex flex-col gap-3">
        {/* Header with price and driver info */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-green-600">₹{ride?.price}</h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaUserAlt size={14} />
            <span className="text-sm font-medium">{ride?.driverName}</span>
          </div>
        </div>
        
        {/* Ride details */}
        <div className="space-y-2 mt-1">
          {/* Locations */}
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
            <div className="flex flex-col text-sm">
              <span className="font-medium">From: {ride?.startLocation}</span>
              <span className="font-medium">To: {ride?.endLocation}</span>
            </div>
          </div>
         
          {/* Route information if available */}
          {ride?.routeDescription && (
            <div className="flex items-start space-x-2 text-sm">
              <FaRoute className="text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600">{ride.routeDescription}</span>
            </div>
          )}
         
          {/* Date and time */}
          <div className="flex items-center space-x-2 text-sm">
            <FaCalendarAlt className="text-blue-500" />
            <span>{ride?.date ? formatDate(ride?.date) : 'Date not available'}</span>
            <FaClock className="text-orange-500 ml-2" />
            <span>{ride?.time || 'Time not available'}</span>
          </div>
         
          {/* Car details and seats */}
          <div className="flex items-center space-x-2 text-sm">
            <FaCar className="text-gray-600" />
            <span>{ride?.vehicle}</span>
            <span className="ml-4 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {ride?.seatsAvailable} {ride?.seatsAvailable === 1 ? 'seat' : 'seats'} available
            </span>
          </div>
         
          {/* Additional info like department/experience */}
          <div className="text-xs text-gray-500 flex flex-wrap gap-2">
            <span className="bg-gray-100 px-2 py-1 rounded">
              Dept: {ride?.department}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              Experience: {ride?.drivingexp} years
            </span>
          </div>
        </div>

        {/* Map toggle button */}
        <button
          className="mt-2 flex items-center justify-center w-full font-sans text-sm py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          type="button"
          onClick={() => setShowMap(prev => !prev)}
        >
          {showMap ? 'Hide Map' : 'Show Route Map'}
        </button>
        
        {/* Map container - conditionally shown */}
        {showMap && (
          <div className="my-2">
            <div 
              ref={mapContainerRef}
              className="h-48 rounded-lg border border-gray-300 overflow-hidden shadow-inner"
            />
          </div>
        )}
        
        {/* Contact driver button */}
        <button
          className="mt-3 flex items-center justify-center w-full font-bold uppercase py-3 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-sm"
          type="button"
          onClick={handleAddToRequest}
          disabled={isLoading || alreadyRequested}
          >{alreadyRequested ? "Request Sent" : isLoading ? "Sending..." : "Send Request to Join Ride"}
          </button>
         {/* Success Modal */}
         {showModal && (
          <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-t-lg shadow-lg p-4 w-full max-w-md">
              <h2 className="text-lg font-semibold">Request Sent!</h2>
              <p className="text-gray-600">Your request to join the ride has been successfully sent.</p>
              <button
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;