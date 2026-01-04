import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary">
          <Link to={"/"}>ShipSmart</Link>{" "}
        </h1>

        {/* Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li className="hover:text-primary cursor-pointer">
            <a href="#home">Home</a>{" "}
          </li>
          <li className="hover:text-primary cursor-pointer">
            <a href={"#track"}>Track</a>
          </li>
          <li className="hover:text-primary cursor-pointer">
            <a href="#features">Features</a>{" "}
          </li>
          <li className="hover:text-primary cursor-pointer">
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Buttons */}
        <div className="space-x-4 hidden md:flex">
          <Link
            to={"/role"}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to={"/signup"}
            className="px-4 py-2 bg-secondary text-black font-semibold rounded-lg hover:opacity-80 transition"
          >
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          {isOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-menu" className="md:hidden px-6 pb-4">
          <ul className="space-y-3 text-gray-700 font-medium">
            <li className="hover:text-primary cursor-pointer">
              <a href="#home" onClick={() => setIsOpen(false)}>
                Home
              </a>
            </li>
            <li className="hover:text-primary cursor-pointer">
              <a href="#track" onClick={() => setIsOpen(false)}>
                Track
              </a>
            </li>
            <li className="hover:text-primary cursor-pointer">
              <a href="#features" onClick={() => setIsOpen(false)}>
                Features
              </a>
            </li>
            <li className="hover:text-primary cursor-pointer">
              <a href="#contact" onClick={() => setIsOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to={"/role"}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="px-4 py-2 bg-secondary text-black font-semibold rounded-lg hover:opacity-80 transition text-center"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
