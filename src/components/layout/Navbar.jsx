import { Link } from "react-router-dom";

export default function Navbar() {
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
      </div>
    </nav>
  );
}
