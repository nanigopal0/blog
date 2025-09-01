import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import React from "react";

export default function Footer() {
  
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              About Blogify
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Blogify is your go-to platform for sharing ideas, connecting with
              others, and exploring amazing blogs from around the world.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white hover:underline transition-colors duration-200">
                Home
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white hover:underline transition-colors duration-200">
                About Us
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white hover:underline transition-colors duration-200">
                Contact
              </a>
              <a href="/privacy" className="block text-gray-300 hover:text-white hover:underline transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Blogify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}