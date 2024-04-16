import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoggedIn = localStorage.getItem('token');


  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      console.log({ email, password });
      const response = await axios.post("https://mern-crud-ngi2.onrender.com/login", { email, password });

      console.log(response.data.token);


      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast("Login successful!");
        console.log('Login successful!');
        navigate('/'); // Redirect only after setting the token
        // Redirect or perform other actions after successful login
      } else {
        toast("Invalid Credentials");
        console.error('Login failed:', response.message);
        // Handle failed login, show an error message to the user
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='login-form'>
      <h1>Login</h1>
      <form className='loginform' onSubmit={handleSubmit}>
        <label>

          <input className='inp ' type="email" value={email} onChange={handleEmailChange} placeholder='Email' required />
        </label>
        <br />
        <label>

          <input className='inp ' type="password" value={password} onChange={handlePasswordChange} placeholder='Password' required />
        </label>
        <br />
        <button className='btn w-50 ' style={{ background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)" }} type="submit">Login</button>
        <div>Not a User ?  <Link style={{ textDecoration: "none", color: "white" }} to="/register">Register</Link></div>
      </form>
    </div>
  );
};

export default Login;
