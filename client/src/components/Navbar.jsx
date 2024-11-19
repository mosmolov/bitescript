import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import Compass from "../images/Compass.png";
import Search from "../images/Search.png";
import Profile from "../images/Profile.png";
import SearchUsers from './SearchUsers';

const Navbar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <nav className="w-full bg-[#EAE8E0]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Bitescript Logo" className="h-24 mr-2" />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <SearchUsers />
        </div>
        <div className="flex space-x-6 text-lg">
          <Link to="/feed">
            <button className="flex items-center space-x-2">
              <img src={Compass} alt="" />
              <span>Feed</span>
            </button>
          </Link>
          <Link to="/search">
            <button className="flex items-center space-x-2">
              <img src={Search} alt="" />
              <span>Search</span>
            </button>
          </Link>
          <Link to={user ? `/users/${user._id}` : "/login"}>
            <button className="flex items-center space-x-2">
              <img src={Profile} alt="" />
              <span>Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;