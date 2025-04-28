import React, { useState } from 'react';

const SendMoneyPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleSendMoney = (e) => {
        e.preventDefault();
        // Add logic to handle sending money
        console.log(`Sending ${amount} to phone number ${phoneNumber} with message: ${message}`);
    };

    return (
        <div>
            <h1>Send Money</h1>
            <form onSubmit={handleSendMoney}>
                <div>
                    <label htmlFor="phoneNumber">Recipient's Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message">Message (optional):</label>
                    <input
                        type="text"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit">Send Money</button>
            </form>
        </div>
    );
};

export default SendMoneyPage;