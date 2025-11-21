import React, { useState, useEffect, useRef } from "react";
import '../assets/css/messages-responsive.css';
import { Container, Button, Form } from "react-bootstrap";

function Messages() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : { id: null };
    } catch {
      return { id: null };
    }
  });
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => {
      if (footer) footer.style.display = '';
    };
  }, []);

  useEffect(() => {
    fetchChatUsers();
  }, []);

  const fetchChatUsers = () => {
    fetch("/api/messages/chat-users", { credentials: "include" })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          console.log('Chat users error response:', text.substring(0, 200));
          throw new Error('Failed to fetch chat users');
        }
        return res.json();
      })
      .then(data => setChatUsers(data.users || []))
      .catch(err => {
        console.error('Chat users error:', err);
        setChatUsers([]);
      });
  };

  const searchUsers = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchAttempted(false);
      return;
    }
    setSearching(true);
    setSearchAttempted(true);
    const searchUrl = `/api/users?search=${encodeURIComponent(searchTerm)}`;
    console.log('Searching users with URL:', searchUrl);
    fetch(searchUrl, { credentials: "include" })
      .then(async res => {
        console.log('Search response status:', res.status);
        const contentType = res.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!res.ok) {
          const text = await res.text();
          console.log('Error response:', text.substring(0, 200));
          throw new Error(`Failed to search users: ${res.status}`);
        }
        
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.log('Non-JSON response:', text.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }
        
        return res.json();
      })
      .then(data => {
        console.log('Search results:', data);
        console.log('Number of users found:', data.users?.length || 0);
        if (data.users && data.users.length > 0) {
          console.log('First user:', data.users[0]);
        }
        setSearchResults(data.users || []);
        setSearching(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setSearchResults([]);
        setSearching(false);
      });
  };

  const startChat = (u) => {
    setSelectedUser(u);
    setShowSearch(false);
    setSearchTerm("");
    setSearchResults([]);
    setSearchAttempted(false);
    if (!chatUsers.find(cu => cu.id === u.id)) {
      setChatUsers(prev => [u, ...prev]);
    }
  };

  const cancelSearch = () => {
    setShowSearch(false);
    setSearchTerm("");
    setSearchResults([]);
    setSearchAttempted(false);
  };

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetch(`/api/messages/with/${selectedUser.id}`, { credentials: "include" })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch messages');
          return res.json();
        })
        .then(data => {
          setMessages(data.messages || []);
          setLoading(false);
        })
        .catch(() => {
          setMessages([]);
          setLoading(false);
        });
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiverId: selectedUser.id, content: newMessage })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setMessages(prev => [...prev, data.message]);
          setNewMessage("");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Container fluid className="messages-responsive-root" style={{ paddingBottom: 0 }}>
      {!selectedUser ? (
        <div className="messages-list-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px 16px 18px", borderBottom: "2px solid #f0f2f5" }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0, color: "#1c1e21" }}>Messages</h2>
            <Button 
              variant={showSearch ? "outline-secondary" : "primary"}
              size="sm" 
              onClick={() => showSearch ? cancelSearch() : setShowSearch(true)}
              style={{ borderRadius: "20px", padding: "8px 18px", fontWeight: 600, fontSize: "14px" }}
            >
              {showSearch ? "✕ Cancel" : "+ New Chat"}
            </Button>
          </div>
          {showSearch && (
            <div style={{ padding: "16px 18px", background: "#f8f9fa", borderBottom: "1px solid #e4e6eb" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  disabled={searching}
                  style={{ borderRadius: "24px", padding: "10px 18px", border: "2px solid #e4e6eb", fontSize: "14px" }}
                />
                <Button 
                  variant="success" 
                  onClick={searchUsers}
                  disabled={!searchTerm.trim() || searching}
                  style={{ borderRadius: "24px", padding: "10px 24px", fontWeight: 600, minWidth: "100px" }}
                >
                  {searching ? "Searching..." : "Search"}
                </Button>
              </div>
              {searching && (
                <div style={{ textAlign: "center", padding: "30px", color: "#65676b" }}>
                  <div style={{ fontSize: "16px" }}>🔍 Searching active users...</div>
                </div>
              )}
              {!searching && searchResults.length > 0 && (
                <div style={{ marginTop: "8px", maxHeight: "350px", overflowY: "auto", background: "#fff", border: "1px solid #e4e6eb", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f2f5", background: "#f8f9fa", fontWeight: 600, fontSize: "13px", color: "#65676b", textTransform: "uppercase" }}>
                    {searchResults.length} Active User{searchResults.length !== 1 ? 's' : ''} Found
                  </div>
                  {searchResults.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => startChat(u)} 
                      style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #f0f2f5", cursor: "pointer", background: "#fff", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f0f2f5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                    >
                      <img
                        src={u.profilePhoto || require("../assets/img/default-avatar.png")}
                        alt="avatar"
                        style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 14, border: "2px solid #e4e6eb" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 16, color: "#1c1e21", marginBottom: "2px" }}>{u.firstName} {u.lastName}</div>
                        <div style={{ fontSize: 14, color: "#65676b" }}>
                          <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{u.role}</span>
                          {u.organization && <span> • {u.organization}</span>}
                        </div>
                      </div>
                      <div style={{ color: "#22c55e", fontSize: "20px" }}>💬</div>
                    </div>
                  ))}
                </div>
              )}
              {!searching && searchAttempted && searchResults.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: "12px", border: "1px solid #e4e6eb" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#1c1e21", marginBottom: "6px" }}>No Active Users Found</div>
                  <div style={{ fontSize: "14px", color: "#65676b" }}>Try searching with a different name or email</div>
                </div>
              )}
            </div>
          )}
          <div>
            {chatUsers.length === 0 && !showSearch && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#65676b" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
                <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "#1c1e21" }}>No Conversations Yet</div>
                <div style={{ fontSize: "14px", color: "#65676b" }}>Click "+ New Chat" to start messaging</div>
              </div>
            )}
            {chatUsers.map(u => (
              <div key={u.id} onClick={() => setSelectedUser(u)} style={{ display: "flex", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #f0f2f5", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f2f5"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <img
                  src={u.profilePhoto || require("../assets/img/default-avatar.png")}
                  alt="avatar"
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 16 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{u.firstName} {u.lastName}</div>
                  <div style={{ fontSize: 15, color: "#888", marginTop: 2 }}>{u.lastMessage || "Start chatting..."}</div>
                </div>
                {u.unreadCount > 0 && (
                  <span style={{ background: "#22c55e", color: "white", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{u.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="messages-chat-container">
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
          <div style={{ background: "#fff", height: "calc(100vh - 180px)", overflowY: "auto", position: "relative", padding: "18px 16px 20px 16px" }}>
            {messages.length === 0 && (
              <div className="messages-empty">No messages yet. Start the conversation!</div>
            )}
            {messages.map((msg, idx) => {
              const msgDate = new Date(msg.sentAt);
              const isMe = msg.senderId === user.id;
              return (
                <div key={msg.id || idx} className={isMe ? "messages-row me" : "messages-row"}>
                  <div className={isMe ? "messages-bubble me" : "messages-bubble"} title={msgDate.toLocaleString()}>
                    <div className="messages-content">{msg.content}</div>
                    <div className="messages-time">{msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
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
