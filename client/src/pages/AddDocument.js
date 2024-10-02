import React, { useState } from 'react';
import axios from 'axios';

const AddDocument = ({ onAddDocument }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post('http://localhost:3001/addone', {
        title,
        content,
      });
      setTitle('');
      setContent('');
      setSuccessMessage('Dokumentet har lagts till framgångsrikt!');
      onAddDocument();
    } catch (error) {
      console.error('Det uppstod ett fel vid tillägg av dokumentet!', error);
      setErrorMessage('Det uppstod ett fel vid tillägg av dokumentet. Vänligen försök igen.');
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Lägg till dokument</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rubrik:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Innehåll:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Lägg till dokument</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default AddDocument;
