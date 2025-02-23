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
  const [distanceInKm, setDistanceInKm] = useState(null); 
  const [perPersonFare, setPerPersonFare] = useState(null);
  const [seatsAvailable, setSeatsAvailable] = useState(0);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [routeDescription, setRouteDescription] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  const auth = getAuth();
  const currentDriverId = auth.currentUser?.uid;
  const [addRide, { isLoading, error }] = useAddRideMutation();

  const calculateFare = (distance, seats) => {
    if (!distance || !seats) return null;
    const fuelEfficiency = 15;
    const petrolPrice = 96.62;
    const totalFare = (distance / fuelEfficiency) * petrolPrice;
    return { totalFare, perSeatFare: seats > 0 ? totalFare / seats : totalFare };
  };

  useEffect(() => {
    if (distanceInKm && seatsAvailable) {
      const { perSeatFare } = calculateFare(distanceInKm, seatsAvailable);
      setPerPersonFare(perSeatFare);
    }
  }, [distanceInKm, seatsAvailable]);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !startLocation || !endLocation) return;
    
    const fetchCoordinates = async () => {
      try {
        const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startLocation)}`);
        const startData = await startRes.json();
        const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endLocation)}`);
        const endData = await endRes.json();
        
        if (startData.length > 0 && endData.length > 0) {
          const startCoords = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
          const endCoords = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];
          
          if (mapRef.current.routing) {
            mapRef.current.removeControl(mapRef.current.routing);
          }
          
          mapRef.current.routing = L.Routing.control({
            waypoints: [L.latLng(...startCoords), L.latLng(...endCoords)],
            routeWhileDragging: true,
            lineOptions: { styles: [{ color: '#6366F1', weight: 5 }] },
          }).addTo(mapRef.current);

          mapRef.current.routing.on('routesfound', function (e) {
            const route = e.routes[0];
            const distance = route.summary.totalDistance / 1000;
          
            if (!distance || distance <= 0) {
              console.error("Invalid distance received:", distance);
              return;
            }
          
            setDistanceInKm(distance); // Set distance before using it
          
            const description = `Route: ${startLocation} to ${endLocation}. via ${route.name || 'custom route'}.` +
           ` Total distance: ${distance.toFixed(1)} km. ` +  
            `Estimated travel time: ${Math.round(route.summary.totalTime / 60)} minutes.`;
            
            setRouteDescription(description);
          });
        }
      } catch (err) {
        console.error("Error fetching coordinates:", err);
      }
    };
    
    fetchCoordinates();
  }, [startLocation, endLocation]);
  
  const onSubmit = async (formData) => {
    if (!routeDescription || !distanceInKm) {
      alert("Please wait for route calculation to complete");
      return;
    }

    const rideData = {
      ...formData,
      DriverId: currentDriverId,
      year: parseInt(formData.year, 10),
      drivingexp: parseInt(formData.experience, 10),
      vehicle: formData.carModel,
      price: perPersonFare.toFixed(2) ? parseFloat(perPersonFare) : 0,  // Ensure price is a number
      seatsAvailable: seatsAvailable ? parseInt(seatsAvailable, 10) : 0,  // Ensure seatsAvailable is a number
      phoneNumber: formData.phone,
      routeDescription,
    };
    
    console.log(rideData)

    try {
      await addRide(rideData).unwrap();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating ride:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Publish a Ride</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PublishForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          routeDescription={routeDescription}
          submitSuccess={submitSuccess}
          calculateFare={perPersonFare}
          setStartLocation={setStartLocation}
          setEndLocation={setEndLocation}
          setSeatsAvailable={setSeatsAvailable}
        />
        <div className="h-full">
          <label className="block text-gray-700 font-medium">Select Your Route</label>
          <p className="text-sm text-gray-500">Enter start and end locations, then customize your route.</p>
          <div ref={mapContainerRef} className="h-96 rounded-lg border border-gray-300 overflow-hidden" />
        </div>
      </div>
    </div>
  );
};

export default PublishRide;
