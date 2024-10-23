import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = ({ onUpdate, onAddDocument }) => {
    const [documents, setDocuments] = useState([]);
    const [inputId, setInputId] = useState(''); // State för att spara dokumentets ID
    const [userId, setUserId] = useState(''); // State för att spara användarens ID

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
            <h2>Dokumentlista</h2>
            <ul>
                {Array.isArray(documents) && documents.length > 0 ? (
                    documents.map((doc) => (
                        <li key={doc._id}>
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
                    <li>Inga dokument tillgängliga</li>
                )}
            </ul>
    
    
            <button
                onClick={onAddDocument}
                className="add-document-link" 
                style={{ marginRight: '10px' }}
            >
                Lägg till nytt dokument
            </button>
            <button onClick={handleDeleteAll} className="delete-all-button">
                Ta bort alla dokument
            </button>

            <div className="input-container">
                <input 
                    type="text" 
                    placeholder="Skriv in dokumentets ID" 
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Skriv in ditt användarnamn"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} 
                />
                <button onClick={handleShareDocument}>Hämta Dokument</button>
            </div>
        </div>
    );
};

export default DocumentList;
