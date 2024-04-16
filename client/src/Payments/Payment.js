import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import profile from '../assets/profile.png';
import './payusers.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
const Payment = () => {
    const { userId } = useParams(); // Get userId from URL parameter
    const [userData, setUserData] = useState(null);
    const [ourData, setourData] = useState(null);
    const [amount, setamount] = useState(0);
    const [sufficent, setsufficient] = useState(false);
    const [inputs, setInputs] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);
    const otp = inputs.join('');

    const navigate = useNavigate();
    const navigateto = () => {
        navigate('/transactions')
    }
    const EnterAmount = (e) => {
        const val = e.target.value;
        if (val > 10000) {
            toast('₹10000 IS MAX AMOUNT TO BE SENT ')
            setamount(0)
        }
        else {
            setamount(val)
        }
    }
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

    const setBack = () => {
        setsufficient(false)
    }
    const CheckandProceed = () => {
        // toast.success('SUFFICIENT BALANCE');
        const balance = ourData.accountbalance
        if (amount > balance) {
            toast.error('INSUFFICIENT BALANCE')

        }
        else {
            setsufficient(true)
        }
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://webpay-vn68.onrender.com/user/${userId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (userId) {
            fetchUserDetails(); // Fetch user details if userId is available
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://webpay-vn68.onrender.com/user', {
                headers: {
                    Authorization: `${token}`,
                }
            }); // assuming you have an endpoint to fetch user data
            setourData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {

        fetchUserData();
    }, []);
    // console.log(ourData);

    const ProceedPayment = async () => {
        if (otp === ourData.upipin) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    'https://webpay-vn68.onrender.com/user/sendmoney',
                    {
                        receiver: userData._id,
                        amount: amount,
                    },
                    {
                        headers: {
                            Authorization: `${token}`,

                        },
                    }
                );
                if (response.status === 200) {
                    toast.success('Payment successful');
                    navigateto();
                }
                // console.log(response.data);
            }
            catch (error) {
                toast.error('Error processing payment');
                console.error('Error:', error);
            }
        }
        else {
            toast.error('INCORRECT UPIPIN')
        }
    }
    return (
        <div className='payment-container'>
            {

                !sufficent ?
                    <div className="section1">
                        {userData ? (

                            <>
                                <header>

                                    {userData.imagepath ? (
                                        <img src={`https://webpay-vn68.onrender.com/${userData.imagepath}`} alt="Profile" />
                                    ) : (
                                        <img src={profile} alt="" />
                                    )}
                                    <div>
                                        <h3> {userData.name}</h3>
                                        <p> {userData.mobilenumber}</p>
                                    </div>
                                </header>
                                <div className="paydetails">
                                    <div>
                                        <h3>FROM :{ourData && ourData.bankname} </h3>

                                        <h3> TO  : {userData.bankname}</h3>
                                    </div>
                                    <div className='amountsec'>

                                        <h2>₹{amount}</h2>

                                        <input onChange={EnterAmount} value={amount} type="number" placeholder='ENTER AMOUNT' />
                                        <button onClick={() => CheckandProceed()}>SEND</button>
                                    </div>

                                </div>

                            </>

                        ) : (
                            <p>Loading user details...</p>
                        )}

                    </div> :
                    <div className="section2">
                        {userData ? (

                            <>
                                <header>
                                    <i style={{ fontSize: "20px", cursor: "pointer" }} onClick={setBack} class="fa-solid fa-arrow-left"></i>
                                    {userData.imagepath ? (
                                        <img src={`https://webpay-vn68.onrender.com/${userData.imagepath}`} alt="Profile" />
                                    ) : (
                                        <img src={profile} alt="" />
                                    )}
                                    <div>
                                        <h3> {userData.name}</h3>
                                        <p> {userData.mobilenumber}</p>
                                    </div>
                                </header>
                                <div className="paydetailssec">


                                    <div className='amountpaydetails'>
                                        <center>
                                            <h3>Amount : ₹{amount} </h3>
                                            <p>Sending To : {userData.bankname} </p>
                                        </center>
                                    </div>

                                    <div className="upipin">
                                        <center><h2
                                        >ENTER YOUR UPI PIN</h2></center>
                                        <div className="inputs">
                                            {inputs.map((value, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => inputRefs.current[index] = el}
                                                    type="text"
                                                    value={value}
                                                    className="inputotp"
                                                    maxLength={1}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                />
                                            ))}
                                        </div>
                                        <center><button onClick={ProceedPayment} >PAY</button></center>
                                    </div>


                                </div>

                            </>

                        ) : (
                            <p>Loading user details...</p>
                        )}

                    </div>

            }




        </div>
    );
};

export default Payment;
