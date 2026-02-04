import { useContext, useState } from "react";
import "./LoginPage.css";
import Error from "../ui/Error";
import api from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const { setIsAuthenticated, setUsername } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    api
      .post("api/token/", { username: usernameInput, password })
      .then((response) => {
        // Store tokens consistently
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        setUsernameInput("");
        setPassword("");
        setLoading(false);

        // Decode JWT and update context
        const decoded = jwtDecode(response.data.access);

        // If you added custom claim in CustomTokenObtainPairSerializer
        // use decoded.username, otherwise fallback to usernameInput
        setIsAuthenticated(true);
        setUsername(decoded.username || usernameInput);

        // Redirect to previous page or home
        const from = location?.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Login failed");
        setLoading(false);
      });
  };

  return (
    <div className="login-container my-5">
      <div className="login-card shadow">
        {error && <Error error={error} />}
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label d-block">
              Username
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="form-control mt-1"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                required
              />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label d-block">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mt-1"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <a href="#">Forgot Password</a>
          </p>
          <p>
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
