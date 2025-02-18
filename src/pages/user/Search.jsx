import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const Search = ({ onSearch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [route, setRoute] = useState(null);
  const [routeDescription, setRouteDescription] = useState('');
  
  const startLocation = watch('startLocation');
  const endLocation = watch('endLocation');
  
  // Initialize map once component mounts and showMap is true
  useEffect(() => {
    if (showMap && !mapRef.current && mapContainerRef.current) {
      // Create map
      mapRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5); // Center to India
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    
    return () => {
      if (mapRef.current && !showMap) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap]);
  
  // Update route when start or end location changes and map is shown
  useEffect(() => {
    if (mapRef.current && startLocation && endLocation && showMap) {
      // Clear previous routing if it exists
      if (mapRef.current.routing) {
        mapRef.current.removeControl(mapRef.current.routing);
      }

      // Geocode and create route
      const createRoute = async () => {
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
                styles: [{ color: '#3B82F6', weight: 5 }]
              },
              show: false, // Hide the text directions
              addWaypoints: true,
              draggableWaypoints: true,
              fitSelectedRoutes: true
            }).addTo(mapRef.current);
            
            // Get route data when route calculation completes
            mapRef.current.routing.on('routesfound', function(e) {
              const routes = e.routes;
              const route = routes[0]; // Get first route
              
              // Extract route data
              setRoute({
                coordinates: route.coordinates.map(c => [c.lat, c.lng]),
                summary: route.summary,
                name: route.name || 'custom route'
              });
              
              // Generate description
              setRouteDescription(
                `Route: ${startLocation} to ${endLocation} via ${route.name || 'custom route'}. ` +
                `Total distance: ${(route.summary.totalDistance / 1000).toFixed(1)} km. ` +
                `Estimated travel time: ${Math.round(route.summary.totalTime / 60)} minutes.`
              );
            });
          }
        } catch (err) {
          console.error("Error creating route:", err);
        }
      };
      
      createRoute();
    }
  }, [startLocation, endLocation, showMap]);
  
  const submitSearch = (data) => {
    console.log("Submitting search:", data);
    
    // Add route data if available
    if (route) {
      data.route = route;
      data.routeDescription = routeDescription;
    }
    
    onSearch(data);
  };
  
  const toggleMap = () => {
    setShowMap(prev => !prev);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(submitSearch)} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              {...register("startLocation")}
              placeholder="Enter pickup location"
              className="w-full p-2 border rounded-md"
            />
            {errors.startLocation && (
              <p className="text-red-500 text-xs mt-1">{errors.startLocation.message}</p>
            )}
          </div>
         
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              {...register("endLocation")}
              placeholder="Enter destination"
              className="w-full p-2 border rounded-md"
            />
            {errors.endLocation && (
              <p className="text-red-500 text-xs mt-1">{errors.endLocation.message}</p>
            )}
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={toggleMap}
              className="w-full md:w-auto bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Search Rides
            </button>
          </div>
        </div>
        
        {/* Map container - conditionally shown */}
        {showMap && (
          <div className="mt-4">
            <div 
              ref={mapContainerRef}
              className="h-64 rounded-lg border border-gray-300 overflow-hidden shadow-inner"
            />
            {routeDescription && (
              <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                <p className="font-medium">Selected Route:</p>
                <p>{routeDescription}</p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;