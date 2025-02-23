import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, UserRound, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useAuth();
  const { currentUser, logout } = authContext || {};

  return (
    <nav className="bg-base-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Brand */}
        <Link to="/" className="text-xl font-bold">
          RideBuddy
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden btn btn-ghost"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-4">
          <Link to="/search" className="btn btn-ghost flex items-center">
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

          <Link to="/publish" className="btn btn-ghost flex items-center">
            <Plus className="h-5 w-5" />
            <span className="ml-2">Publish a Ride</span>
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="hidden lg:block">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <UserRound className="h-6 w-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col mt-4 space-y-2">
          <Link to="/search" className="btn btn-ghost">
            Search
          </Link>
          <Link to="/publish" className="btn btn-ghost">
            Publish a Ride
          </Link>
          {!currentUser ? (
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
          ) : (
            <button onClick={logout} className="btn btn-error">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
