import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateDocument = ({ document, onUpdateDocument }) => {
    const [title, setTitle] = useState(document.title || '');
    const [content, setContent] = useState(document.content || '');
    const [username, setUsername] = useState('');
    const [recipientEmail, setRecipientEmail] = useState(''); // Ny state för e-postadress
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const documentData = { title, content };
            await axios.put(`http://localhost:3001/updateone/${document._id}`, documentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onUpdateDocument();
        } catch (error) {
            console.error('Fel vid uppdatering av dokument:', error);
        }
    };

    const handleShare = async () => {
        try {
            await axios.post('http://localhost:3001/share', {
                documentId: document._id,
                username: username
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Dokumentet delades framgångsrikt!');
            setUsername('');
        } catch (error) {
            console.error('Fel vid delning av dokument:', error);
            alert('Det gick inte att dela dokumentet. Försök igen.');
        }
    };

    const handleInvite = async () => {
        try {
            await axios.post('http://localhost:3001/invite', {
                recipientEmail: recipientEmail,
                documentId: document._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Inbjudan skickad till ' + recipientEmail);
            setRecipientEmail('');
        } catch (error) {
            console.error('Fel vid skickande av inbjudan:', error);
            alert('Det gick inte att skicka inbjudan. Försök igen.');
        }
    };

    const handleBack = () => {
        onUpdateDocument();
        navigate('/documents');
    };

    return (
        <div>
            <h2>Uppdatera dokument</h2>
            <form onSubmit={handleUpdate}>
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
                <button type="submit">Uppdatera dokument</button>
            </form>

            <div style={{ marginTop: '20px' }}>
                <h3>Dela dokument med annan användare</h3>
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Ange användarnamn" 
                />
                <button onClick={handleShare}>Dela dokument</button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Skicka inbjudan via e-post</h3>
                <input 
                    type="email" 
                    value={recipientEmail} 
                    onChange={e => setRecipientEmail(e.target.value)} 
                    placeholder="Ange e-postadress" 
                />
                <button onClick={handleInvite}>Skicka inbjudan</button>
            </div>

            <button onClick={handleBack}>Tillbaka</button>
        </div>
    );
};

export default UpdateDocument;
