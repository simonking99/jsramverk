import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Ensure the client connects to the correct port and path

const socket = io('http://localhost:3001', {
    transports: ['websocket'], // Ensure WebSocket transport only
    path: '/socket.io', // Make sure this path matches the backend configuration
});


const UpdateDocument = ({ document, onUpdateDocument }) => {
    const [title, setTitle] = useState(document.title || '');
    const [content, setContent] = useState(document.content || '');
    const [username, setUsername] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('create', document._id); // Gå med i dokumentets rum
        console.log(`Joined room for document: ${document._id}`);
    
        // Lyssna på dokumentuppdateringar från andra användare
        socket.on('doc', (data) => {
            if (data._id === document._id) {
                setTitle(data.title);    // Uppdatera titeln i realtid
                setContent(data.html);   // Uppdatera innehållet i realtid
            }
        });
    
        // Rensa lyssnare när komponenten avmonteras
        return () => {
            socket.off('doc');
        };
    }, [document._id]);
    
    

    // Emitera titeländringar i realtid
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);  // Uppdatera lokalt tillstånd
        socket.emit('doc', { _id: document._id, title: newTitle, html: content });  // Skicka realtidsuppdatering till servern
    };

    // Emitera innehållsändringar i realtid
    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);  // Uppdatera lokalt tillstånd
        socket.emit('doc', { _id: document._id, title: title, html: newContent });  // Skicka realtidsuppdatering till servern
    };


    // Handle document update when submitting
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const documentData = { title, content };
            await axios.put(`http://localhost:3001/updateone/${document._id}`, documentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onUpdateDocument(); // Notify parent that the document is updated
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    // Share document with another user
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
            alert('Document shared successfully!');
            setUsername('');
        } catch (error) {
            console.error('Error sharing document:', error);
            alert('Failed to share document. Please try again.');
        }
    };

    // Invite another user by email
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
            alert(`Invitation sent to ${recipientEmail}`);
            setRecipientEmail('');
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Failed to send invitation. Please try again.');
        }
    };

    const handleBack = () => {
        onUpdateDocument();
        navigate('/documents');
    };

    return (
        <div>
            <h2>Update Document</h2>
            <form onSubmit={handleUpdate}>
                <input 
                    value={title} 
                    onChange={handleTitleChange} 
                    placeholder="Title" 
                    className="input-title"
                />
                <textarea 
                    value={content} 
                    onChange={handleContentChange} 
                    placeholder="Content" 
                    className="textarea-content"
                />
                <button type="submit" className="btn-update">Update Document</button>
            </form>
    
            <center>
                <div className="share-section">
                    <h3>Share Document with another User</h3>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="Enter username" 
                        className="input-share"
                    />
                    <button onClick={handleShare} className="btn-share">Share Document</button>
                </div>
    
                <div className="invite-section">
                    <h3>Send Invite via Email</h3>
                    <input 
                        type="email" 
                        value={recipientEmail} 
                        onChange={e => setRecipientEmail(e.target.value)} 
                        placeholder="Enter email address" 
                        className="input-invite"
                    />
                    <button onClick={handleInvite} className="btn-invite">Send Invite</button>
                </div>
    
                <br />
                <button onClick={handleBack} className="btn-back">Back</button>
            </center>
        </div>    
    );
};

export default UpdateDocument;
