import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Logout = () => {
  const handleLogout = () => {
    
    localStorage.removeItem('token');
    toast('Logout successful!');
    
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;