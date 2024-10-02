import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateDocument = ({ document, onUpdateDocument }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setContent(document.content || '');
    }
  }, [document]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!document || !document._id) {
      console.error('Inget dokument att uppdatera.');
      alert('Inget dokument att uppdatera.');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/updateone/${document._id}`, { title, content });
      onUpdateDocument();
    } catch (error) {
      console.error('Det uppstod ett fel vid uppdatering av dokumentet!', error);
      alert('Det uppstod ett fel vid uppdatering av dokumentet!');
    }
  };

  if (!document) {
    return <div>Inga dokument att uppdatera.</div>;
  }

  return (
    <div>
      <h2>Uppdatera dokument</h2>
      <form onSubmit={handleUpdate}>
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
        <button type="submit">Uppdatera dokument</button>
      </form>
    </div>
  );
};

export default UpdateDocument;
