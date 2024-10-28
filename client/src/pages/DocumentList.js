import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = ({ onUpdate, onAddDocument }) => {
    const [documents, setDocuments] = useState([]);
    const [inputId, setInputId] = useState('');
    const [userId, setUserId] = useState('');

    // Hämtar dokumenten vid laddning av komponenten
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://localhost:3001/documents', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
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

    // Raderar alla dokument från databasen
    const handleDeleteAll = async () => {
        try {
            await axios.delete('http://localhost:3001/deleteAll', {
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
            await axios.post('http://localhost:3001/share', {
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