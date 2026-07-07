import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './LiveChat.css';

const LiveChat = ({ requestId, currentUser, otherUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [loading, setLoading]   = useState(true);
    const messagesEndRef           = useRef(null);
    const socketRef                = useRef(null); // ← socket ref me rakho
    const token = sessionStorage.getItem('token');

    // ── Socket + History setup ────────────────────────────
    useEffect(() => {
        // 1. new socket connection
        socketRef.current = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    auth: { token }
});

        // 2. Room join 
        socketRef.current.emit('join_room', requestId);

        // 3. Real-time message receive
        socketRef.current.on('receive_message', (data) => {
            setMessages(prev => {
                const exists = prev.some(m =>
                    m._id && data._id && m._id.toString() === data._id.toString()
                );
                if (exists) return prev;
                return [...prev, data];
            });
        });

        // 4. Chat history load 
        const fetchHistory = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/messages/${requestId}`,
                    { headers: { 'auth-token': token } }
                );
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMessages(data.map(msg => ({
                        ...msg,
                        time: new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit'
                        })
                    })));
                }
            } catch (err) {
                console.error('History error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // 5. Cleanup — component unmount 
        return () => {
            socketRef.current.disconnect();
        };
    }, [requestId, token]);

    // ── Auto scroll ───────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Send message ──────────────────────────────────────
    const sendMessage = () => {
        if (!inputMsg.trim() || !socketRef.current) return;

        const msgData = {
            requestId,
            senderId:   currentUser.id,
            senderName: currentUser.name,
            message:    inputMsg.trim(),
        };

        socketRef.current.emit('send_message', msgData);
        setInputMsg('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-overlay" onClick={onClose}>
            <div className="chat-box" onClick={(e) => e.stopPropagation()}   >

                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-info">
                        <img
                            src={otherUser?.photo
                                ? `http://localhost:5000${otherUser.photo}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=fdb441&color=1a1a1a&bold=true`}
                            alt="user"
                            className="chat-header-avatar"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=fdb441&color=1a1a1a&bold=true`;
                            }}
                        />
                        <div>
                            <h4>{otherUser?.name || 'User'}</h4>
                            <span className="chat-online">🟢 Online</span>
                        </div>
                    </div>
                    <button className="chat-close-btn" onClick={onClose}>✖</button>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {loading ? (
                        <div className="chat-empty"><p>Loading messages...</p></div>
                    ) : messages.length === 0 ? (
                        <div className="chat-empty"><p>👋 Say hello to start the conversation!</p></div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.senderId?.toString() === currentUser.id?.toString();
                            return (
                                <div key={msg._id || index}
                                    className={`chat-msg-wrapper ${isMe ? 'me' : 'other'}`}>
                                    {!isMe && (
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName || 'U')}&background=1a1a2e&color=fdb441&bold=true`}
                                            alt="avatar"
                                            className="chat-msg-avatar"
                                        />
                                    )}
                                    <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                                        {!isMe && (
                                            <span className="chat-sender-name">{msg.senderName}</span>
                                        )}
                                        <p>{msg.message}</p>
                                        <span className="chat-time">{msg.time}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-input-area">
                    <textarea
                        className="chat-input"
                        placeholder="Type a message... (Enter to send)"
                        value={inputMsg}
                        onChange={(e) => setInputMsg(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button className="chat-send-btn" onClick={sendMessage}>➤</button>
                </div>

            </div>
        </div>
    );
};

export default LiveChat;