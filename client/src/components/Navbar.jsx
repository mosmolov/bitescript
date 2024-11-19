import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import Compass from "../images/Compass.png";
import Search from "../images/Search.png";
import Profile from "../images/Profile.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);
  return (
    <nav className="w-full px-8 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Bitescript Logo" className="h-24 mr-2" />
        </Link>
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
    </nav>
  );
};

export default Navbar;