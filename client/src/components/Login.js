import React, { useState } from 'react';
import axios from 'axios';

// Definiera API-URL:en som en konstant
const API_URL = 'https://jsramverk-v2x-ane2cxfnc8dddcgf.swedencentral-01.azurewebsites.net';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {  // Använd API_URL här
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);  // Spara userId
      setIsAuthenticated(true);
      window.location.href = '/';
    } catch (err) {
      setError('Inloggning misslyckades. Kontrollera användarnamn och lösenord.');
      console.error('Fel vid inloggning:', err);
    }
  };

  return (
    <div>
      <h2>Login form</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
