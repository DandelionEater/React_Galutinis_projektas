import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const WelcomeScreen: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1>Anime Tracker</h1>
        <p>Track your favorite anime and manga with ease!</p>

        <div className="btn-group my-3">
          <button
            className={`btn ${showLogin ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`btn ${!showLogin ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowLogin(false)}
          >
            Register
          </button>
        </div>

        {showLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default WelcomeScreen;
