import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css'; // Make sure to create this CSS file

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="landing-title">Welcome to Study With Me</h1>
        <p className="landing-subtitle">
          Your go-to place for focused study sessions and productivity tools.
        </p>
        <div className="button-container">
          <Link to="/login">
            <button className="cta-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="cta-button">Get Started</button>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
