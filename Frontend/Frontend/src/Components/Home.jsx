import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl md:text-5xl mt-24 font-bold text-blue-800 text-center mb-6">
        Welcome to the Customer Support Ticketing System
      </h1>

      <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl mb-10">
        Streamline your support. Submit tickets, track issues, and get quick resolutions — all in one place.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-amber-200 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-gray-200 text-blue-800 rounded-full shadow-md hover:bg-gray-300 transition"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-12 w-full max-w-4xl">
        <img
          src="https://illustrations.popsy.co/gray/customer-support.svg"
          alt="Customer support illustration"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Home;
