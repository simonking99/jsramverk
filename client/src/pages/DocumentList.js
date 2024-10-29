import React, { useEffect, useState } from 'react';

const DocumentList = ({ onUpdate, onAddDocument }) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            const userId = localStorage.getItem('userId'); // Hämta userId från localStorage
            if (!userId) {
                console.error('Användar-ID saknas.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Lägg till auth-token
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                getAllByUser(userId: "${userId}") {
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
                setDocuments(result.data.getAllByUser);
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
            await fetch('http://localhost:3001/deleteAll', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDocuments([]); // Rensa dokumentlistan lokalt efter radering
        } catch (error) {
            console.error('Det uppstod ett fel vid radering av dokumenten!', error);
            alert('Det uppstod ett fel vid radering av dokumenten!');
        }
    };

    return (
        <div className="document-list-container">
            <h2>Your Documents</h2>
            <ul className="document-list">
                {Array.isArray(documents) && documents.length > 0 ? (
                    documents
                        .filter(doc => doc && doc.title)  // Kontrollera att doc och doc.title finns
                        .map((doc) => (
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
        </div>
    );
};

export default DocumentList;
