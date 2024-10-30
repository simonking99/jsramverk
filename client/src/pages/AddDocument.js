import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Definiera API-URL:en som en konstant
const API_URL = 'https://jsramverk-v2x-ane2cxfnc8dddcgf.swedencentral-01.azurewebsites.net';

const AddDocument = ({ onAddDocument }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    // Funktion för att hantera formulärets inskickning
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const documentData = { title, content };
            await axios.post(`${API_URL}/addone`, documentData, {  // Använd API_URL-variabeln här
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onAddDocument();
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    // Funktion för att navigera tillbaka till dokumentlistan
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
