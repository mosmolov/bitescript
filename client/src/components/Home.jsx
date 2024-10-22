import logo from "../logo.png";
import Compass from "../Compass.png";
import Search from "../Search.png";
import Profile from "../Profile.png";
import React from 'react';
import { Link } from "react-router-dom";

export const Home = ({user}) => {
  return (
    <div className="h-screen bg-[#EAE8E0] flex flex-col items-center text-center">
      <nav className="w-full py-4 px-8 flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Bitescript Logo" className="h-24 mr-2" />
        </div>
        <div className="flex space-x-6 text-lg">
          <button className="flex items-center space-x-2">
            <img src={Compass} alt=""/>
            <span>Feed</span>
          </button>
          <button className="flex items-center space-x-2">
            <img src={Search} alt=""/>
            <span>Search</span>
          </button>
          <button className="flex items-center space-x-2">
            <img src={Profile} alt=""/>
            <Link to={user ? "/profile" : "/login"}>Profile</Link>
          </button>
        </div>
      </nav>

      <main className="mt-20">
      <h1 className="text-5xl font-handwritten mb-10" style={{ fontFamily: '"Just Me Again Down Here", cursive' }}>craving something?</h1>
        <div className="space-y-6 flex-col flex">
          <button className="bg-[#DFB839] text-black px-8 py-4 rounded-full font-semibold text-lg"><Link to="/create-account">create an account</Link></button>
          <button className="bg-[#DFB839] text-black px-8 py-4 rounded-full font-semibold text-lg"><Link to="/login">login</Link></button>
        </div>
      </main>
    </div>
  );
};

export default Home;
