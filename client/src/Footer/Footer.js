import React from 'react';
import './Footer.css';
import { NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Access current location
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Logout successful!');
    navigate('/login');
  };

  // Function to determine if a given path matches the current location
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className='footer-container'>
      <NavLink to="/home"><i className={`fa-solid fa-house-chimney ${isActive('/home') ? 'footer-containerhover' : ''}`}></i></NavLink>
      <NavLink to="/pay"><i className={`fa-solid fa-people-group ${isActive('/pay') ? 'footer-containerhover' : ''}`}></i></NavLink>
      <NavLink to="/transactions"><i className={`fa-solid fa-wallet ${isActive('/transactions') ? 'footer-containerhover' : ''}`}></i></NavLink>
      <NavLink to="/profile"><i className={`fa-solid fa-user ${isActive('/profile') ? 'footer-containerhover' : ''}`}></i></NavLink>
      <i onClick={handleLogout} className="fa-solid fa-arrow-right-from-bracket"></i>
    </div>
  );
};

export default Footer;
