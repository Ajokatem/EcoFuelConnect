import React, { useState, useEffect } from "react";
import '../assets/css/messages-responsive.css';
import { Container, Row, Col, Button, Form, ListGroup, Spinner } from "react-bootstrap";
import Picker from 'emoji-picker-react';
import { useUser } from "../contexts/UserContext";

function Messages() {
  const { user } = useUser();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeProducers, setActiveProducers] = useState([]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => {
      if (footer) footer.style.display = '';
    };
  }, []);

  // Auto-select user from query param (for notification click)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    if (userId && chatUsers.length > 0) {
      const found = chatUsers.find(u => String(u.id) === String(userId));
      if (found) setSelectedUser(found);
    }
  }, [chatUsers]);

  // Fetch chat users for vertical list
  useEffect(() => {
    fetch("/api/messages/chat-users", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const users = data.users || [];
        // Sort by most recent message
        const sorted = users.sort((a, b) => {
          const aLast = getLastMessage(a.id).timestamp;
          const bLast = getLastMessage(b.id).timestamp;
          return bLast - aLast;
        });
        setChatUsers(sorted);
      });
  }, [user, messages]);

  // Fetch active producers for top scroll
  useEffect(() => {
    fetch("/api/users?role=producer&isActive=true", { credentials: "include" })
      .then(res => res.json())
      .then(data => setActiveProducers(data.producers || []));
  }, []);

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetch(`/api/messages/with/${selectedUser.id}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setMessages(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedUser]);

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiverId: selectedUser.id, content: newMessage })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
        // Move this conversation to top by updating chatUsers order
        setChatUsers(prev => {
          const updated = prev.filter(u => u.id !== selectedUser.id);
          return [selectedUser, ...updated];
        });
      });
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const getLastMessage = (userId) => {
    const msgs = Array.isArray(messages) ? messages.filter(m => m.senderId === userId || m.receiverId === userId) : [];
    if (msgs.length === 0) return { text: '', time: '', unread: 0, timestamp: 0 };
    const last = msgs[msgs.length - 1];
    const unread = msgs.filter(m => m.receiverId === user.id && !m.isRead).length;
    return {
      text: last.content,
      time: new Date(last.sentAt).toLocaleString(),
      unread,
      timestamp: new Date(last.sentAt).getTime()
    };
  };

  // Profile header for chat thread (no Messages heading)
  const ChatHeader = ({ userObj }) => (
    <div style={{ display: "flex", alignItems: "center", background: "#fff", borderBottom: "1px solid #eee", padding: "16px 18px 8px 18px" }}>
      <img
        src={userObj.profilePhoto || require("../assets/img/default-avatar.png")}
        alt="avatar"
        style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 16 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{userObj.firstName} {userObj.lastName}</div>
        <div style={{ color: "#888", fontSize: 14 }}>{userObj.role}</div>
      </div>
      <Button variant="outline-primary" size="sm" style={{ borderRadius: 20, fontWeight: 600, fontSize: 14, padding: "6px 18px", boxShadow: "0 2px 8px rgba(24,119,242,0.08)" }} onClick={() => setShowProfile(true)}>
        <span style={{ marginRight: 6, fontSize: 16 }}>👤</span>Contact Info
      </Button>
    </div>
  );

  // WhatsApp-style chat bubbles
  // TikTok-style chat bubbles
  const ChatThread = () => {
    let lastDate = null;
    return (
      <div style={{ background: "#fff", minHeight: "calc(100vh - 80px)", padding: "24px 0 80px 0", overflowY: "auto", position: "relative" }}>
        {loading && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.6)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner animation="border" />
          </div>
        )}
        {messages.length === 0 && !loading && (
          <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg, idx) => {
          const msgDate = new Date(msg.sentAt);
          const showDivider = !lastDate || lastDate !== msgDate.toDateString();
          lastDate = msgDate.toDateString();
          const isMe = msg.senderId === user.id;
          return (
            <React.Fragment key={msg.id || idx}>
              {showDivider && (
                <div style={{ textAlign: "center", color: "#888", fontSize: 13, margin: "18px 0 8px 0" }}>
                  {msgDate.toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div
                  style={{
                    maxWidth: "75%",
                    background: isMe ? "#1da1f2" : "#fff",
                    color: isMe ? "#fff" : "#222",
                    borderRadius: "18px",
                    padding: "14px 22px",
                    boxShadow: isMe ? "0 2px 8px rgba(29,161,242,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
                    position: "relative",
                    border: isMe ? "none" : "1.5px solid #e7e7e7"
                  }}
                  title={msgDate.toLocaleString()}
                >
                  {/* Reply indicator (if msg.replyTo) */}
                  {msg.replyTo && (
                    <div style={{ fontSize: 13, color: isMe ? "#e0e0e0" : "#888", marginBottom: 6, background: isMe ? "rgba(255,255,255,0.08)" : "#f7f7f7", borderRadius: 10, padding: "4px 10px" }}>
                      Replied to: {msg.replyTo.content}
                    </div>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 500, wordBreak: "break-word" }}>{msg.content}</div>
                  <div style={{ fontSize: 11, color: isMe ? "#e0e0e0" : "#888", marginTop: 6, textAlign: "right", display: "flex", alignItems: "center", gap: 4 }}>
                    {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && (
                      <span style={{ marginLeft: 4, fontSize: 13 }}>
                        {msg.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
  <Container fluid className="messages-responsive-root" style={{ paddingBottom: 0 }}>
      {/* Chat List Screen */}
      {!selectedUser ? (
        <div className="messages-list-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "24px 18px 12px 18px" }}>
            <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>Chat</h2>
            {/* Removed or minimized plus icon for new chat */}
          </div>
          <div>
            {chatUsers.map(u => {
              const lastMsg = getLastMessage(u.id);
              return (
                <div key={u.id} onClick={() => setSelectedUser(u)} style={{ display: "flex", alignItems: "center", padding: "18px 0 18px 18px", borderBottom: "1px solid #f2f2f2", cursor: "pointer" }}>
                  <img
                    src={u.profilePhoto || require("../assets/img/default-avatar.png")}
                    alt="avatar"
                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 16 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{u.firstName} {u.lastName}</div>
                    <div style={{ fontSize: 15, color: "#888", marginTop: 2, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lastMsg.text || "Start chatting..."}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 60, fontSize: 13, color: "#888" }}>{lastMsg.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="messages-chat-container">
          {/* Responsive chat header */}
          <div className="messages-header">
            <span className="messages-back" onClick={() => setSelectedUser(null)}>&#60;</span>
            <img
              src={selectedUser.profilePhoto || require("../assets/img/default-avatar.png")}
              alt="avatar"
              className="messages-avatar"
            />
            <div className="messages-header-info">
              <div className="messages-header-name">{selectedUser.firstName} {selectedUser.lastName}</div>
            </div>
          </div>
          {/* Chat Thread - WhatsApp style, all white bubbles, scrollable area above input */}
          <div style={{ background: "#fff", height: "calc(100vh - 180px)", overflowY: "auto", position: "relative", padding: "18px 16px 20px 16px" }}>
            {messages.length === 0 && (
              <div className="messages-empty">No messages yet. Start the conversation!</div>
            )}
            {/* Date dividers */}
            {(() => {
              let lastDate = null;
              return messages.map((msg, idx) => {
                const msgDate = new Date(msg.sentAt);
                const showDivider = !lastDate || lastDate !== msgDate.toDateString();
                lastDate = msgDate.toDateString();
                const isMe = msg.senderId === user.id;
                return (
                  <React.Fragment key={msg.id || idx}>
                    {showDivider && (
                      <div className="messages-date-divider">
                        {msgDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                      </div>
                    )}
                    <div className={isMe ? "messages-row me" : "messages-row"}>
                      <div className={isMe ? "messages-bubble me" : "messages-bubble"} title={msgDate.toLocaleString()}>
                        <div className="messages-content">{msg.content}</div>
                        <div className="messages-time">{msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
            <div ref={messagesEndRef} />
          </div>
          {/* Message input bar - sticky at bottom of chat container */}
          <div style={{ background: "#fff", borderTop: "1px solid #e4e6eb", padding: "12px 16px", position: "sticky", bottom: 0, left: 0, right: 0 }}>
            <Form onSubmit={e => { e.preventDefault(); if (newMessage.trim()) sendMessage(); }} style={{ margin: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Form.Control
                  type="text"
                  placeholder="Message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  disabled={loading}
                  style={{ flex: 1, borderRadius: "20px", border: "1px solid #ccd0d5", padding: "8px 16px", fontSize: "15px", background: "#f0f2f5" }}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  style={{ background: "#0084ff", border: "none", color: "#fff", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
                >
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>➤</span>
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Messages;


