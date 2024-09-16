// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddDocument from './pages/AddDocument';
import DocumentList from './pages/DocumentList';
import UpdateDocument from './pages/UpdateDocument'; // Import the new component


import Header from './components/Headers'; // Import the Header component
import Footer from './components/Footer'; // Import the Footer component
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<DocumentList />} />
            <Route path="/add" element={<AddDocument />} />
            <Route path="/update/:id" element={<UpdateDocument />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
