import React from "react";
import { Link } from "react-router-dom";
import { Plus, UserRound, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const authContext = useAuth();
  // console.log("Auth Context:", authContext); // ✅ Debugging line

  if (!authContext) {
    console.error("useAuth() is returning undefined. Check AuthProvider.");
  }

  const { currentUser, logout } = authContext || {};

  // ✅ Get the number of ride requests from Redux
  // const rideRequests = useSelector((state) => state.requests.rideRequests);
  // const pendingRequests = rideRequests.filter((req) => req.status === "pending").length;

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          RideBuddy
        </Link>
      </div>

      <div className="navbar-center flex gap-4">
        <Link to="/search" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="ml-2">Search</span>
        </Link>

        <Link to="/publish" className="btn btn-ghost">
          <Plus className="h-5 w-5" />
          <span className="ml-2">Publish a Ride</span>
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-4">
        {/* 🔔 Notification Icon with Badge */}
        {/* <Link to="/requests" className="relative btn btn-ghost">
          <Bell className="h-6 w-6" />
          {pendingRequests > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {pendingRequests}
            </span>
          )}
        </Link> */}

        {/* 👤 Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <UserRound className="h-6 w-6" />
          </label>
          <ul tabIndex={0} className="menu dropdown-content menu-sm mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {!currentUser ? (
              <li>
                <Link to="/login">Login</Link>
              </li>
            ) : (
              <>
                <li>
                  <button onClick={logout} className="text-error">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
