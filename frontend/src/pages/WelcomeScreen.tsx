import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const WelcomeScreen: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1>Anime Tracker</h1>
        <p>Sek savo mėgstamus anime ir manga!</p>

        {/* Mygtukai su aktyvumo klasėmis */}
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

        {/* Formos rodymas pagal pasirinkimą */}
        {showLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default WelcomeScreen;
