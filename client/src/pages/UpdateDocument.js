// src/pages/UpdateDocument.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDocument = () => {
  const { id } = useParams(); // Get the document ID from the URL
  const navigate = useNavigate(); // To navigate programmatically
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/document/${id}`);
        setTitle(response.data.title || '');
        setContent(response.data.content || '');
      } catch (error) {
        console.error('There was an error fetching the document!', error);
      }
    };

    fetchDocument();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/updateone/${id}`, { title, content });
      navigate('/'); // Redirect to the document list after update
    } catch (error) {
      console.error('There was an error updating the document!', error);
      alert('There was an error updating the document!');
    }
  };

  return (
    <div>
      <h2>Update Document</h2>
      <form onSubmit={handleUpdate}>
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
        <button type="submit">Update Document</button>
      </form>
    </div>
  );
};

export default UpdateDocument;
