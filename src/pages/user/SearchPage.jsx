import React, { useState, useEffect } from "react";
import Search from "./Search";
import Card from "./Card";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import { useFetchAllRidesQuery } from "../../redux/features/rides/ridesApi";

const SearchPage = () => {
  const { data: rides = [], isLoading, isError } = useFetchAllRidesQuery();
  const [searchParams, setSearchParams] = useState(null);
  const [filteredRides, setFilteredRides] = useState([]);

  const handleSearch = (formData) => {
    if (!formData) {
      setFilteredRides([]);
      setSearchParams(null);
      return;
    }

    let hasSearchCriteria = false;
    const searchStartLocation = formData.startLocation?.toLowerCase().trim() || '';
    const searchEndLocation = formData.endLocation?.toLowerCase().trim() || '';
    const searchRoute = formData.route || null;
    
    if (searchStartLocation !== '' || searchEndLocation !== '') {
      hasSearchCriteria = true;
    } else {
      setFilteredRides([]);
      setSearchParams(null);
      return;
    }

    const results = rides.filter(ride => {
      if (!ride || (!ride.startLocation && !ride.endLocation)) {
        return false;
      }
      
      const rideStartLocation = (ride.startLocation || '').toLowerCase();
      const rideEndLocation = (ride.endLocation || '').toLowerCase();
      
      let startMatch = true;
      let endMatch = true;
      
      if (searchStartLocation !== '') {
        startMatch = rideStartLocation.includes(searchStartLocation);
      }
      
      if (searchEndLocation !== '') {
        endMatch = rideEndLocation.includes(searchEndLocation);
      }
      
      return startMatch && endMatch;
    });
    
    setFilteredRides(results);
    setSearchParams({
      ...formData,
      hasRouteData: !!searchRoute
    });
  };

  useEffect(() => {}, [rides]);

  const displayRides = searchParams ? filteredRides : rides;

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading rides...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error loading rides. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Search onSearch={handleSearch} />
      </div>
      
      {searchParams && filteredRides.length === 0 && (
        <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">No matching rides found. Try adjusting your search.</p>
        </div>
      )}
      
      {displayRides.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Available Rides</h2>
          
          <Swiper
            slidesPerView={3}
            grid={{ rows: 3, fill: "row" }}
            spaceBetween={30}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Navigation, Grid]}
            className="mySwiper"
          >
            {displayRides.map((ride, index) => (
              <SwiperSlide key={ride.id || index}>
                <Card ride={ride} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No rides available at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
