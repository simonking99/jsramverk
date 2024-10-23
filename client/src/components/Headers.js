import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // För navigering
import axios from 'axios';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Fel vid utloggning:', error);
      alert('Ett fel inträffade vid utloggning. Försök igen.');
    }
  };

  return (
    <header className="App-header">
      <h1>Document Management</h1>
      <nav>
        {/* Visa olika knappar beroende på om användaren är inloggad */}
        {isAuthenticated ? (
          <>
            <Link to="/documents" style={{ marginRight: '10px' }}>Hem</Link> {/* Länk till hem */}
            <button onClick={handleLogout}>Logga ut</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Logga in</Link>
            <Link to="/register">Registrera</Link> {/* Länk till registreringssidan */}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
