import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = ({ onUpdate, onAddDocument }) => {
    const [documents, setDocuments] = useState([]);
    const [inputId, setInputId] = useState('');
    const [userId, setUserId] = useState('');

    const API_URL = 'https://jsramverk-v2x-ane2cxfnc8dddcgf.swedencentral-01.azurewebsites.net';

    // Funktion för att hämta dokument från backend
    const fetchDocuments = async () => {
        const userId = localStorage.getItem('userId'); // Hämta userId från localStorage
        if (!userId) {
            console.error('Användar-ID saknas.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Lägg till auth-token
                },
                body: JSON.stringify({
                    query: `
                        query {
                            getAllDocumentsForUser(userId: "${userId}") {
                                _id
                                title
                                userId
                                content
                            }
                        }
                    `
                }),
            });
            const result = await response.json();
            setDocuments(result.data.getAllDocumentsForUser);
        } catch (error) {
            console.error('Det uppstod ett fel vid hämtning av dokument!', error);
        }
    };

    // Hämta dokument när komponenten laddas
    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpdateDocument = (doc) => {
        onUpdate(doc);
    };

    // Raderar alla dokument från databasen
    const handleDeleteAll = async () => {
        try {
            await axios.delete(`${API_URL}/deleteAll`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDocuments([]);
        } catch (error) {
            console.error('Det uppstod ett fel vid radering av dokumenten!', error);
            alert('Det uppstod ett fel vid radering av dokumenten!');
        }
    };

    // Delar ett specifikt dokument med en användare baserat på dokument-ID och användarnamn
    const handleShareDocument = async () => {
        try {
            await axios.post(`${API_URL}/share`, {
                documentId: inputId,
                username: userId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Dokumentet delades framgångsrikt!');
            setInputId('');
            setUserId('');
        } catch (error) {
            console.error('Fel vid delning av dokument:', error);
            alert('Det gick inte att dela dokumentet. Försök igen.');
        }
    };

    return (
        <div className="document-list-container">
            <h2>All available documents</h2>
            {/* Uppdatera-knapp för att hämta de senaste dokumenten */}
            <button onClick={fetchDocuments} className="btn refresh">Refresh Documents</button>
            
            <ul className="document-list">
                {Array.isArray(documents) && documents.length > 0 ? (
                    documents.map((doc) => (
                        <li key={doc._id} className="document-item">
                            <h3>
                                <span 
                                    onClick={() => handleUpdateDocument(doc)} 
                                    className="document-title-link"
                                >
                                    {doc.title || 'Untitled'}
                                </span>
                            </h3>
                        </li>
                    ))
                ) : (
                    <li className="no-documents">No available documents</li>
                )}
            </ul>
    
            <div className="button-group">
                <button onClick={onAddDocument} className="btn add-document">Add new document</button>
                <button onClick={handleDeleteAll} className="btn delete-all">Delete all documents</button>
            </div>

            <div className="share-document-section">
                <input 
                    type="text" 
                    placeholder="Document-ID" 
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)} 
                    className="input-field"
                />
                <input 
                    type="text" 
                    placeholder="Username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} 
                    className="input-field"
                />
                <button onClick={handleShareDocument} className="btn share-document">Get document</button>
            </div>
        </div>
    );
};

export default DocumentList;
