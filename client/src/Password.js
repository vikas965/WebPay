import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Password.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import paygif from './assets/pay.gif'
const Password = () => {
    const [inputs, setInputs] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);
    const [userData, setUserData] = useState({
        bankname: '',
        accountbalance: 0,
        upipin: ''
    });
    const [verified, setVerified] = useState(false);

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

    useEffect(() => {
        fetchUserData();
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleKeyDown = (e, index) => {
        if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }

        if ((e.key === 'Delete' || e.key === 'Backspace') && index > 0 && inputs[index] === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);

        if (value && index < inputs.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerifyPin = () => {
        // Combine the input values into a 6-digit UPI PIN string
        const upiPin = inputs.join('');

        // Check if entered PIN matches the user's UPI PIN
        if (upiPin.length === 6 && upiPin === userData.upipin) {
            setVerified(true);
            // toast('UPI PIN verified successfully');
        } else {
            setVerified(false);
            toast('Invalid UPI PIN. Please try again.');
        }
    };

    const { bankname, accountbalance } = userData;

    return (
        <div className="containerpass">
            <main className="main">
                {!verified ? (
                    <div className="contentpass">
                        <header className="header">
                            <h1 className="title">Check Bank Balance</h1>
                            <p className="subtitle">Enter the 6-digit UPI PIN.</p>
                        </header>
                        <form>
                            <div className="inputs">
                                {inputs.map((value, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        value={value}
                                        className="input"
                                        maxLength={1}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onChange={(e) => handleInputChange(e, index)}
                                    />
                                ))}
                            </div>
                            <div className="button-container">
                                <button type="button" className="buttonverify" onClick={handleVerifyPin}>
                                    Verify PIN
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="contentpass">
                        <center>
                            <img src={paygif} alt="" />

                            <h1>BALANCE : ₹{accountbalance}</h1>
                            <p>{bankname}</p>
                            <button style={{marginTop:"10px"}} onClick={() => navigate('/home')}>Go Back</button>
                        </center>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Password;
