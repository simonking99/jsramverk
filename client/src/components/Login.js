// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      window.location.href = '/';
    } catch (err) {
      setError('Inloggning misslyckades. Kontrollera användarnamn och lösenord.');
      console.error('Fel vid inloggning:', err);
    }
  };

  return (
    <div>
      <h2>Logga in</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Användarnamn:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Lösenord:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
};

export default Login;
