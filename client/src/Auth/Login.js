import React from 'react'
import "./Login.css"
import logingif from "../assets/login.gif"
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const navigateto = () => {
    navigate('/register')
  }
  const navigatetoreset = () => {
    navigate('/resetpass')
  }

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setpassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/userlogin", { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        toast('Login Succesful')
        navigate('/home')
      }
      else {
        toast('Invalid Crdentials')
      }
    }
    catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <div className="login-container">
      {/* <div className='marquee' style={{position:"fixed"}} behavior="" direction="right">   <img  src={birdfly} alt="" /></div> */}
      <div className="loginform">
        <div className="loginimage">

          <img src={logingif} alt="" />
        </div>
        <div className="form">
          <form className="_details" onSubmit={handleSubmit}>
            <h1 style={{ marginBottom: "20px" }}>Login</h1>
            <div className="textbox">
              <input onChange={handleEmailChange} type="email" />
              <span className="input_detail">Email</span>
            </div>
            <div class="textbox">
              <input onChange={handlePasswordChange} type="password" />
              <span className="input_detail">Password</span>
            </div>
            <button type='submit' className='btn'>Login</button>
            <div className="signcontent">
              <p>Not a User ? <span className='regis' onClick={navigateto}>Register here</span></p>
            <p>Forgot Your Password  ? <span className='regis' onClick={navigatetoreset}>Reset here</span></p>
            </div>
          </form>
        </div>
      </div>


    </div>
  )
}

export default Login
