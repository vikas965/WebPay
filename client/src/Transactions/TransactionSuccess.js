import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const TransactionSuccess = () => {
    const [transaction, setTransaction] = useState(null);
    const [sender, setSender] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const {transId} = useParams();
    // console.log(transId);   
    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/trans/${transId}`,{
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const transactionData = response.data;
                setTransaction(transactionData);
// console.log(transactionData);
                // Fetch sender details
                const senderResponse = await axios.get(`http://localhost:3001/users/${transactionData.sender}`,{
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setSender(senderResponse.data);

                // Fetch receiver details
                const receiverResponse = await axios.get(`http://localhost:3001/users/${transactionData.receiver}`,{
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setReceiver(receiverResponse.data);
            } catch (error) {
                console.error('Error fetching transaction data:', error.message);
            }
        };

        fetchTransactionData();
    }, [transId]);

    if (!transaction || !sender || !receiver) {
        return <p>Loading...</p>;
    }
//   console.log(sender);
  console.log(receiver)
    return (
        <div>
            <h2>Transaction Details</h2>
            <p>Transaction ID: {transaction._id}</p>
            <p>Amount: {transaction.amount}</p>

            <h3>Sender</h3>
            <p>Name: {sender.name}</p>
            <p>Mobile Number: {sender.mobilenumber}</p>
            <p>Bank Name: {sender.bankname}</p>

            <h3>Receiver</h3>
            <p>Name: {receiver.name}</p>
            <p>Mobile Number: {receiver.mobilenumber}</p>
            <p>Bank Name: {receiver.bankname}</p>
        </div>
    );
};

export default TransactionSuccess;
