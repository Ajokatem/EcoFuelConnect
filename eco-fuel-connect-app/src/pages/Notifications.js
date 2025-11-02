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
    let url = "/api/notifications";
    // If not running with proxy, fallback to absolute backend URL
    if (window.location.port === "3000") {
      url = "http://localhost:5000/api/notifications";
    }
    try {
      const res = await fetch(url, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched notifications from API:", data);
        setNotifications(data);
      } else {
        console.log("API response not ok", res.status);
      }
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
      await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      fetchNotifications();
    } catch (err) {}
  };

  // Delete notification (backend + local state)
  const deleteNotification = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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

  // Role-based notification filtering
  let filteredNotifications = [];
  if (user) {
    if (user.role === "producer") {
      // Producers see all notifications
      filteredNotifications = notifications;
    } else {
      // School/Supplier see only their own notifications
      filteredNotifications = notifications.filter(n => n.userId === user.id);
    }
    // Apply read/unread filter
    if (filter === "unread") {
      filteredNotifications = filteredNotifications.filter(n => !(n.isRead || n.read));
    }
  }
  console.log("Filtered notifications for user", user?.id, user?.role, filteredNotifications);

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
                                {/* Approve/Decline for waste entry notifications */}
                                {notification.type === 'waste_entry' && notification.wasteEntryId && (
                                  <div className="mt-2" style={{ display: 'flex', gap: '8px' }}>
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={async () => {
                                        await fetch(`/api/waste-logging/${notification.wasteEntryId}/verify`, {
                                          method: 'POST',
                                          credentials: 'include',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ verified: true })
                                        });
                                        fetchNotifications();
                                      }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={async () => {
                                        await fetch(`/api/waste-logging/${notification.wasteEntryId}/verify`, {
                                          method: 'POST',
                                          credentials: 'include',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ verified: false, rejectionReason: 'Declined by producer' })
                                        });
                                        fetchNotifications();
                                      }}
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                )}
                                {/* Link to message for message notifications */}
                                {notification.type === 'message' && notification.relatedId && (
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="info"
                                      onClick={() => {
                                        // Parse senderId from metadata for direct chat opening
                                        let userId = null;
                                        try {
                                          const meta = notification.metadata ? JSON.parse(notification.metadata) : {};
                                          userId = meta.senderId && meta.senderId !== user.id ? meta.senderId : meta.receiverId;
                                        } catch {}
                                        if (userId) {
                                          window.location.href = `/messages?userId=${userId}`;
                                        } else {
                                          window.location.href = `/messages`;
                                        }
                                      }}
                                    >
                                      View Message
                                    </Button>
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