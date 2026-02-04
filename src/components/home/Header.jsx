import React from "react";

const Header = () => {
  return (
    <header className="py-5" style={{ backgroundColor: "hsl(247, 60%, 64%)" }}>
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h1 className="display-4">Welcome to Shoppit</h1>
          <p className="lead">Your one-stop shop for all your needs</p>
          <a
            href="#shop"
            className="btn  btn-light btn-lg rounded-pill px-4 py-2"
          >
            Shop Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
