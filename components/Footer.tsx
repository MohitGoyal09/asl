import React from "react";
import {
  FaEye, // Changed from FaHeart to FaEye for Eyelink
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaStethoscope, // Keeping for Services, can be replaced if needed
  FaFirstAid, // Keeping for Contact, can be replaced if needed
  FaUser, // Keeping for Resources, can be replaced if needed
  FaCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background/80 border-t border-muted/20">
      {/* Main Footer Content */}
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                {" "}
                {/* Updated gradient */}
                <FaEye className="w-7 h-7 text-white" />{" "}
                {/* Changed icon to FaEye */}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  {/* Updated gradient */}
                  Eyelink {/* Updated Brand Name */}
                </span>
                <span className="text-xs text-muted-foreground">
                  Bridging Hearts, Paving Ways
                </span>{" "}
                {/* Updated tagline */}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Your partner in inclusivity, providing solutions for accessible
              communication, mobility, and care for differently-abled
              individuals. {/* Updated description */}
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Eyelink Services Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaStethoscope className="w-5 h-5 text-blue-500" />{" "}
              {/* Keeping icon, can be changed */}
              <h3 className="text-lg font-semibold">Eyelink Services</h3>{" "}
              {/* Updated Section Title */}
            </div>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/asl-translator" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  ASL Translator
                </Link>
              </li>
              <li>
                <Link
                  href="/cabs" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Specialized Cabs
                </Link>
              </li>
              <li>
                <Link
                  href="/care-providers" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Care Providers
                </Link>
              </li>
              <li>
                <Link
                  href="/asl-translator/text-chat" // Example: Link to text chat feature
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Text Chat with ASL
                </Link>
              </li>
              <li>
                <Link
                  href="/asl-translator/live-chat" // Example: Link to live chat feature
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Live ASL Translation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaUser className="w-5 h-5 text-blue-500" />{" "}
              {/* Keeping icon, can be changed */}
              <h3 className="text-lg font-semibold">
                Resources & Information
              </h3>{" "}
              {/* Updated Section Title */}
            </div>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <Link
                  href="/about" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  About Eyelink
                </Link>
              </li>
              <li>
                <Link
                  href="/faq" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility" // Updated link to an accessibility page (if you have one)
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link
                  href="/contact" // Updated link
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {/* Updated bullet color */}
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FaFirstAid className="w-5 h-5 text-blue-500" />{" "}
              {/* Keeping icon, can be changed */}
              <h3 className="text-lg font-semibold">Contact Us</h3>{" "}
              {/* Updated Section Title */}
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500 shrink-0" />{" "}
                {/* Updated icon color */}
                <span>
                  123 Inclusivity Plaza {/* Updated Example Address */}
                  <br />
                  Accessibility District {/* Updated Example Address */}
                  <br />
                  MD 54321 {/* Updated Example Address */}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaPhone className="w-5 h-5 text-blue-500" />{" "}
                {/* Updated icon color */}
                <a
                  href="tel:+1-800-EYE-LINK" // Updated Example Phone Number
                  className="hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  1-800-EYE-LINK {/* Updated Example Phone Number */}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaEnvelope className="w-5 h-5 text-blue-500" />{" "}
                {/* Updated icon color */}
                <a
                  href="mailto:support@eyelink.com" // Updated Example Email
                  className="hover:text-blue-500 transition-colors duration-200" // Updated hover color
                >
                  support@eyelink.com {/* Updated Example Email */}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaClock className="w-5 h-5 text-blue-500" />{" "}
                {/* Updated icon color */}
                <div>
                  <p>Mon-Fri: 9:00 AM - 5:00 PM</p>{" "}
                  {/* Updated Example Hours - adjust as needed */}
                  <p>Sat-Sun: Closed</p>{" "}
                  {/* Updated Example Hours - adjust as needed */}
                  {/* Removed Emergency Line as it's not relevant */}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Eyelink. All rights reserved.{" "}
              {/* Updated Brand Name */}
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link
                href="/privacy-policy" // Updated link - create this page
                className="text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service" // Updated link - create this page
                className="text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility" // Updated link - keep if you have accessibility page
                className="text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200" // Updated hover color
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Removed Emergency Banner at the bottom - not relevant for Eyelink */}
    </footer>
  );
}
