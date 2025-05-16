import React, { useState, useEffect } from "react";
import Navbartwo from "../../Common/Navbartwo";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import ProfilePageConfirmationModal from "./ProfilePageConfirmationModal";
import Footer from "../../Common/Footer";
import eye_icon from '../../../assets/open-eye.png';
import eye_closed from '../../../assets/closed-eye.png';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    _id: "",
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
  const [showModal, setShowModal] = useState(false); //bt3t el update 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [valuesToConfirm, setValuesToConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Authentication required.');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5001/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          navigate('/login');
          return;
        }

        const data = await response.json();
        console.log('Fetched user data:', data);
        if (data.user && data.user._id) {
          setProfile(data.user);
        } else {
          setError('Invalid user data received');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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

  const validatePassword = (password) => {
    if (!password) return true; 
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    
    if (formData.password && !validatePassword(formData.password)) {
      setShowPasswordModal(true);
      return;
    }

    setValuesToConfirm(formData);
    setShowModal(true);
  };

  const handleConfirmUpdate = async () => {
    setShowModal(false);
    setMessage("");
    setError("");

    try {
      if (!profile._id) {
        throw new Error('User ID is missing');
      }

      const updateData = {};
      if (valuesToConfirm.name) updateData.name = valuesToConfirm.name;
      if (valuesToConfirm.phoneNumber) updateData.phoneNumber = valuesToConfirm.phoneNumber;
      if (valuesToConfirm.password) updateData.password = valuesToConfirm.password;

      console.log('Updating user with ID:', profile._id);
      console.log('Update data:', updateData);

      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:5001/api/users/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.status === 401) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      console.log('Update response:', data);
      setProfile(data.user);
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
      if (!profile._id) {
        throw new Error('User ID is missing');
      }

      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:5001/api/users/${profile._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete profile');
      }

      localStorage.removeItem('jwtToken');
      setMessage("Profile deleted successfully!");
      setTimeout(() => {
        navigate('/'); //yroh 3ala home page bara
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
            <div className="input-container password-container">
              <label className="field-label">New Password:</label>
              <input
                className="form-control"
                name="password"
                placeholder="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ""}
                onChange={handleChange}
              />
              <img
                src={showPassword ? eye_icon : eye_closed}
                alt="Toggle Password Visibility"
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
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
              className="delete-button"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Password Validation Modal */}
      <ProfilePageConfirmationModal
        isOpen={showPasswordModal}
        title="Invalid Password"
        message="Password must meet the following requirements:
        - At least 6 characters long
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one number"
        onConfirm={() => setShowPasswordModal(false)}
        onCancel={() => setShowPasswordModal(false)}
        confirmText="OK"
      />

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
