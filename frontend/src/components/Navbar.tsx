import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const userImage = 'https://i.pravatar.cc/40';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");  // Pašalinti prisijungimo informaciją
    navigate("/welcome");  // Peradresuoti į pagrindinį puslapį
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <NavLink className="navbar-brand" to="/">AnimeTracker</NavLink>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink to="/" className="nav-link" end>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/my-list" className="nav-link">My List</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/browse" className="nav-link">Browse</NavLink>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item d-flex align-items-center me-2">
            <NavLink to="/account" className="nav-link d-flex align-items-center">
              <img 
                src={userImage} 
                alt="User" 
                className="rounded-circle me-2"
                width="32" 
                height="32"
              />
              Account
            </NavLink>
          </li>
          <li className="nav-item d-flex align-items-center">
            <button className="nav-link btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
