import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import './Profile.css'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profile from '../assets/profile.png';
function UserProfile() {
  const [userData, setUserData] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  // const [imageUrl, setImageUrl] = useState('');
  // const [error, setError] = useState('');
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const navigateto = () => {
    navigate('/checkbalance')
  }
  const navigatetoeditprofile = () => {
    navigate('/editprofile')
  }

  const gototrans = ()=>{
    navigate('/transactions')
  }
  const gotoaddmoney = ()=>{
    navigate('/pay')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:3001/user/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
      if(response.status===200){
        fetchUserData(); // Call fetchUserData to refresh userData with updated image path

      // Show toast notification
      // toast.success('Image Updated Successfully');

      // Optionally, you can clear the selected file after upload
      setFile(null);
        toast('Image Updated Succesfully');

      }
      // console.log(response.data.imageUrl);

      
    } catch (error) {
      console.error('Error uploading image:', error);
      // setError('Failed to upload image');
    }
  };
  const handleCustomButtonClick = () => {
    // Programmatically trigger click event on the hidden file input
    document.getElementById('fileInput').click();
  };
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/user', {
        headers: {
          Authorization: `${token}`,
        }
      }); // assuming you have an endpoint to fetch user data
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Fetch user data from the backend
    

    fetchUserData();
  }, []);
  console.log(userData);
  const firstName = userData.name ? userData.name.split(' ')[0] : '';
  return (
    <div className='profile-container'>
      <Navbar />
      <div className="profile-sections">
        <div className="profile1">
          <div className="user-profile">
          {userData.imagepath?<img src={`http://localhost:3001/${userData.imagepath}`} alt="Profile" style={{ width: '200px', height: '200px' }} />:<img  style={{ width: '200px', height: '200px' }}src={profile} alt="" /> }  
         
          <p>{firstName} </p>
          <i onClick={handleCustomButtonClick}  class="fa-solid fa-camera"></i>
          <input
        id="fileInput"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
          </div>

        </div>
        <div className="profile2">
        {/* <ImageUpload /> */}
        <div className="buttons">
          <button className='btn-bounce' onClick={handleSubmit}>Update Profile</button>
          <button onClick={ navigatetoeditprofile} className='btn-bounce'>Edit Profile</button>
          <button onClick={gotoaddmoney} className='btn-bounce'>Payment</button>
          <button onClick={gototrans} className='btn-bounce'>Transactions</button>
          <button className='btn-bounce' onClick={navigateto}>Check Balance</button>
        </div>
        </div>
      </div>


      <div className='data' style={{ display: 'none' }}>
        <ImageUpload />
        <h1>User Profile</h1>
        <div>
          <img src={`http://localhost:3001/${userData.imagepath}`} alt="Profile" style={{ width: '200px', height: '200px' }} />
          
        </div>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Mobile Number: {userData.mobilenumber}</p>
        <p>Bank Name: {userData.bankname}</p>
        <p>UPI PIN: {userData.upipin}</p>
        <p>Account Balance: {userData.accountbalance}</p>
      </div>

    </div>
  );
}

export default UserProfile;
