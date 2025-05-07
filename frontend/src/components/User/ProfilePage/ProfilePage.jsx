import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const navigate = useNavigate(); 

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  }); //profile shayla el hagat el hategy mel backend mel db
  //set profile hatsheel el data el gedida lw 3amlt update 

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); //Temporarily stores what the user types in the form.
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [valuesToConfirm, setValuesToConfirm] = useState(null);

  useEffect(() => {
    setMessage('');
    setError('');

    // MOCK DATA
    const mockData = {
      name: "Amira Ashraf",
      username: "amira123",
      email: "amira@example.com",
      phoneNumber: "0123456789",
    };
    setProfile(mockData);

    // TODO: Replace mockData with real API call once backend is ready
    /*
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile data.");
      });
    */
  }, []);

  //when users press edit profile
  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(profile);
    setMessage("");
    setError("");
  };

  //e event 
  const handleChange = (e) => {
    setFormData((prev) => ({ 
      ...prev, //prev keeps everything just changes what is changed 
      [e.target.name]: e.target.value, //e.target.name is the name attribute of the input (like "email" or "username").// e.target.value is what you typed into the input.
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setValuesToConfirm(formData);
    setShowModal(true);
  };

  const handleConfirmUpdate = async () => {
    setShowModal(false);
    setMessage("");
    setError("");

    try {
      // Simulate waiting time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual update API call
      /*
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(valuesToConfirm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      */

      // Simulated success response
      setProfile((prev) => ({ ...prev, ...valuesToConfirm }));
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setValuesToConfirm(null);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile.");
    }
  };

  const handleCancelUpdate = () => {
    setShowModal(false);
    setValuesToConfirm(null);
    setIsEditing(false); 
    navigate("/profile");
  };

  return (
    <div className="profile-page">
      <div className="profile-form">
        <h2 className="form-title">Profile</h2>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <div className="welcome-message">Welcome, {profile.name}!</div>

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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Confirm Profile Update</h3>
            <p>Are you sure you want to update your profile information?</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelUpdate}>
                No
              </button>
              <button className="confirm-button" onClick={handleConfirmUpdate}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
