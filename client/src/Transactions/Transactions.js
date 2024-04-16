import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Trans.css';
import transgif from '../assets/transactions.gif';
import profile from '../assets/profile.png';
// import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Navlogo from '../assets/navlogo.png'
import Payback from '../assets/payback.png'
const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch logged-in user data to get the user's _id (assuming it's in MongoDB ObjectId format)
                const userResponse = await axios.get('https://webpay-vn68.onrender.com/user', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const loggedInUser = userResponse.data;
                setLoggedInUserId(loggedInUser._id); // Set the logged-in user's _id

                // Fetch transactions
                const transactionsResponse = await axios.get('https://webpay-vn68.onrender.com/transactions', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                // console.log(transactionsResponse);
                const fetchedTransactions = transactionsResponse.data;
                setTransactions(fetchedTransactions);

                // Extract unique user IDs from transactions
                const userIds = [
                    ...new Set(fetchedTransactions.map(transaction => transaction.sender)),
                    ...new Set(fetchedTransactions.map(transaction => transaction.receiver))
                ];

                // Fetch user details based on user IDs
                const userPromises = userIds.map(userId => axios.get(`https://webpay-vn68.onrender.com/users/${userId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                }));
                const usersData = await Promise.all(userPromises);

                // Organize user data into an object for quick lookup
                const usersMap = {};
                usersData.forEach(userData => {
                    usersMap[userData.data._id] = userData.data;
                });
                setUsers(usersMap);

                setLoading(false);
            } catch (error) {
                toast.error('Error fetching transactions');
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    const handleDownloadReceipt = async (transaction) => {
        try {
            const receiptContainer = document.createElement('div');
            receiptContainer.style.fontFamily = 'Arial, sans-serif';
            receiptContainer.style.padding = '25px';
            receiptContainer.style.background = `url(${Payback})`;
            receiptContainer.style.border = '1px solid #ccc';
            receiptContainer.style.borderRadius = '8px';
            // Render the transaction details as HTML in the container
            receiptContainer.innerHTML = `
                  <center><h1>Transaction Receipt</h1></center>
                <div  style="text-align: center; font-size: 25px; height:800px;">

                <header style="display:flex; width:100%; padding:20px; align-items: center;
                justify-content: space-between;"> 
               
                <img width="150px" height="150px" src='${Navlogo}' alt="" />
                
                <h2>WEBPAY</h2>
                </header>
                
                    
                    <br> <br>
<div style='display:flex; flex-direction: column;  border-radius:9px; height:400px; width:800px; padding:15px; margin-left:200px; margin-bottom:80px; row-gap:24px; '>
                    <p style='text-transform:uppercase;'><strong>Transaction ID:</strong> ${transaction._id}</p>

                    <p><strong>Date:</strong> ${formatDate(transaction.timestamp)}</p>
                    <p><strong>Amount:</strong> ₹${transaction.amount}</p>
                    <p>${transaction.sender === loggedInUserId ? `<strong>Paid to</strong> ${users[transaction.receiver]?.name}` : `Received from ${users[transaction.sender]?.name}`}</p>
                    <p>${transaction.sender === loggedInUserId ? `<strong>Debited from</strong> ${users[transaction.sender]?.bankname}` : `Credited to ${users[transaction.receiver]?.bankname}`}</p>
                    </div>
                </div>
            `;

            // Append the container to the document body
            document.body.appendChild(receiptContainer);

            // Use html2canvas to capture the rendered receipt content with improved quality
            const canvas = await html2canvas(receiptContainer, {
                scale: 2, // Increase scale for better resolution
                useCORS: true, // Enable cross-origin resource sharing (if required)
            });


            document.body.removeChild(receiptContainer);
            const imgData = canvas.toDataURL('image/png');

            // Downlaod as PNG
            //     const downloadLink = document.createElement('a');
            // downloadLink.href = imgData;
            // downloadLink.download = 'transaction_receipt.png';
            // downloadLink.click();



            // Download as Pdf
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const x = (pdf.internal.pageSize.width - imgWidth) / 2;
            const y = (pdf.internal.pageSize.height - imgHeight) / 2;
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save('transaction-receipt.pdf');
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    };
    const handleDownloadReceiptpng = async (transaction) => {
        try {
            const receiptContainer = document.createElement('div');
            receiptContainer.style.fontFamily = 'Arial, sans-serif';
            receiptContainer.style.padding = '25px';
            receiptContainer.style.background = `url(${Payback})`;
            receiptContainer.style.border = '1px solid #ccc';
            receiptContainer.style.borderRadius = '8px';
            // Render the transaction details as HTML in the container
            receiptContainer.innerHTML = `
                  <center><h1>Transaction Receipt</h1></center>
                <div  style="text-align: center; font-size: 25px; height:800px;">

                <header style="display:flex; width:100%; padding:20px; align-items: center;
                justify-content: space-between;"> 
               
                <img width="150px" height="150px" src='${Navlogo}' alt="" />
                
                <h2>WEBPAY</h2>
                </header>
                
                    
                    <br> <br>
<div style='display:flex; flex-direction: column;  border-radius:9px; height:400px; width:800px; padding:15px; margin-left:200px; margin-bottom:80px; row-gap:24px; '>
                    <p style='text-transform:uppercase;'><strong>Transaction ID:</strong> ${transaction._id}</p>

                    <p><strong>Date:</strong> ${formatDate(transaction.timestamp)}</p>
                    <p><strong>Amount:</strong> ₹${transaction.amount}</p>
                    <p>${transaction.sender === loggedInUserId ? `<strong>Paid to</strong> ${users[transaction.receiver]?.name}` : `Received from ${users[transaction.sender]?.name}`}</p>
                    <p>${transaction.sender === loggedInUserId ? `<strong>Debited from</strong> ${users[transaction.sender]?.bankname}` : `Credited to ${users[transaction.receiver]?.bankname}`}</p>
                    </div>
                </div>
            `;

            // Append the container to the document body
            document.body.appendChild(receiptContainer);

            // Use html2canvas to capture the rendered receipt content with improved quality
            const canvas = await html2canvas(receiptContainer, {
                scale: 2, // Increase scale for better resolution
                useCORS: true, // Enable cross-origin resource sharing (if required)
            });


            document.body.removeChild(receiptContainer);
            const imgData = canvas.toDataURL('image/png');

            // Downlaod as PNG
            const downloadLink = document.createElement('a');
            downloadLink.href = imgData;
            downloadLink.download = 'transaction_receipt.png';
            downloadLink.click();



            // Download as Pdf
            // const pdf = new jsPDF('p', 'mm', 'a4');
            // const imgWidth = 180; 
            // const imgHeight = (canvas.height * imgWidth) / canvas.width;
            // const x = (pdf.internal.pageSize.width - imgWidth) / 2;
            // const y = (pdf.internal.pageSize.height - imgHeight) / 2;    
            // pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            // pdf.save('transaction-receipt.pdf');
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    };

    // console.log(users);

    // Render transactions with user details and status
    return (
        <div className="transactions-container">
            <div className="trans-box">
                <div className="imagegif">
                    <img src={transgif} alt="" />
                </div>
                <div className="transdata">
                    <div className="transdatabox">
                        <center>
                            <h2>TRANSACTIONS</h2>
                        </center>
                        {loading ? (
                            <h3 style={{ textAlign: "center", marginTop: "50px" }}>Loading transactions...</h3>
                        ) : (
                            <div className="transactions">
                                {transactions.map((transaction) => (
                                    <div className="eachtransaction" key={transaction._id}>

                                        <div className="firstrow">
                                            {transaction.sender === loggedInUserId ?
                                                <div className='transprofileimage'>

                                                    {users[transaction.receiver]?.imagepath ? <img src={`https://webpay-vn68.onrender.com/${users[transaction.receiver]?.imagepath}`} alt="Profile" /> : <img src={profile} alt="" />}
                                                </div>


                                                : <div className='transprofileimage'>
                                                    {/* <h5>Credited to {users[transaction.receiver]?.bankname} </h5> */}
                                                    {users[transaction.sender]?.imagepath ? <img src={`https://webpay-vn68.onrender.com/${users[transaction.sender]?.imagepath}`} alt="Profile" /> : <img src={profile} alt="" />}

                                                </div>

                                            }

                                            <div style={{ display: "flex", columnGap: "25px", textTransform: "uppercase" }}>

                                                {transaction.sender === loggedInUserId ? <p className='text'>Paid to <span> {users[transaction.receiver]?.name}</span></p> : <p>Recieved from <span>{users[transaction.sender]?.name}</span></p>}
                                                <p>₹{transaction.amount}</p></div>
                                        </div>
                                        <div className="secondrow">
                                            <p> {formatDate(transaction.timestamp)}</p>
                                            <button >  <p onClick={() => handleDownloadReceiptpng(transaction)}> <i class="fa-solid fa-file-arrow-down"></i> PNG</p> &nbsp;&nbsp; <p onClick={() => handleDownloadReceipt(transaction)}><i class="fa-solid fa-download"></i> PDF</p></button>
                                            {transaction.sender === loggedInUserId ? <h5>Debited from {users[transaction.sender]?.bankname} </h5> : <h5>Credited to {users[transaction.receiver]?.bankname} </h5>}


                                        </div>
                                        {/* <div>Paid to <br /> </div> */}


                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="trans-data" style={{ display: 'none' }}></div>
        </div>
    );
};

export default Transactions;
