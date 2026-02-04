import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="py-3"
      style={{ backgroundColor: "hsl(247, 66%, 65%)", color: "#f8f9fa" }}
    >
      <div className="container text-center">
        {/* Quick links Section */}
        <div className="mb-3">
          <a href="#" className="text-decoration-none text-white mx-2">
            Home
          </a>
          <a href="#" className="text-decoration-none text-white mx-2">
            Shop
          </a>
          <a href="#" className="text-decoration-none text-white mx-2">
            About
          </a>
          <a href="#" className="text-decoration-none text-white mx-2">
            Contact
          </a>
        </div>
        {/* Social Media Section */}
        <div className="mb-2">
          <a href="#" className=" text-white mx-2">
            <FaFacebook />
          </a>
          <a href="#" className=" text-white mx-2">
            <FaTwitter />
          </a>
          <a href="#" className=" text-white mx-2">
            <FaInstagram />
          </a>
        </div>
        {/* Copyright Section */}
        <p className="mb-0">&copy; 2026 Shoppit. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
