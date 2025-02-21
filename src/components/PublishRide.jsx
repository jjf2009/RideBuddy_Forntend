import React, { useState, useEffect, useRef } from "react";
import { useAddRideMutation } from "../redux/features/rides/ridesApi";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import PublishForm from "./PublishForm";
import { getAuth } from "firebase/auth";

const PublishRide = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fare, setFare] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDescription, setRouteDescription] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
 
  //Getting user id 
  const auth = getAuth();
  const currentDriverId = auth.currentUser?.uid; 

  // Use the mutation hook from RTK Query
  const [addRide, { isLoading, error }] = useAddRideMutation();

  // Helper function to calculate fare based on distance in km
  const calculateFare = (distanceInKm) => {
    const fuelEfficiency = 15; // assumed km per liter
    const petrolPrice = 96.62; // rupees per liter
    const litersNeeded = distanceInKm / fuelEfficiency;
    const calculatedFare = litersNeeded * petrolPrice;
    setFare(calculatedFare);
    return calculatedFare;
  };
  
  // Initialize map once component mounts
  useEffect(() => {
    try {
      if (!mapRef.current && mapContainerRef.current) {
        // Create map
        mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);
      }
    } catch (err) {
      console.error("Error initializing map:", err);
    }
    
    return () => {
      try {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (err) {
        console.error("Error cleaning up map:", err);
      }
    };
  }, []);

  // Update route when start or end location changes
  useEffect(() => {
    if (!mapRef.current || !startLocation || !endLocation) return;

    try {
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
              try {
                const routes = e.routes;
                const route = routes[0]; // Get first route
                
                // Extract coordinates
                const coords = route.coordinates.map(c => [c.lat, c.lng]);
                setRouteCoordinates(coords);
                
                // Extract route summary
                const summary = route.summary;
                const distanceInKm = summary.totalDistance / 1000;
                calculateFare(distanceInKm);
                
                // Set route description
                const description = `Route: ${startLocation} to ${endLocation} via ${route.name || 'custom route'}. ` +
                  `Total distance: ${distanceInKm.toFixed(1)} km. ` +
                  `Estimated travel time: ${Math.round(summary.totalTime / 60)} minutes.`;
                
                setRouteDescription(description);
              } catch (err) {
                console.error("Error processing route data:", err);
              }
            });
          }
        } catch (err) {
          console.error("Error fetching coordinates:", err);
        }
      };
      
      fetchCoordinates();
    } catch (err) {
      console.error("Error updating route:", err);
    }
  }, [startLocation, endLocation]);

  const onSubmit = async (formData) => {
    try {
      // Ensure we have route information before submission
      if (!routeDescription) {
        alert("Please wait for route calculation to complete");
        return;
      }

      // Convert string values to numbers where needed
      const rideData = {
        ...formData,
        DriverId:currentDriverId,
        year:parseInt(formData.year),
        // year:parseInt(formData.age),
        drivingexp: parseInt(formData.experience),
        vehicle: formData.carModel,
        price:parseInt(fare),
        seatsAvailable: parseInt(formData.seatsAvailable),
        phoneNumber: formData.phone,
        routeDescription: routeDescription,
      };
      // console.log(rideData)
      
      // Use the mutation to send data to the API
      const response = await addRide(rideData).unwrap();
      
      setSubmitSuccess(true);
      
      // console.log("Ride created successfully:", response);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating ride:", err);
      // alert(`Failed to create ride: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Publish a Ride</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div>
          <PublishForm 
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            routeDescription={routeDescription}
            submitSuccess={submitSuccess}
            calculateFare={fare}
            routeCoordinates={routeCoordinates}
            setStartLocation={setStartLocation}
            setEndLocation={setEndLocation}
          />
        </div>
        
        {/* Map Section */}
        <div className="h-full">
          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Select Your Route</label>
            <p className="text-sm text-gray-500">Enter start and end locations, then customize your route by dragging waypoints</p>
          </div>
          <div 
            ref={mapContainerRef} 
            className="h-96 rounded-lg border border-gray-300 overflow-hidden" 
            id="map-container"
          />
          {routeCoordinates.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              <p>You can adjust your route by dragging the blue waypoint markers. The route will be saved with your ride.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishRide;