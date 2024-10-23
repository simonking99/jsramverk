import React, { useState, useEffect } from 'react';
import AddDocument from './pages/AddDocument';
import DocumentList from './pages/DocumentList';
import UpdateDocument from './pages/UpdateDocument';
import Header from './components/Headers';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import { useNavigate, Routes, Route } from 'react-router-dom';

const App = () => {
  const [currentView, setCurrentView] = useState('list');
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/documents');
    } else {
      if (window.location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleAddDocument = () => {
    setCurrentView('add');
  };

  const handleUpdateDocument = (doc) => {
    setCurrentDocument(doc);
    setCurrentView('update');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const renderView = () => {
    switch (currentView) {
      case 'add':
        return <AddDocument onAddDocument={handleBackToList} />;
      case 'update':
        return (
          <UpdateDocument 
            document={currentDocument}
            onUpdateDocument={handleBackToList}
          />
        );
      default:
        return (
          <DocumentList 
            onUpdate={handleUpdateDocument} 
            onAddDocument={handleAddDocument}
          />
        ); 
    }
  };

  return (
    <div className="app-container">
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <main>
        <Routes>
          <Route path="/documents" element={renderView()} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
