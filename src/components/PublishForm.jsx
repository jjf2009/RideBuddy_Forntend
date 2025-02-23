import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const PublishForm = ({ 
  onSubmit, 
  isLoading, 
  error, 
  routeDescription, 
  submitSuccess,
  calculateFare,
  setStartLocation,
  setEndLocation,
  setSeatsAvailable
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset // Used to reset form after successful submission
  } = useForm();

  const [showThankYou, setShowThankYou] = useState(false);

  // Watch form fields for location changes
  const startLocationValue = watch("startLocation");
  const endLocationValue = watch("endLocation");
  const SeatsAvailableValue = watch("seatsAvailable");


  // Update parent component with location values when they change
  useEffect(() => {
    if (startLocationValue) {
      setStartLocation(startLocationValue);
    }
  }, [startLocationValue, setStartLocation]);

  useEffect(() => {
    if (endLocationValue) {
      setEndLocation(endLocationValue);
    }
  }, [endLocationValue, setEndLocation]);
  useEffect(() => {
    if (SeatsAvailableValue) {
      setSeatsAvailable(SeatsAvailableValue);
    }
  }, [SeatsAvailableValue,setSeatsAvailable]);
  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data); // Ensure submission completes successfully
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        reset(); // Reset the form after showing the message
      }, 3000);
    } catch (err) {
      console.error("Submission failed", err);
    }
  };
  

  return (
     <div>
      {showThankYou ? (
        <div className="mb-4 p-3 bg-green-200 text-green-800 text-center rounded">
          🎉 Thank you for publishing your ride!
        </div>
      ) :<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
        <label className="block text-gray-700">Year Student</label>
        <input
          type="number"
          {...register("year", { required: true, min: 1 ,max :4 })}
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

      {/* Experience */}
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

      {/* Car Model */}
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

      {/* Fare Information */}
      {calculateFare && (
        <div>
          <label className="block text-gray-700">Estimated Fare</label>
          <div className="border rounded w-full p-2 bg-gray-50">
            ₹{calculateFare.toFixed(2)}
          </div>
        </div>
      )}

      {/* Route Description */}
      {routeDescription && (
        <div>
          <label className="block text-gray-700">Route Information</label>
          <div className="border rounded w-full p-2 bg-gray-50">
            {routeDescription}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        className={`w-full ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded`}
        disabled={isLoading}
      >
        {isLoading ? 'Publishing...' : 'Publish Ride'}
      </button>
    </form>
    }
   </div>
  );
};

export default PublishForm;