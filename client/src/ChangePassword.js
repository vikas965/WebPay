import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Password.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const [inputs, setInputs] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);
    
    const [step, setStep] = useState(1); // Step 1: Initial, Step 2: OTP verification
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

   

    const navigate = useNavigate();

    const sendtohome = ()=>{
        navigate('/home')
}

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

    const handleResetRequest = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/sendotp/${email}`)
            if (response.status === 200) {
                toast.success('Reset email sent. Please check your inbox.');
                setStep(2); // Move to step 2 (OTP verification)
            }
        } catch (error) {
            console.error('Error sending reset email:', error);
            toast.error('Failed to send reset email. Please try again.');
        }
    };

    const handleVerifyOTP = async () => {
        const otp = inputs.join('');
        try {
            const response = await axios.post('http://localhost:3001/verifyotp', { email, otp, password: newPassword });
            if (response.status === 200) {
                toast.success('OTP verified. Password updated successfully.');
                // Clear inputs and navigate to another page after success
                setInputs(Array(6).fill(''));
                sendtohome()
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Invalid OTP. Please try again.');
        }
    };

    

    return (
        <div className="containerpass">
            <main className="main">
                {step === 1 ? (
                    <div className="contentpass">
                        <header className="header">
                            <h3 className="title">Reset Password</h3>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                id="resetmail"
                            />
                            <button
                                style={{ width: "90%", marginTop: "14px" }}
                                type="button"
                                className="buttonverify"
                                onClick={handleResetRequest}
                            >
                                Reset
                            </button>
                        </header>
                    </div>
                ) : (
                    <div className="contentpass">
                        <form>
                            <input
                                className='resetpass'
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='New Password'
                            />
                            <input
                                className='resetpass'
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm Password'
                            />
                            <br />
                            <p id="special" style={{marginTop:"12px"}}>Enter the OTP sent to your email:</p>
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
                            <div className="button-container">
                                <button
                                    type="button"
                                    className="buttonverify"
                                    onClick={handleVerifyOTP}
                                >
                                    Verify OTP
                                </button>
                                
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChangePassword;
