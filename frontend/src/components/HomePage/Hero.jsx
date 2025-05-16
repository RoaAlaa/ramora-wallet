import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css'; 

const Hero = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Welcome to Ramora</h1>
                <p>Your Wallet, Your Way!</p>
                <h6>Join Us NOW!</h6>
                <div className="buttons">
                    <button className="btn" onClick={handleLogin}>Login</button>
                    <button className="btn" onClick={handleSignUp}>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;