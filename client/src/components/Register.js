import React, { useState } from 'react';
import axios from 'axios';

// Definiera API-URL:en som en konstant
const API_URL = 'https://jsramverk-v2x-ane2cxfnc8dddcgf.swedencentral-01.azurewebsites.net';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/register`, {  // Använd API_URL här
                username,
                password
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Registrering misslyckades:', error);
            setMessage(error.response?.data?.message || 'Något gick fel.');
        }
    };

    return (
        <div>
            <h2>Register form</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <br />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
