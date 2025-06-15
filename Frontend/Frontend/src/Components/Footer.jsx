import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 border-2 rounded-2xl border-gray-800 text-white w-full mt-10">
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-blue-300">Support System</h2>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-400">Privacy Policy</Link>
          <Link to="/" className="hover:text-blue-400">Terms</Link>
          <Link to="/" className="hover:text-blue-400">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
