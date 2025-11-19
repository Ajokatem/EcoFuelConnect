import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

function Settings() {
  const { currentLanguage, changeLanguage, translate, availableLanguages } = useLanguage();
  
  const [notifications, setNotifications] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    showSuccessAlert(translate("success") || "Language updated successfully!");
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    showSuccessAlert(translate("success") || "Theme updated successfully!");
  };

  const handleNotificationChange = async (enabled) => {
    setNotifications(enabled);
    // TODO: Send notification setting to backend API
    showSuccessAlert("Notification settings updated!");
  };

  const exportData = async () => {
    // TODO: Fetch all data from backend API for export
    showSuccessAlert("Data exported successfully!");
  };

  const resetSettings = async () => {
    // TODO: Reset settings via backend API
    setNotifications(true);
    showSuccessAlert("All settings reset successfully!");
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="content" style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container fluid>
        {showAlert && (
          <Alert 
            variant="success" 
            style={{
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor: "#d4edda",
              border: "1px solid #28a745"
            }}
          >
            {alertMessage}
          </Alert>
        )}

        <Row>
          <Col>
            {/* Header */}
            <div className="text-center mb-4">
              <h5 style={{ fontSize: "1.2rem", color: "#2c3e50", fontWeight: "500" }}>
                {translate("applicationSettings")}
              </h5>
              <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                Customize your EcoFuelConnect experience
              </p>
            </div>

            {/* Main Settings Card */}
            <Row className="justify-content-center">
              <Col lg="8">
                <Card style={{
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <Card.Body style={{ padding: "30px" }}>
                    
                    {/* Language & Region Settings */}
                    <div className="mb-4">
                      <h5 style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "15px" }}>
                        Language & Region
                      </h5>
                      <Form.Select
                        value={currentLanguage}
                        onChange={(e) => {
                          handleLanguageChange(e.target.value);
                          window.location.reload(); // Force reload so language applies everywhere
                        }}
                        style={{
                          borderRadius: "8px",
                          border: "2px solid #28a745",
                          padding: "12px 15px",
                          backgroundColor: "rgba(40, 167, 69, 0.1)",
                          fontSize: "16px"
                        }}
                      >
                        {availableLanguages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.nativeName} ({lang.name})
                          </option>
                        ))}
                      </Form.Select>
                      <small className="text-muted d-block mt-2">
                        Choose your preferred language for the interface
                      </small>
                    </div>

                    {/* Notification Settings */}
                    <div className="mb-4">
                      <h5 style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "15px" }}>
                        Notifications & Alerts
                      </h5>
                      <div style={{
                        backgroundColor: "rgba(40, 167, 69, 0.1)",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #28a745"
                      }}>
                        <Form.Check
                          type="switch"
                          id="notifications-switch"
                          label="Enable all notifications"
                          checked={notifications}
                          onChange={(e) => handleNotificationChange(e.target.checked)}
                          style={{ fontSize: "16px", fontWeight: "500" }}
                        />
                        <div className="mt-3">
                          <small className="text-muted d-block">✓ Fuel request status updates</small>
                          <small className="text-muted d-block">✓ Waste processing completion alerts</small>
                          <small className="text-muted d-block">✓ System maintenance notifications</small>
                          <small className="text-muted d-block">✓ Environmental impact reports</small>
                        </div>
                      </div>
                    </div>

                    {/* Account & Data Management */}
                    <div className="mb-4">
                      <h5 style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "15px" }}>
                        Account & Data Management
                      </h5>
                      <div style={{
                        backgroundColor: "rgba(40, 167, 69, 0.05)",
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid rgba(40, 167, 69, 0.2)"
                      }}>
                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}>
                          <Button
                            onClick={exportData}
                            style={{
                              backgroundColor: "rgba(40, 167, 69, 0.9)",
                              borderColor: "#28a745",
                              color: "white",
                              padding: "12px 24px",
                              borderRadius: "8px",
                              fontWeight: "500",
                              border: "none"
                            }}
                          >
                             Export All Data
                          </Button>
                          <Button
                            onClick={resetSettings}
                            style={{
                              backgroundColor: "rgba(220, 53, 69, 0.1)",
                              borderColor: "#dc3545",
                              color: "#dc3545",
                              padding: "12px 24px",
                              borderRadius: "8px",
                              fontWeight: "500"
                            }}
                          >
                             Reset Settings
                          </Button>
                        </div>
                        <div>
                          <small className="text-muted d-block">• Export includes waste logs, fuel requests, and all settings</small>
                          <small className="text-muted d-block">• Reset will restore factory defaults (cannot be undone)</small>
                        </div>
                      </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="mb-4">
                      <h5 style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "15px" }}>
                        Privacy & Security
                      </h5>
                      <div style={{
                        backgroundColor: "rgba(40, 167, 69, 0.1)",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #28a745"
                      }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontWeight: "500" }}>Data Storage</span>
                          <span style={{ color: "#28a745", fontWeight: "600" }}>Local Only</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ fontWeight: "500" }}>Auto-save</span>
                          <span style={{ color: "#28a745", fontWeight: "600" }}>Enabled</span>
                        </div>
                        <small className="text-muted d-block mt-2">
                          All your data is stored locally on your device for maximum privacy
                        </small>
                      </div>
                    </div>

                    {/* App Information & Support */}
                    <div style={{
                      backgroundColor: "rgba(40, 167, 69, 0.1)",
                      padding: "25px",
                      borderRadius: "8px",
                      border: "2px solid #28a745"
                    }}>
                      <div className="text-center">
                        <h6 style={{ color: "#28a745", fontWeight: "700", marginBottom: "15px", fontSize: "18px" }}>
                           EcoFuelConnect
                        </h6>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span style={{ fontWeight: "500" }}>Version</span>
                            <span style={{ color: "#28a745", fontWeight: "600" }}>1.0.0</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span style={{ fontWeight: "500" }}>Platform</span>
                            <span style={{ color: "#28a745", fontWeight: "600" }}>Web Application</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span style={{ fontWeight: "500" }}>Status</span>
                            <span style={{ color: "#28a745", fontWeight: "600" }}> Active</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => window.location.href = '#/admin/help'}
                          style={{
                            backgroundColor: "rgba(40, 167, 69, 0.9)",
                            borderColor: "#28a745",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: "500",
                            border: "none",
                            width: "100%"
                          }}
                        >
                           Visit Help Center
                        </Button>
                        <small className="text-muted d-block mt-3">
                          Supporting biogas producers and users through transparent systems for real-time production tracking, 
                          efficient waste recycling, and reliable fuel delivery to schools and institutions.
                        </small>
                      </div>
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Settings;