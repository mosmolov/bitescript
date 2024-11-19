import Navbar from "./Navbar";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
export const Home = ({user}) => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-[#EAE8E0] flex flex-col items-center text-center">
      <Navbar />
      <main className="mt-20">
        <h1
          className="text-5xl font-handwritten mb-10"
          style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
        >
          craving something?
        </h1>
        <div className="space-y-6 flex-col flex">
          <Link to="/create-account">
            <button className="bg-[#DFB839] text-black px-8 py-4 rounded-full font-semibold text-lg w-64">
              create an account
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-[#DFB839] text-black px-8 py-4 rounded-full font-semibold text-lg w-64">
              login
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
