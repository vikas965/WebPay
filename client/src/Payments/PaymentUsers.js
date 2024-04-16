import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './payusers.css';
import Navbar from '../Navbar/Navbar';
import payusers from '../assets/payments.gif';
import profile from '../assets/profile.png';
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom'

const PaymentUsers = () => {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const navigatetopay = (userId) => {
    navigate(`/payment/${userId}`);
  }

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://webpay-vn68.onrender.com/users', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpen = (userId) => {
    // Find the selected user based on userId
    const user = userData.find(user => user._id === userId);
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null); // Clear selected user when closing the modal
  };

  const filteredUsers = userData.filter((user) => {
    const { name, mobilenumber } = user;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return (
      name.toLowerCase().includes(normalizedQuery) ||
      mobilenumber.includes(normalizedQuery)
    );
  });

  return (
    <div className='Containerusers'>
      <Navbar />
      <Modal isOpen={!!selectedUser} onClose={handleClose}>
        {selectedUser && (
          <>
            <img style={{ width: "125px", height: "125px", borderRadius: "100%", filter: "drop-shadow(2.5px 2.5px 5px #0ebeff)" }} src={selectedUser.imagepath ? `https://webpay-vn68.onrender.com/${selectedUser.imagepath}` : profile} alt="Profile" />
            <br />
            <h1 style={{ textTransform: "uppercase" }}>{selectedUser.name}</h1>
            <p>{selectedUser.mobilenumber}</p>

          </>
        )}
      </Modal>
      <div className="PaymentSection">
        <div className="payimage">
          <h1>Make a <br /> Payment</h1>
          <img src={payusers} alt="" />
        </div>
        <div className="payusers">
          <div className="usersbox">
            <div className="headbar">
              <input
                type="search"
                placeholder='Search by name or number ...'
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <h3>Fetch Users</h3>
            </div>
            <div className="usersdata">
              {filteredUsers.map((user) => (
                <div className="eachuser" key={user._id}>
                  {user.imagepath ? (
                    <img src={`https://webpay-vn68.onrender.com/${user.imagepath}`} alt="Profile" />
                  ) : (
                    <img src={profile} alt="" />
                  )}
                  <div className="details">
                    <h1>{user.name}</h1>
                    <p>{user.mobilenumber}</p>
                  </div>
                  <div className="profileicons">
                    <i className="fa-regular fa-eye" onClick={() => handleOpen(user._id)}></i>
                    <i className="fa-regular fa-paper-plane" onClick={() => navigatetopay(user._id)}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUsers;
