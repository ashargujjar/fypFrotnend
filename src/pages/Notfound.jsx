import React from "react";
import Navbar from "../components/layout/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

const Notfound = () => {
  return (
    <>
      <Navbar />

      <div className="my-80 text-center">
        <h1 className="font-bold text-2xl ">REQUESTED URL NOTFOUND</h1>
        <p className="capatalize text-xl">
          go to home page{" "}
          <Link
            to="/"
            className="text-blue-900 font-semibold underline hover:no-underline"
          >
            Home
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Notfound;
