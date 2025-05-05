import React from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom'; 

const Hero = () => {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login'); 
    };
    const handleSignUpClick = () => {
        navigate('/signup'); 
      };
    
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Welcome to Ramora</h1>
                <p>Your Wallet, Your Way!</p>
                <h6>Join Us NOW!</h6>
                <div className="buttons">
                    <button className="btn" onClick={handleLoginClick}>Login</button>
                    <button className="btn" onClick={handleSignUpClick}>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;