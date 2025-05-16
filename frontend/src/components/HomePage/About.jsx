
import React from 'react';
import './About.css'; 

const About = () => {
  return (
    <div id="about" className="about">
      <div className="app-about">
        <h2>About Ramora</h2>
        <p>
          Ramora is a digital wallet that allows you to manage your finances with ease.
          With our app, you can send and receive money, and track your spending all in one place.
        </p>
        <p>
          Our mission is to provide a secure and user-friendly platform for managing your money.
          We believe that everyone should have access to the tools they need to take control of their finances.
        </p>
      </div>

      <div className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-card">
          <div>
            <h3 className="team-mem">Roa Alaa</h3>
            <p>"Project Manager"</p>
          </div>
          <div>
            <h3 className="team-mem">Amira Ashraf</h3>
            <p>"Product Manager"</p>
          </div>
          <div>
            <h3 className="team-mem">Roaa Rozik</h3>
            <p>"Front-end Engineer"</p>
          </div>
          <div>
            <h3 className="team-mem">Mohmed Ali</h3>
            <p>"Back-end Engineer"</p>
          </div>
          <div>
            <h3 className="team-mem">Ali Ezzat</h3>
            <p>"AI Engineer"</p>
          </div>
          <div>
            <h3 className="team-mem">Omar Yasser</h3>
            <p>"Software Engineer"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
