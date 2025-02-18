import React from "react";
import { Car, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
      <div className="card max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="text-9xl font-bold text-error mb-4">404</div>
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-6">
            <Car className="w-6 h-6" />
            <span>RideBuddy</span>
          </h1>
          
          <div className="flex flex-col items-center gap-3 mb-6">
            <MapPin className="w-16 h-16 text-error" />
            <h2 className="text-2xl font-semibold">Destination Not Found</h2>
            <p className="text-base-content/70">
              Looks like you've taken a wrong turn. The page you're looking for doesn't exist.
            </p>
          </div>
          
          <div className="card-actions">
            <Link to="/" className="btn btn-primary gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-base-content/50">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;