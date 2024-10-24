import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // För navigering

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
          <button onClick={handleLogout} className="logout-button">Logga ut</button>
        </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Logga in</Link>
            <Link to="/register" className="nav-link">Registrera</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
