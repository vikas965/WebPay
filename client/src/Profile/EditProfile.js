import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const EditProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        bankname: '',
        upipin: ''
    });
    const [upiPinError, setUpiPinError] = useState('');
    const navigate = useNavigate();
    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/user', {
                headers: {
                    Authorization: `${token}`,
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // useEffect to fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear previous error message if user starts typing
        if (name === 'upipin') {
            setUpiPinError('');
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate UPI PIN (should be exactly 6 digits)
        if (userData.upipin.length !== 6 || isNaN(userData.upipin)) {
            setUpiPinError('UPI PIN must be exactly 6 digits.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:3001/user/updatebank', userData, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (response.status === 200) {
                toast('Profile updated successfully');
            }
        } catch (error) {
            toast('Error While Updating Data');
            console.error('Error updating profile:', error);
        }
    };

    const navigatereset =()=>{
        navigate('/resetpass')
    }
    
    const { name, email, bankname, upipin } = userData;

    return (
        <div className='editbody'>
            <h1 style={{marginLeft:"20%"}}>EDIT <span>PROFILE</span></h1>
            <div className="editform">
                <form onSubmit={handleSubmit}>
                    <div className="dualinputs">
                        <input
                            type="text"
                            name="name"
                            placeholder='USER NAME'
                            value={name}
                            onChange={handleInputChange}
                            style={{ textTransform: "uppercase" }}
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder='EMAIL'
                            value={email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="dualinputs">
                        <input
                            type="text"
                            name="bankname"
                            placeholder='BANK NAME'
                            value={bankname}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="upipin"
                            placeholder='UPI PIN'
                            value={upipin}
                            onChange={handleInputChange}
                        />
                        
                    </div>
                   <center> {upiPinError && <span className="error" style={{margin:"10px"}}>{upiPinError}</span>}</center>
                    <div className="dualinputs">
                        <button className='btn-bounce' type="submit">UPDATE</button>
                    </div>
                    <div >
                        <center><p style={{fontSize:"16px",cursor:"pointer"}} onClick={navigatereset}>Forgot Your Password ? Reset here</p></center>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
