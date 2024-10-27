import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Anslut till Socket.io-servern
const socket = io('http://localhost:3001', {
    transports: ['websocket'],
    path: '/socket.io',
});

const UpdateDocument = ({ document, onUpdateDocument }) => {
    const [title, setTitle] = useState(document.title || '');
    const [content, setContent] = useState(document.content || '');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [selectedLine, setSelectedLine] = useState(null);
    const [username, setUsername] = useState(''); // För delning
    const [recipientEmail, setRecipientEmail] = useState(''); // För inbjudan
    const navigate = useNavigate();

    useEffect(() => {
        // Gå med i dokumentets rum
        socket.emit('create', document._id);
        console.log(`Joined room for document: ${document._id}`);

        // Lyssna på dokumentuppdateringar från andra användare
        socket.on('doc', (data) => {
            console.log("Received document update from socket:", data);
            if (data._id === document._id) {
                setTitle(data.title);
                setContent(data.html);
            }
        });

        // Lyssna på nya kommentarer från andra användare
        socket.on('newComment', (commentData) => {
            console.log("Received new comment from socket:", commentData);
            if (commentData.documentId === document._id) {
                setComments((prevComments) => [...prevComments, commentData]);
                console.log("Updated comments array with new comment:", commentData);
            }
        });

        // Rensa lyssnare när komponenten avmonteras
        return () => {
            socket.off('doc');
            socket.off('newComment');
        };
    }, [document._id]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        console.log("Sending title update to socket:", newTitle);
        socket.emit('doc', { _id: document._id, title: newTitle, html: content });
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        console.log("Sending content update to socket:", newContent);
        socket.emit('doc', { _id: document._id, title, html: newContent });
    };

    const handleAddComment = () => {
        if (newComment && selectedLine !== null) {
            const commentData = { 
                documentId: document._id, 
                line: selectedLine, 
                text: newComment, 
                user: 'Comment: ' // Ersätt med användarnamn om tillgängligt
            };

            console.log("Sending new comment:", commentData);
            socket.emit('newComment', commentData);

            setNewComment('');
            setSelectedLine(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const documentData = { title, content, comments };
            await axios.put(`http://localhost:3001/updateone/${document._id}`, documentData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            onUpdateDocument();
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    const handleShare = async () => {
        try {
            await axios.post('http://localhost:3001/share', {
                documentId: document._id,
                username: username
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Document shared successfully!');
            setUsername(''); // Rensa inputfältet efter delning
        } catch (error) {
            console.error('Error sharing document:', error);
            alert('Failed to share document. Please try again.');
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
        <center>
        <div>
            <h2>Update Document</h2>
            <form onSubmit={handleUpdate}>
                <input value={title} onChange={handleTitleChange} placeholder="Title" className="input-title"/>
                <textarea value={content} onChange={handleContentChange} placeholder="Content" className="textarea-content"/>
                <button type="submit" className="btn-update">Update Document</button>
            </form>

            {/* Kommentarsfält placeras direkt under update-knappen */}
            <div className="comments-section">
                <h3>Comments</h3>
                {content.split('\n').map((_, index) => (
                    <div key={index} style={{ position: 'relative', padding: '4px 0' }}>
                        <span>Row {index + 1}:</span>
                        <button 
                            style={{ marginLeft: '8px' }}
                            onClick={() => setSelectedLine(index)}
                        >Add Comment</button>
                        {comments
                            .filter(comment => comment.line === index)
                            .map((comment, idx) => (
                                <div key={idx} style={{ marginLeft: '16px', fontStyle: 'italic' }}>
                                    {comment.user}: {comment.text}
                                </div>
                            ))}
                    </div>
                ))}
                {selectedLine !== null && (
                    <div style={{ marginTop: '10px' }}>
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Enter your comment"
                        />
                        <button onClick={handleAddComment}>Submit Comment</button>
                    </div>
                )}
            </div>
                <hr></hr>
            {/* Delning och inbjudan läggs till här efter kommentarsfältet */}
            <div className="share-invite-section">
                <h3>Share & Invite Options</h3>
                
                <div className="share-section">
                    <h4>Share Document with another User</h4>
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
                    <h4>Send Invite via Email</h4>
                    <input 
                        type="email" 
                        value={recipientEmail} 
                        onChange={e => setRecipientEmail(e.target.value)} 
                        placeholder="Enter email address" 
                        className="input-invite"
                    />
                    <button onClick={handleInvite} className="btn-invite">Send Invite</button>
                </div>
            </div>

            <center>
                <button onClick={handleBack} className="btn-back">Back</button>
            </center>
        </div>  
        </center>  
    );
};

export default UpdateDocument;