import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddDocument from './pages/AddDocument';
import DocumentList from './pages/DocumentList';
import UpdateDocument from './pages/UpdateDocument'; 
//test
import Header from './components/Headers'; 
import Footer from './components/Footer'; 
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container"> {/* Make sure this matches your CSS */}
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
