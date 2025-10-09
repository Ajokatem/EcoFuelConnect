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

  const initialNotifications = [
    {
      id: 1,
      title: "Fuel Request Approved",
      message: "Your biogas request #FR123456 has been approved and is being processed.",
      datetime: new Date(),
      read: false,
    },
    {
      id: 2,
      title: "Waste Processing Complete",
      message: "5.2 kg of organic waste has been successfully converted to 3.1 liters of biogas.",
      datetime: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "System maintenance scheduled for tonight 11 PM - 3 AM.",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: 4,
      title: "Storage Capacity Warning",
      message: "Waste storage is 95% full. Please schedule collection.",
      datetime: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
    },
    {
      id: 5,
      title: "Monthly Goal Achieved",
      message: "You've successfully converted 50kg of waste this month!",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
  ];

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const formatDateTime = (datetime) => {
    const now = new Date();
    const date = new Date(datetime);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notification) => {
    return filter === "all" || (filter === "unread" && !notification.read);
  });

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
            </div>

            {/* Filter Buttons */}
            <div className="d-flex justify-content-center mb-4">
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  onClick={() => setFilter("all")}
                  style={{
                    backgroundColor: filter === "all" ? "rgba(40, 167, 69, 0.9)" : "rgba(255, 255, 255, 0.1)",
                    borderColor: "#28a745",
                    color: filter === "all" ? "white" : "#28a745",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "2px solid #28a745"
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

            {/* Notifications List */}
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">No notifications</h5>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
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
                          {formatDateTime(notification.datetime)}
                        </small>
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
                ))
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Notifications;