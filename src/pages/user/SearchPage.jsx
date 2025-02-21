import React, { useState, useEffect } from "react";
import Search from "./Search";
import Card from "./Card";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllRidesQuery } from "../../redux/features/rides/ridesApi";

const SearchPage = () => {
  const { data: rides = [], isLoading, isError } = useFetchAllRidesQuery();
  const [searchParams, setSearchParams] = useState(null);
  const [filteredRides, setFilteredRides] = useState([]);

  // console.log("All rides from API:", rides); // Debugging

  // Filter rides based on search criteria
  const handleSearch = (formData) => {
    // console.log("Search form data:", formData); // Debugging
    
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

    // Log the search terms for debugging
    // console.log("Searching for - Start:", searchStartLocation, "End:", searchEndLocation);
    
    const results = rides.filter(ride => {
      // Safety check - ensure ride and required locations exist
      if (!ride || (!ride.startLocation && !ride.endLocation)) {
        console.log("Found a ride with missing data:", ride);
        return false;
      }
      
      // Case-insensitive matching for both locations
      const rideStartLocation = (ride.startLocation || '').toLowerCase();
      const rideEndLocation = (ride.endLocation || '').toLowerCase();
      
      // Determine matches based on provided search criteria
      let startMatch = true; // Default to true if no start location provided
      let endMatch = true;   // Default to true if no end location provided
      
      if (searchStartLocation !== '') {
        startMatch = rideStartLocation.includes(searchStartLocation);
      }
      
      if (searchEndLocation !== '') {
        endMatch = rideEndLocation.includes(searchEndLocation);
      }
      
      // If we have route coordinates and the ride has route coordinates, we could do a more
      // sophisticated matching based on route similarity (not implemented in this example)
      
      const isMatch = startMatch && endMatch;
      
      console.log(
        `Ride ${ride.id || 'unknown'} - startLocation: "${ride.startLocation}", endLocation: "${ride.endLocation}" - Match: ${isMatch}`
      );
      
      return isMatch;
    });
    
    console.log("Filtered results:", results);
    
    setFilteredRides(results);
    setSearchParams({
      ...formData,
      hasRouteData: !!searchRoute
    });
  };

  // For debugging - log when rides data changes
  useEffect(() => {
    // console.log("Rides data changed, count:", rides.length);
  }, [rides]);

  // Determine which rides to display
  const displayRides = searchParams ? filteredRides : rides;

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading rides...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error loading rides. Please try again later.</div>;
  }

  // Function to generate search result description
  const getSearchResultDescription = () => {
    if (!searchParams) return 'Available Rides';
    
    const parts = [];
    if (searchParams.startLocation) parts.push(`from "${searchParams.startLocation}"`);
    if (searchParams.endLocation) parts.push(`to "${searchParams.endLocation}"`);
    if (searchParams.hasRouteData) parts.push('(with route)');
    
    return `Rides ${parts.join(' ')} (${filteredRides.length} found)`;
  };

  // Function to generate no results message
  const getNoResultsMessage = () => {
    if (!searchParams) return 'No rides available at the moment. Check back later!';
    
    const criteria = [];
    if (searchParams.startLocation) criteria.push(`start location "${searchParams.startLocation}"`);
    if (searchParams.endLocation) criteria.push(`destination "${searchParams.endLocation}"`);
    if (searchParams.hasRouteData) criteria.push('selected route');
    
    return `No rides found matching ${criteria.join(' and ')}. Try adjusting your search.`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Search onSearch={handleSearch} />
      </div>

      {/* Debug information */}
      <div className="mb-4 p-2 bg-gray-100 rounded-lg text-xs">
        <p>Total rides: {rides.length}</p>
        <p>Search active: {searchParams ? 'Yes' : 'No'}</p>
        <p>Filtered rides: {filteredRides.length}</p>
        <p>Search start: {searchParams?.startLocation || 'None'}</p>
        <p>Search end: {searchParams?.endLocation || 'None'}</p>
        <p>Route data: {searchParams?.hasRouteData ? 'Yes' : 'No'}</p>
      </div>

      {/* Show message if no results after search */}
      {searchParams && filteredRides.length === 0 && (
        <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            {getNoResultsMessage()}
          </p>
        </div>
      )}

      {/* Search Results or Available Rides */}
      {displayRides.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            {getSearchResultDescription()}
          </h2>
          
          <Swiper
  slidesPerView={3}
  spaceBetween={30}
  navigation={true}
  pagination={{ clickable: true }}
  grid={{ rows: 3, fill: "row" }} // 👈 Add grid layout with 3 rows
  breakpoints={{
    640: { slidesPerView: 1, spaceBetween: 20, grid: { rows: 3, fill: "row" } },
    768: { slidesPerView: 2, spaceBetween: 40, grid: { rows: 3, fill: "row" } },
    1024: { slidesPerView: 2, spaceBetween: 50, grid: { rows: 3, fill: "row" } },
    1180: { slidesPerView: 3, spaceBetween: 50, grid: { rows: 3, fill: "row" } }
  }}
  modules={[Pagination, Navigation]}
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
          <p className="text-gray-600">
            {getNoResultsMessage()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;