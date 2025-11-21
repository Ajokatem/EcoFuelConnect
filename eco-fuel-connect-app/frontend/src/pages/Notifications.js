  // Helper to group notifications by date
const groupNotificationsByDate = (notifications) => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    const now = new Date();
    notifications.forEach(n => {
      // Use datetime if present, else fallback to createdAt
      const date = new Date(n.datetime || n.createdAt);
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays < 1 && date.getDate() === now.getDate()) {
        groups.Today.push(n);
      } else if (diffDays < 2 && date.getDate() === (new Date(now.getTime() - 86400000)).getDate()) {
        groups.Yesterday.push(n);
      } else {
        groups.Earlier.push(n);
      }
    });
    return groups;
  };
import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import api from '../services/api';

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const { user } = require("../contexts/UserContext").useUser();
  const [loading, setLoading] = useState(false);
  const POLL_INTERVAL = 30000; // 30 seconds

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      console.log("Fetched notifications from API:", data);
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [user]);

  // Mark notification as read (backend + local state)
  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {}
  };

  // Delete notification (backend + local state)
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {}
  };

  const formatDateTime = (datetime) => {
    const now = new Date();
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return "";
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Apply read/unread filter only (backend already filters by userId)
  let filteredNotifications = notifications;
  if (filter === "unread") {
    filteredNotifications = notifications.filter(n => !(n.isRead || n.read));
  }

  return (
    <div className="content" style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container fluid>
        <Row>
          <Col>
            {/* Header */}
            <div className="text-center mb-4">
              <h2 style={{ fontSize: "2rem", color: "#2c3e50", fontWeight: "600" }}>
                Notification Center
              </h2>
              <div className="mt-3">
                <Button
                  onClick={() => setFilter("all")}
                  style={{
                    backgroundColor: filter === "all" ? "rgba(40, 167, 69, 0.9)" : "rgba(255, 255, 255, 0.1)",
                    borderColor: "#28a745",
                    color: filter === "all" ? "white" : "#28a745",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "2px solid #28a745",
                    marginRight: "10px"
                  }}
                >
                  All
                </Button>
                <Button
                  onClick={() => setFilter("unread")}
                  style={{
                    backgroundColor: filter === "unread" ? "rgba(40, 167, 69, 0.9)" : "rgba(255, 255, 255, 0.1)",
                    borderColor: "#28a745",
                    color: filter === "unread" ? "white" : "#28a745",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "2px solid #28a745"
                  }}
                >
                  Unread
                </Button>
              </div>
            </div>
            {/* Notifications List - Grouped by Date */}
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              {loading ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">Loading notifications...</h5>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">No notifications</h5>
                </div>
              ) : (
                <>
                  {Object.entries(groupNotificationsByDate(filteredNotifications)).map(([group, items]) => (
                    items.length > 0 && (
                      <div key={group} style={{ marginBottom: "30px" }}>
                        <h5 style={{ color: "#28a745", fontWeight: "bold", marginBottom: "18px" }}>{group}</h5>
                        {items.map((notification) => (
                          <div
                            key={notification.id}
                            style={{
                              backgroundColor: "white",
                              border: "1px solid #e9ecef",
                              borderRadius: "8px",
                              padding: "20px",
                              marginBottom: "15px",
                              borderLeft: !notification.read ? "4px solid #28a745" : "4px solid transparent",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div style={{ flex: 1 }}>
                                <div className="d-flex align-items-center mb-2">
                                  <h6 style={{ margin: 0, color: "#2c3e50", fontWeight: "600" }}>
                                    {notification.title}
                                  </h6>
                                  {!notification.read && (
                                    <Badge 
                                      style={{ 
                                        backgroundColor: "#28a745", 
                                        marginLeft: "10px",
                                        fontSize: "10px"
                                      }}
                                    >
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p style={{ margin: "0 0 10px 0", color: "#6c757d", fontSize: "14px" }}>
                                  {notification.message}
                                </p>
                                <small style={{ color: "#adb5bd" }}>
                                  {formatDateTime(notification.datetime || notification.createdAt)}
                                </small>
                                {/* Producer: Confirm/Reject for waste entry */}
                                {user?.role === 'producer' && notification.type === 'waste_entry' && notification.wasteEntryId && (
                                  <div className="mt-2">
                                    {notification.message.includes('received') ? (
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button size="sm" variant="success" onClick={async () => {
                                          await api.post(`/waste-logging/${notification.wasteEntryId}/verify`, { verified: true });
                                          fetchNotifications();
                                        }}>Confirm</Button>
                                        <Button size="sm" variant="danger" onClick={async () => {
                                          await api.post(`/waste-logging/${notification.wasteEntryId}/verify`, { verified: false, rejectionReason: 'Declined by producer' });
                                          fetchNotifications();
                                        }}>Reject</Button>
                                      </div>
                                    ) : (
                                      <Badge bg={notification.message.includes('confirmed') ? 'success' : notification.message.includes('rejected') ? 'danger' : 'secondary'}>
                                        {notification.message.includes('confirmed') ? 'Confirmed' : notification.message.includes('rejected') ? 'Rejected' : 'Processed'}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {/* Producer: Approve/Reject for fuel request */}
                                {user?.role === 'producer' && notification.type === 'fuel_request' && notification.relatedId && (
                                  <div className="mt-2">
                                    {notification.message.includes('received') ? (
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button size="sm" variant="success" onClick={async () => {
                                          await api.post(`/fuel-requests/${notification.relatedId}/approve`, { approved: true });
                                          fetchNotifications();
                                        }}>Approve</Button>
                                        <Button size="sm" variant="danger" onClick={async () => {
                                          await api.post(`/fuel-requests/${notification.relatedId}/approve`, { approved: false, rejectionReason: 'Declined by producer' });
                                          fetchNotifications();
                                        }}>Reject</Button>
                                      </div>
                                    ) : (
                                      <Badge bg={notification.message.includes('approved') ? 'success' : notification.message.includes('rejected') ? 'danger' : 'secondary'}>
                                        {notification.message.includes('approved') ? 'Approved' : notification.message.includes('rejected') ? 'Rejected' : 'Processed'}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {/* School: Show status badge */}
                                {user?.role === 'school' && notification.type === 'fuel_request' && (
                                  <div className="mt-2">
                                    <Badge bg={notification.message.includes('pending') ? 'warning' : notification.message.includes('approved') ? 'success' : notification.message.includes('rejected') ? 'danger' : 'info'}>
                                      {notification.message.includes('pending') ? 'Pending' : notification.message.includes('approved') ? 'Approved' : notification.message.includes('rejected') ? 'Rejected' : notification.message.includes('delivered') ? 'Delivered' : 'Processing'}
                                    </Badge>
                                  </div>
                                )}
                                {/* Supplier: Show status badge */}
                                {user?.role === 'supplier' && notification.type === 'waste_entry' && (
                                  <div className="mt-2">
                                    <Badge bg={notification.message.includes('pending') ? 'warning' : notification.message.includes('confirmed') ? 'success' : notification.message.includes('rejected') ? 'danger' : 'info'}>
                                      {notification.message.includes('pending') ? 'Pending' : notification.message.includes('confirmed') ? 'Confirmed' : notification.message.includes('rejected') ? 'Rejected' : 'Processing'}
                                    </Badge>
                                  </div>
                                )}
                                {notification.type === 'message' && notification.relatedId && (
                                  <div className="mt-2">
                                    <Button size="sm" variant="info" onClick={() => {
                                      const messageMatch = notification.message.match(/^(.+?):/); 
                                      const senderName = messageMatch ? messageMatch[1].trim() : null;
                                      
                                      if (senderName) {
                                        window.location.href = `/messages?search=${encodeURIComponent(senderName)}`;
                                      } else {
                                        window.location.href = `/messages`;
                                      }
                                    }}>View Message</Button>
                                  </div>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: "8px", marginLeft: "15px" }}>
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    style={{
                                      backgroundColor: "rgba(40, 167, 69, 0.9)",
                                      borderColor: "#28a745",
                                      color: "white",
                                      fontSize: "12px",
                                      padding: "4px 12px",
                                      border: "none"
                                    }}
                                  >
                                    Mark Read
                                  </Button>
                                )}
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  style={{
                                    fontSize: "12px",
                                    padding: "4px 12px"
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Notifications;