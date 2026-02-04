import { Link } from "react-router-dom";


const NotFoundPage = () => {
  return (
    <header
      className="py-3 my-5"
      style={{ backgroundColor: "hsl(0, 60%, 64%)" }}
    >
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bold">404 - Page Not Found</h1>
          <p className="lead fw-normal text-white-75 mb-4">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link to="/" className="btn btn-light btn-lg rounded-pill px-4 py-2">
            Go to Home
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NotFoundPage;
