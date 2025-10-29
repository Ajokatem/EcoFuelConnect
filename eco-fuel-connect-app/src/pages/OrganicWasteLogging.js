import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Card, Container, Row, Col, Form, Button, Alert, Table, Badge, Tabs, Tab } from "react-bootstrap";
import wasteService from "../services/wasteService";

function OrganicWasteLogging() {
  const [formData, setFormData] = useState({ type: "", quantity: "", location: "", description: "" });
  const { translate } = useLanguage();
  const [wasteEntries, setWasteEntries] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [activeTab, setActiveTab] = useState("log");
  
  const wasteTypes = [
    { value: "food_scraps", label: "Food Scraps", fuelRatio: 0.8 },
    { value: "market_waste", label: "Market Waste", fuelRatio: 0.7 },
    { value: "restaurant_waste", label: "Restaurant Waste", fuelRatio: 0.9 },
    { value: "agricultural_waste", label: "Agricultural Waste", fuelRatio: 0.6 }
  ];

  useEffect(() => {
    const fetchWasteEntries = async () => {
      try {
        const entries = await wasteService.getWasteEntries();
        setWasteEntries(entries);
      } catch (error) {
        console.error("Error fetching waste entries:", error);
        setWasteEntries([]); // Show empty if backend fails
      }
    };

    fetchWasteEntries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.quantity || !formData.location) {
      setAlertMessage("Please fill in all required fields");
      setAlertType("danger");
      setShowAlert(true);
      return;
    }

    try {
      const selectedType = wasteTypes.find(t => t.value === formData.type);
      const estimatedFuel = selectedType ? (parseFloat(formData.quantity) * selectedType.fuelRatio).toFixed(2) : "0.00";

      const wasteData = {
        producerId: 1, // Default producer ID - you may need to get this from user context
        wasteType: formData.type,
        wasteSource: 'market', // Default source - you may want to add this to the form
        quantity: parseFloat(formData.quantity),
        unit: 'kg',
        notes: formData.description,
        verificationMethod: 'manual_estimate',
        location: formData.location,
        estimatedFuelOutput: estimatedFuel,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const response = await wasteService.createWasteEntry(wasteData);
      const newEntry = response.wasteEntry || response;
      
      // Add the new entry with proper structure for display
      const displayEntry = {
        ...newEntry,
        id: newEntry.id || Date.now(),
        type: formData.type,
        quantity: formData.quantity,
        location: formData.location,
        description: formData.description,
        estimatedFuelOutput: estimatedFuel,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      setWasteEntries(prev => [displayEntry, ...prev]);

      // Automatic dashboard refresh: fetch latest stats from backend and update React state/context
      if (window.dashboardService && window.dashboardService.getDashboardStats) {
        window.dashboardService.getDashboardStats().then(stats => {
          // Update dashboard stats in React state/context (handled in parent/dashboard component)
        });
      }

      // Dispatch custom event to refresh report page
      window.dispatchEvent(new Event('reportRefresh'));

      setFormData({ type: "", quantity: "", location: "", description: "" });
      setAlertMessage("Waste entry logged successfully!");
      setAlertType("success");
      setShowAlert(true);
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error creating waste entry:", error);
      setAlertMessage(error.message || String(error) || "Failed to log waste entry. Please try again.");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  return (
    <div className="content">
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header className="text-center">
                <Card.Title as="h4">{translate("organicWasteLogging") || "Organic Waste Logging"}</Card.Title>
                <p className="card-category">{translate("organicWasteLoggingDesc") || "Track organic waste collection and biogas production efficiently"}</p>
              </Card.Header>
              <Card.Body>
                {/* Button group for tabs */}
                <div className="d-flex justify-content-center mb-3" style={{ gap: "8px" }}>
                  <Button
                    onClick={() => setActiveTab("log")}
                    style={{
                      backgroundColor: activeTab === "log" ? "#28a745" : "#f8f9fa",
                      borderColor: activeTab === "log" ? "#28a745" : "#dee2e6",
                      color: activeTab === "log" ? "white" : "#495057",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      border: "1px solid"
                    }}
                  >
                    {translate("logWaste") || "Log Waste"}
                  </Button>
                  <Button
                    onClick={() => setActiveTab("entries")}
                    style={{
                      backgroundColor: activeTab === "entries" ? "#28a745" : "#f8f9fa",
                      borderColor: activeTab === "entries" ? "#28a745" : "#dee2e6",
                      color: activeTab === "entries" ? "white" : "#495057",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      border: "1px solid"
                    }}
                  >
                    {translate("viewEntries") || "View Entries"}
                  </Button>
                </div>
                {activeTab === "log" && (
                  <Row>
                    <Col md="6">
                      <Card>
                        <Card.Header><Card.Title as="h5">{translate("newEntry") || "New Entry"}</Card.Title></Card.Header>
                        <Card.Body>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                              <Form.Label>{translate("wasteType") || "Waste Type"} *</Form.Label>
                              <div className="d-flex justify-content-between mb-2" style={{ gap: "4px" }}>
                                {wasteTypes.map(type => (
                                  <Button
                                    key={type.value}
                                    onClick={() => setFormData({...formData, type: type.value})}
                                    style={{
                                      backgroundColor: formData.type === type.value ? "#28a745" : "#f8f9fa",
                                      borderColor: formData.type === type.value ? "#28a745" : "#dee2e6",
                                      color: formData.type === type.value ? "white" : "#495057",
                                      borderRadius: "20px",
                                      padding: "4px 8px",
                                      fontSize: "0.75rem",
                                      flex: "1",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {type.label}
                                  </Button>
                                ))}
                              </div>
                              {!formData.type && <div className="text-danger small">{translate("selectWasteType") || "Please select a waste type"}</div>}
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>{translate("quantity") || "Quantity"} (kg) *</Form.Label>
                              <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Enter quantity in kg" min="0.1" step="0.1" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>{translate("location") || "Location"} *</Form.Label>
                              <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter collection location" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>{translate("description") || "Description"}</Form.Label>
                              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Additional details..." />
                            </Form.Group>
                            <Button 
                              type="submit" 
                              className="w-100"
                              style={{
                                backgroundColor: "#28a745",
                                borderColor: "#28a745",
                                color: "white",
                                borderRadius: "20px",
                                padding: "8px 16px"
                              }}
                            >
                              {translate("logWasteEntry") || "Log Waste Entry"}
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card>
                        <Card.Header><Card.Title as="h5">{translate("quickStats") || "Quick Stats"}</Card.Title></Card.Header>
                        <Card.Body>
                          <div className="text-center">
                            <h4 className="text-primary">{wasteEntries.length}</h4>
                            <small>{translate("totalEntries") || "Total Entries"}</small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
                {activeTab === "entries" && (
                  <div>
                    {wasteEntries.length > 0 ? (
                      <Table responsive striped hover>
                        <thead>
                          <tr><th>Date</th><th>Type</th><th>Quantity</th><th>Location</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                          {wasteEntries.map(entry => (
                            <tr key={entry.id}>
                              <td>{new Date(entry.date).toLocaleDateString()}</td>
                              <td>{wasteTypes.find(t => t.value === entry.type)?.label || entry.type}</td>
                              <td>{entry.quantity} kg</td>
                              <td>{entry.location}</td>
                              <td><Badge bg={entry.status === 'processed' ? 'success' : 'warning'}>{entry.status}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-5">
                        <h5>{translate("noEntriesFound") || "No entries found"}</h5>
                        <p>{translate("startLoggingWaste") || "Start by logging your first waste entry!"}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OrganicWasteLogging;
