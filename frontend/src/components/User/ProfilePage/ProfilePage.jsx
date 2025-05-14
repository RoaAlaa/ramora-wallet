import React, { useState, useEffect } from "react";
import Navbartwo from "../../Common/Navbartwo";
import "./ProfilePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePageConfirmationModal from "./ProfilePageConfirmationModal";
import Footer from "../../Common/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [valuesToConfirm, setValuesToConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Authentication required.');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwtToken');
            setError('Session expired. Please log in again.');
            navigate('/login');
          } else {
            const errorBody = await response.json();
            setError(`Error fetching profile: ${response.status} ${errorBody.message || response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setError('User ID not provided');
      setLoading(false);
    }
  }, [userId, navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(profile);
    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication required.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(valuesToConfirm),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else {
          const errorBody = await response.json();
          throw new Error(errorBody.message || 'Update failed');
        }
        return;
      }

      const data = await response.json();
      setProfile(data);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setValuesToConfirm(null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile.');
    }
  };

  const handleCancelUpdate = () => {
    setShowModal(false);
    setValuesToConfirm(null);
    setIsEditing(false);
  };

  const handleDeleteProfile = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication required.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else {
          const errorBody = await response.json();
          throw new Error(errorBody.message || 'Delete failed');
        }
        return;
      }

      localStorage.removeItem('jwtToken');
      setMessage("Profile deleted successfully!");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Profile deletion error:', err);
      setError(err.message || 'Failed to delete profile.');
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <Navbartwo/>
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
            <button className="delete-button" onClick={handleDeleteProfile}>
              Delete Profile
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
            <button
              className="cancel-button"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Update Confirmation Modal */}
      <ProfilePageConfirmationModal
        isOpen={showModal}
        title="Confirm Changes"
        message="Are you sure you want to update your profile?"
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
        confirmText="Save Changes"
      />

      {/* Delete Confirmation Modal */}
      <ProfilePageConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Profile"
        message="Are you sure you want to delete your profile?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        confirmButtonClass="delete-confirm-button"
      />
      <Footer/>
    </div>
  );
};

export default ProfilePage;
