import UserInfo from "./UserInfo";
import OrderHistoryItemContainer from "./OrderHistoryItemContainer";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../ui/Spinner";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext"; // Import the context directly

const UserProfilePage = () => {
  const { setUsername } = useContext(AuthContext); // Use useContext directly (no custom useAuth hook needed)

  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userProfileData');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [orderItems, setOrderItems] = useState(() => {
    const savedOrders = localStorage.getItem('userOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  
  const [loading, setLoading] = useState(!userInfo);
  const [error, setError] = useState(null);

  const location = useLocation();

  const fetchUserData = async (force = false) => {
    const query = new URLSearchParams(location.search);
    const shouldForce = force || query.get("refresh") === "true";

    if (!shouldForce && userInfo && userInfo.id) {
      console.log("Using cached user data");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get("user_info");
      const data = response.data;
      
      console.log("Fresh API Response:", data);
      
      const processedUserInfo = {
        id: data.id || 0,
        username: data.username || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
      };
      
      localStorage.setItem('userProfileData', JSON.stringify(processedUserInfo));
      setUserInfo(processedUserInfo);
      
      // Sync username to AuthContext for navbar greeting
      setUsername(processedUserInfo.username || processedUserInfo.first_name || "User");
      
      const items = data.items || data.orders || data.order_items || [];
      localStorage.setItem('userOrders', JSON.stringify(items));
      setOrderItems(items);
      
    } catch (err) {
      console.error("Error fetching user profile:", err);
      
      if (userInfo) {
        console.log("Using cached data due to API error");
        return;
      }
      
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Initial fetch on mount (uses cache if possible)

  // Auto-refresh when ?refresh=true appears in URL (e.g., from payment success)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("refresh") === "true") {
      console.log("Detected ?refresh=true – forcing fresh fetch");
      fetchUserData(true);
      // Clean up URL to prevent re-trigger on browser back/forward (optional but recommended)
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search]);

  const handleRefresh = () => {
    fetchUserData(true);
  };

  if (loading && !userInfo) {
    return (
      <div className="container my-5 text-center py-5">
        <Spinner loading={true} />
        <p className="mt-3 text-muted">Loading your profile...</p>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          <h5 className="alert-heading">Error</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning" role="alert">
          <p>Please login to view your profile.</p>
          <a href="/login" className="btn btn-primary mt-2">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <UserInfo userInfo={userInfo} />
        </div>
        
        <div className="col-12 col-md-8">
          <OrderHistoryItemContainer orderItems={orderItems} />
          
          <div className="mt-3 text-end">
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={handleRefresh}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;