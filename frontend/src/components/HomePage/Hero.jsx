import React from 'react';
import './Hero.css'; // Optional: Add a CSS file for styling

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Welcome to Ramora</h1>
                <p>Your Wallet, Your Way!</p>
                <h6>Join Us NOW!</h6>
                <div className="buttons">
                    <button className="btn">Login</button>
                    <button className="btn">Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;