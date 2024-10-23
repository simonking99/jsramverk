import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDocument = ({ onAddDocument }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const documentData = { title, content };
            await axios.post('http://localhost:3001/addone', documentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onAddDocument();
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    const handleBack = () => {
        onAddDocument();
        navigate('/documents');
    };

    return (
        <div>
            <h2>Lägg till nytt dokument</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Rubrik" 
                />
                <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder="Innehåll" 
                />
                <button type="submit">Lägg till dokument</button>
            </form>
            <button onClick={handleBack}>Tillbaka</button>
        </div>
    );
};

export default AddDocument;
