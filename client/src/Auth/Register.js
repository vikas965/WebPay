import React, { useState } from 'react';
import './register.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpass, setConfirmPass] = useState('');
  const navigate = useNavigate();
  const navigateto = () => {
    navigate('/login')
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side validation for required fields
    if (!name || !email || !number || !password || !confirmpass) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmpass) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', {
        name,
        email,
        mobilenumber: number,
        password,
        bankname: '', // Add these as needed
        upipin: '', // Add these as needed
      });

      console.log(response.data);
      toast.success('Registration successful!');
      navigateto();
     
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className='register-container'>
      <div className="register-form">
        <center><h1>REGISTER</h1></center>
        <form onSubmit={handleRegister}>
          <div className="resgisterinputs">
            <input
              type="text"
              placeholder='USERNAME'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder='EMAIL'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="resgisterinputs">
            <input
              type="number"
              placeholder='MOBILE NUMBER'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              type="password"
              placeholder='PASSWORD'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="resgisterinputs">
            <input
              type="password"
              placeholder='CONFIRM YOUR PASSWORD'
              value={confirmpass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button type="submit">REGISTER</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
