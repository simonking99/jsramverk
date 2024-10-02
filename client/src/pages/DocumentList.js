import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = ({ onUpdate, onAddDocument }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/');
        setDocuments(response.data);
      } catch (error) {
        console.error('Det uppstod ett fel vid hämtning av dokument!', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpdateDocument = (doc) => {
    onUpdate(doc);
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:3001/deleteAll');
      setDocuments([]);
    } catch (error) {
      console.error('Det uppstod ett fel vid radering av dokumenten!', error);
      alert('Det uppstod ett fel vid radering av dokumenten!');
    }
  };

  return (
    <div>
      <h2>Dokumentlista</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            <h3>
              <span 
                onClick={() => handleUpdateDocument(doc)} 
                className="document-title-link" 
                style={{ cursor: 'pointer' }}
              >
                {doc.title || 'Untitled'}
              </span>
            </h3>
          </li>
        ))}
      </ul>
      <button 
        onClick={onAddDocument}
        className="add-document-link" 
        style={{ marginRight: '10px' }}
      >
        Lägg till nytt dokument
      </button>
      <button onClick={handleDeleteAll} className="delete-all-button">
        Ta bort alla dokument
      </button>
    </div>
  );
};

export default DocumentList;
