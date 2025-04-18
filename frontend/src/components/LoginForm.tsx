import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { token, user } = data;
  
        localStorage.setItem("authToken", token);
  
        login(user);
  
        console.log("Prisijungta sėkmingai");
  
        navigate('/');
      } else {
        console.error("Prisijungimo klaida:", data.message);
      }
    } catch (error) {
      console.error("Prisijungimo klaida:", error);
    }
  };

  const handleAniListLogin = () => {
    console.log("Log in with AniList...");
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        className="form-control my-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-success w-100">Log in</button>
      
      <button 
        type="button"
        className="btn btn-outline-secondary w-100 mt-3"
        onClick={handleAniListLogin}
      >
        Log in using AniList
      </button>
    </form>
  );
};

export default LoginForm;
