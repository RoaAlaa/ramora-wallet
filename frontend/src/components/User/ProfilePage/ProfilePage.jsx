import React, { useState, useEffect } from "react";
import "./ProfilePage.css"; 

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "", 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    //  MOCK DATA FOR TESTING UI WITHOUT BACKEND
    const mockData = {
      name: "Amira Ashraf",
      username: "amira123",
      email: "amira@example.com",
      phoneNumber: "0123456789",
    };

    setProfile(mockData);

    //  REAL API CALL (commented for now)
    /*
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile", err));
    */
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(profile);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace with real update request
    console.log("Submitting updated data:", formData);
    setProfile((prev) => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-form">
        <h2 className="form-title">Profile</h2>

        {/* Welcome Message */}
        <div className="welcome-message">
          Welcome, {profile.name}!
        </div>

        {!isEditing ? (
          <>
            <div className="input-container">
              <label className="field-label">Name:</label>
              <span className="form-control">{profile.name}</span>
            </div>
            <div className="input-container">
              <label className="field-label">Username:</label>
              <span className="form-control">{profile.username}</span>
            </div>
            <div className="input-container">
              <label className="field-label">Email:</label>
              <span className="form-control">{profile.email}</span>
            </div>
            <div className="input-container">
              <label className="field-label">Phone Number:</label>
              <span className="form-control">{profile.phoneNumber}</span>
            </div>
            <button className="submit-button" onClick={handleEditClick}>
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label className="field-label">Name:</label>
              <input
                className="form-control"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <label className="field-label">Username:</label>
              <input
                className="form-control"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <label className="field-label">New Password:</label>
              <input
                className="form-control"
                name="password"
                placeholder="New Password"
                type="password"
                value={formData.password || ""}
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <label className="field-label">Phone Number:</label>
              <input
                className="form-control"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <button className="submit-button" type="submit">
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
