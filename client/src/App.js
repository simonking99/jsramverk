import React, { useState } from 'react';
import AddDocument from './pages/AddDocument';
import DocumentList from './pages/DocumentList';
import UpdateDocument from './pages/UpdateDocument';
import Header from './components/Headers';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('list');
  const [currentDocument, setCurrentDocument] = useState(null);

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
      <Header />
      <main>
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
