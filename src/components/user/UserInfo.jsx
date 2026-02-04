import pic from "../../assets/profile.png";

const UserInfo = ({ userInfo = {} }) => {
  // SIMPLE display name calculation
  const getDisplayName = () => {
    const firstName = userInfo.first_name || "";
    const lastName = userInfo.last_name || "";

    // Try full name first
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;

    // Fallback to username
    if (userInfo.username) return userInfo.username;

    // Fallback to email username
    if (userInfo.email) return userInfo.email.split("@")[0];

    // Final fallback
    return "User";
  };

  const displayName = getDisplayName();
  const email = userInfo.email || "";
  const phone = userInfo.phone || "";
  const username = userInfo.username || "";
  const city = userInfo.city || "";
  const state = userInfo.state || "";
  const country = userInfo.country || "";
  const address = userInfo.address || "";

  return (
    <div className="card h-100 shadow-sm">
      {/* Header - This will NEVER show "Hi, undefined" */}
      <div
        className="card-header py-3"
        style={{
          backgroundColor: "#6050DC",
          color: "white",
          borderBottom: "none",
        }}
      >
        <div className="d-flex align-items-center">
          <div className="me-3">
            <img
              src={pic}
              alt="Profile"
              className="rounded-circle border border-3 border-white"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
              }}
            />
          </div>
          <div>
            <h4 className="mb-1">Hi, {displayName}</h4>
            <p className="mb-0" style={{ opacity: 0.9 }}>
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <h5 className="mb-4" style={{ color: "#6050DC" }}>
          <i className="bi bi-person-badge me-2"></i>
          Account Details
        </h5>

        {/* Simple table layout */}
        <div className="table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td style={{ width: "30%" }} className="text-muted">
                  Full Name:
                </td>
                <td className="fw-medium">{displayName}</td>
              </tr>
              <tr>
                <td className="text-muted">Username:</td>
                <td className="fw-medium">{username}</td>
              </tr>
              <tr>
                <td className="text-muted">Email:</td>
                <td className="fw-medium text-break">{email}</td>
              </tr>
              <tr>
                <td className="text-muted">Phone:</td>
                <td className="fw-medium">{phone}</td>
              </tr>
              <tr>
                <td className="text-muted">City:</td>
                <td className="fw-medium">{city}</td>
              </tr>
              <tr>
                <td className="text-muted">State:</td>
                <td className="fw-medium">{state}</td>
              </tr>
              <tr>
                <td className="text-muted">Country:</td>
                <td className="fw-medium">{country}</td>
              </tr>
              {address && (
                <tr>
                  <td className="text-muted">Address:</td>
                  <td className="fw-medium small">{address}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer bg-transparent border-top-0 pt-0">
        <button
          className="btn w-100"
          style={{
            backgroundColor: "#6050DC",
            color: "white",
            fontWeight: "500",
          }}
        >
          <i className="bi bi-pencil-square me-2"></i>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
