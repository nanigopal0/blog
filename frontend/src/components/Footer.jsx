import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Blogify
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your go-to platform for sharing ideas, connecting with
              others, and exploring amazing blogs from around the world.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="sm:text-right">
            <h3 className="text-lg font-semibold mb-3 text-gray-200">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors duration-200">
                Home
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors duration-200">
                About Us
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Blogify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}