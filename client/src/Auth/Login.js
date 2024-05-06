import React, { useEffect, useState } from 'react';
import './Login.css';
import logingif from "../assets/login.gif";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToReset = () => {
    navigate('/resetpass');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Set loading state to true
      const response = await axios.post("https://webpay-vn68.onrender.com/userlogin", { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast('Login Succesful');
        navigate('/home');
      } else {
        toast('Invalid Credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="login-container">
      <div className="loginform">
        <div className="loginimage">
          <img src={logingif} alt="" />
        </div>
        <div className="form">
          <form className="_details" onSubmit={handleSubmit}>
            <h1 style={{ marginBottom: "20px" }}>Login</h1>
            <div className="textbox">
              <input onChange={handleEmailChange} type="email" required />
              <span className="input_detail">Email</span>
            </div>
            <div className="textbox">
              <input onChange={handlePasswordChange} type="password" required />
              <span className="input_detail">Password</span>
            </div>
            <button type='submit' className='btn' disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Login'}
            </button>
            <div className="signcontent">
              <p>Not a User? <span className='regis' onClick={navigateToRegister}>Register here</span></p>
              <p>Forgot Your Password? <span className='regis' onClick={navigateToReset}>Reset here</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
