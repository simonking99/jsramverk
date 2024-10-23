import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/register', { username, password });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Registrering misslyckades:', error);
            setMessage(error.response?.data?.message || 'Något gick fel.');
        }
    };

    return (
        <div>
            <h2>Registrera dig</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Användarnamn:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Lösenord:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrera</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;