import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

// Skapa en WebSocket-anslutning med Socket.IO
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
    const [username, setUsername] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [output, setOutput] = useState('');
    const [isCodeMode, setIsCodeMode] = useState(document.isCode || false);
    const navigate = useNavigate();

    // Anslut till dokumentet via Socket.IO när komponenten laddas
    useEffect(() => {
        socket.emit('create', document._id);
        // Lyssna på uppdateringar av dokumentet
        socket.on('doc', (data) => {
            if (data._id === document._id) {
                setTitle(data.title);
                setContent(data.html);
            }
        });
        // Lyssna på uppdateringar av nya kommentarer
        socket.on('newComment', (commentData) => {
            if (commentData.documentId === document._id) {
                setComments((prevComments) => [...prevComments, commentData]);
            }
        });
        // Stäng av Socket.IO-lyssnare när komponenten stängs
        return () => {
            socket.off('doc');
            socket.off('newComment');
        };
    }, [document._id]);

    // Hantera ändringar av titlen och skicka den till servern via WebSocket
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        socket.emit('doc', { _id: document._id, title: newTitle, html: content });
    };

    // Hantera ändring av innehållet och skicka uppdatering till servern via WebSocket
    const handleContentChange = (value) => {
        setContent(value || '');
        socket.emit('doc', { _id: document._id, title, html: value });
    };

    // Lägg till en kommentar för varje befintligt radnummer
    const handleAddComment = () => {
        if (newComment && selectedLine !== null) {
            const commentData = { 
                documentId: document._id, 
                line: selectedLine, 
                text: newComment, 
                user: 'Comment received: '
            };
            socket.emit('newComment', commentData);
            setNewComment('');
            setSelectedLine(null);
        }
    };

    // Skicka uppdaterat dokument till servern
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const documentData = { title, content, comments, isCode: isCodeMode };
            await axios.put(`http://localhost:3001/updateone/${document._id}`, documentData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            onUpdateDocument();
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    // Exekvera JavaScript-koden
    const handleExecuteCode = async () => {
        // Omvandlar content till en base64-kodad sträng
        const encodedCode = btoa(content);
        const data = { code: encodedCode };

        // Skickar ett POST request till url med en base64-kodad sträng
        try {
            const response = await fetch("https://execjs.emilfolino.se/code", {
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' },
                method: 'POST'
            });
            const result = await response.json();
            const decodedOutput = atob(result.data);
            setOutput(decodedOutput);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput('Failed to execute code.');
        }
    };

    // Växla mellan kod och textläge
    const handleToggleCodeMode = () => setIsCodeMode(!isCodeMode);

    // Dela dokumentet med en specifik användare
    const handleShare = async () => {
        try {
            await axios.post('http://localhost:3001/share', {
                documentId: document._id,
                username: username
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Document shared successfully!');
            setUsername('');
        } catch (error) {
            console.error('Error sharing document:', error);
            alert('Failed to share document. Please try again.');
        }
    };

    // Skicka inbjudan till en användare baserat på e-postadress
    const handleInvite = async () => {
        try {
            await axios.post('http://localhost:3001/invite', {
                recipientEmail: recipientEmail,
                documentId: document._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Inbjudan skickad till ' + recipientEmail);
            setRecipientEmail('');
        } catch (error) {
            console.error('Fel vid skickande av inbjudan:', error);
            alert('Det gick inte att skicka inbjudan. Försök igen.');
        }
    };

    // Navigera tillbaka till dokumentlistan
    const handleBack = () => {
        onUpdateDocument();
        navigate('/documents');
    };

    return (
        <div className="update-document-container">
            <div className="editor-section">
                <h2>Update Document</h2>
                <form onSubmit={handleUpdate}>
                    <input value={title} onChange={handleTitleChange} placeholder="Title" className="input-title" />
                    <button type="button" onClick={handleToggleCodeMode} className="btn-toggle-mode">
                        {isCodeMode ? 'Switch to Text Mode' : 'Switch to Code Mode'}
                    </button>
                    {isCodeMode ? (
                        <Editor height="200px" defaultLanguage="javascript" theme="vs-dark" value={content} onChange={handleContentChange} />
                    ) : (
                        <textarea value={content} onChange={(e) => handleContentChange(e.target.value)} placeholder="Content" className="textarea-content" />
                    )}
                    <button type="submit" className="btn-update">Update Document</button>
                    <button type="button" onClick={handleExecuteCode} className="btn-run-code">Run Code</button>
                    <div className="output-display">{"Output from code execution: " + output}</div>
                </form>
            </div>

            <div className="sidebar">
            <div className="comments-section">
                <h3>Comments</h3>
                {content.split('\n').map((_, index) => (
                    <div key={index} className="comment-row">
                        <div className="comment-row-header">
                            <span>Row {index + 1}:</span>
                            <button onClick={() => setSelectedLine(index)} className="btn-add-comment">Add Comment</button>
                        <div className="comments-list">
                            {comments
                                .filter(comment => comment.line === index)
                                .map((comment, idx) => (
                                    <div key={idx} className="comment-display">
                                        {comment.user}: {comment.text}
                                    </div>
                                ))}
                                 </div>
                        </div>
                    </div>
                ))}
                {selectedLine !== null && (
                    <div className="new-comment">
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Enter your comment"
                        />
                        <button onClick={handleAddComment} className="btn-submit-comment">Submit Comment</button>
                    </div>
                )}
            </div>

                <div className="share-invite-section">
                    <h3>Share & Invite Options</h3>
                    <div className="share-section">
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="input-share" />
                        <button onClick={handleShare} className="btn-share">Share Document</button>
                    </div>
                    <div className="invite-section">
                        <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Enter email address" className="input-invite" />
                        <button onClick={handleInvite} className="btn-invite">Send Invite</button>
                    </div>
                    <button onClick={handleBack} className="btn-back">Back</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateDocument;
