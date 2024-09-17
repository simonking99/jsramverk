// src/DocumentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link component
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate(); // Use navigate for redirection


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/');
        setDocuments(response.data);
      } catch (error) {
        console.error('There was an error fetching the documents!', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleNavigateToAdd = () => {
    navigate('/add'); // Navigate to the add document page
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:3001/deleteAll');
      setDocuments([]); // Clear the document list after deletion
      // You can use navigate to refresh the page or redirect
    } catch (error) {
      console.error('There was an error deleting the documents!', error);
      alert('There was an error deleting the documents!');
    }
  };

  return (
    <div>
      <h2>Document List</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            <h3>
              <Link to={`/update/${doc._id}`} className="document-title-link">
                {doc.title || 'Untitled'}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
      <button onClick={handleNavigateToAdd} className="add-document-link" style={{ marginRight: '10px' }}>
        Add New Document
      </button>
      <button onClick={handleDeleteAll} className="delete-all-button">
        Delete All Documents
      </button>
    </div>
  );
};

export default DocumentList;
