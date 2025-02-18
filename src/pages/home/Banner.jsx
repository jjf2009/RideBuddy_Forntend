import React from "react";
import { FaCar } from "react-icons/fa";

const Banner = () => {
  return (
    <div
      className="hero min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:"url(./carpool.avif)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-lg">
          <h1 className="mb-5 text-5xl font-bold flex items-center justify-center">
            <FaCar className="mr-2" /> RideBuddy
          </h1>
          <p className="mb-5 text-lg">
          Simple and friendly, like a buddy for rides
          </p>
          <p className="mb-5 text-lg">
          For GEC students, by GEC students
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Banner;