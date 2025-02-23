import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCar, FaUserAlt, FaRoute } from "react-icons/fa";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Card = ({ ride }) => {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Create WhatsApp message
  const createWhatsAppMessage = () => {
    const message = `Hello ${ride?.driverName}, I'm interested in your ride from ${ride?.startLocation} to ${ride?.endLocation} on ${ride?.date} at ${ride?.time}. Is it still available?`;
    return encodeURIComponent(message);
  };

  // Initialize map when showing it
  useEffect(() => {
    if (showMap && !mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      if (ride?.routeCoordinates && ride.routeCoordinates.length > 0) {
        try {
          const polyline = L.polyline(ride.routeCoordinates, { color: '#3B82F6', weight: 5 }).addTo(mapRef.current);
          mapRef.current.fitBounds(polyline.getBounds());
          const startPoint = ride.routeCoordinates[0];
          const endPoint = ride.routeCoordinates[ride.routeCoordinates.length - 1];
          L.marker(startPoint).addTo(mapRef.current).bindPopup(`<b>Start:</b> ${ride.startLocation}`);
          L.marker(endPoint).addTo(mapRef.current).bindPopup(`<b>End:</b> ${ride.endLocation}`);
        } catch (err) {
          console.error("Error displaying route:", err);
        }
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-green-600">₹{ride?.price}</h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaUserAlt size={14} />
            <span className="text-sm font-medium">{ride?.driverName}</span>
          </div>
        </div>

        <div className="space-y-2 mt-1">
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
            <div className="flex flex-col text-sm">
              <span className="font-medium">From: {ride?.startLocation}</span>
              <span className="font-medium">To: {ride?.endLocation}</span>
            </div>
          </div>

          {ride?.routeDescription && (
            <div className="flex items-start space-x-2 text-sm">
              <FaRoute className="text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600">{ride.routeDescription}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm">
            <FaCalendarAlt className="text-blue-500" />
            <span>{ride?.date ? formatDate(ride?.date) : 'Date not available'}</span>
            <FaClock className="text-orange-500 ml-2" />
            <span>{ride?.time || 'Time not available'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <FaCar className="text-gray-600" />
            <span>{ride?.vehicle}</span>
            <span className="ml-4 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {ride?.seatsAvailable} {ride?.seatsAvailable === 1 ? 'seat' : 'seats'} available
            </span>
          </div>

          <div className="text-xs text-gray-500 flex flex-wrap gap-2">
            <span className="bg-gray-100 px-2 py-1 rounded">
              Dept: {ride?.department}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              Experience: {ride?.drivingexp} years
            </span>
          </div>
        </div>

        <button
          className="mt-2 flex items-center justify-center w-full font-sans text-sm py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          type="button"
          onClick={() => setShowMap(prev => !prev)}
        >
          {showMap ? 'Hide Map' : 'Show Route Map'}
        </button>

        {showMap && (
          <div className="my-2">
            <div ref={mapContainerRef} className="h-48 rounded-lg border border-gray-300 overflow-hidden shadow-inner" />
          </div>
        )}

        <a
          className="mt-3 flex items-center justify-center w-full font-bold uppercase py-3 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-sm"
          href={`https://wa.me/${ride?.phoneNumber}?text=${createWhatsAppMessage()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Driver
        </a>
      </div>
    </div>
  );
};

export default Card;
