import React from 'react'
import './Navbar.css'
import Navlogo from '../assets/navlogo.png'
// import menu from '../assets/menu.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('token');
    toast('Logout successful!');
    navigate('/login');

  };

  const gotoProfile = () =>{
    navigate('/profile');
  }
  const gotoPay = () =>{
    navigate('/pay');
  }
  const gotoHome= () =>{
    navigate('/home');
  }
  const gotoTrans= () =>{
    navigate('/transactions');
  }
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className='nav-container'>
      <div className="nav-wrapper">
        <div className="image">
          <img src={Navlogo} alt="" />
        </div>

        <div className="navlinkscon">
          <ul className='navlinks'>
            <li onClick={gotoHome}><span>Home</span></li>
            <li onClick={gotoPay}><span>Payments</span></li>
            <li onClick={gotoTrans}><span>Transactions</span></li>
            <li onClick={gotoProfile}><span>Profile</span></li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>


      </div>

    </div>
  )
}

export default Navbar
