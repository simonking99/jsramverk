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
        <div className="add-document-container">
            <h2>Lägg till nytt dokument</h2>
            <form onSubmit={handleSubmit} className="add-document-form">
                <label htmlFor="title" className="label"></label>
                <input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Rubrik"
                    className="input-title"
                />

                <label htmlFor="content" className="label"></label>
                <textarea 
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Innehåll"
                    className="textarea-content"
                />

                <button type="submit" className="btn-add">Lägg till dokument</button>
            </form>

            <center>
                <button onClick={handleBack} className="btn-back">Tillbaka</button>
            </center>
        </div>
    );
};

export default AddDocument;