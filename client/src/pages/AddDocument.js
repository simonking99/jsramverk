import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDocument = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/addone', {
        title,
        content,
      });
      setTitle('');
      setContent('');
      navigate('/'); // Redirect to the DocumentList page
    } catch (error) {
      console.error('There was an error adding the document!', error);
    }
  };

  return (
    <div>
      <h2>Add Document</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Document</button>
      </form>
    </div>
  );
};

export default AddDocument;
