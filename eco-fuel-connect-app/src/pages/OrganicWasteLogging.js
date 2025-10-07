import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Form, Button, Alert, Table, Badge, Tabs, Tab } from "react-bootstrap";

function OrganicWasteLogging() {
  const [formData, setFormData] = useState({ type: "", quantity: "", location: "", description: "" });
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
    const saved = localStorage.getItem("wasteEntries");
    if (saved) setWasteEntries(JSON.parse(saved));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.quantity || !formData.location) {
      setAlertMessage("Please fill in all required fields");
      setAlertType("danger");
      setShowAlert(true);
      return;
    }

    const selectedType = wasteTypes.find(t => t.value === formData.type);
    const estimatedFuel = selectedType ? (parseFloat(formData.quantity) * selectedType.fuelRatio).toFixed(2) : "0.00";

    const newEntry = {
      id: Date.now(),
      ...formData,
      estimatedFuelOutput: estimatedFuel,
      date: new Date().toISOString().split("T")[0],
      status: "pending"
    };

    const updatedEntries = [...wasteEntries, newEntry];
    setWasteEntries(updatedEntries);
    localStorage.setItem("wasteEntries", JSON.stringify(updatedEntries));

    setFormData({ type: "", quantity: "", location: "", description: "" });
    setAlertMessage("Waste entry logged successfully!");
    setAlertType("success");
    setShowAlert(true);
  };

  return (
    <div className="content">
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header className="text-center">
                <Card.Title as="h4">Organic Waste Logging</Card.Title>
                <p className="card-category">Track organic waste collection and biogas production efficiently</p>
              </Card.Header>
            </Card>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant={alertType} className="mb-4" dismissible onClose={() => setShowAlert(false)}>
            {alertMessage}
          </Alert>
        )}

        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                  <Tab eventKey="log" title="Log Waste">
                    <Row>
                      <Col md="6">
                        <Card>
                          <Card.Header><Card.Title as="h5">New Entry</Card.Title></Card.Header>
                          <Card.Body>
                            <Form onSubmit={handleSubmit}>
                              <Form.Group className="mb-3">
                                <Form.Label>Waste Type *</Form.Label>
                                <Form.Select name="type" value={formData.type} onChange={handleInputChange} required>
                                  <option value="">Select waste type...</option>
                                  {wasteTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Quantity (kg) *</Form.Label>
                                <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Enter quantity in kg" min="0.1" step="0.1" required />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Location *</Form.Label>
                                <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter collection location" required />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Additional details..." />
                              </Form.Group>
                              <Button variant="success" type="submit" className="w-100">Log Waste Entry</Button>
                            </Form>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md="6">
                        <Card>
                          <Card.Header><Card.Title as="h5">Quick Stats</Card.Title></Card.Header>
                          <Card.Body>
                            <div className="text-center">
                              <h4 className="text-primary">{wasteEntries.length}</h4>
                              <small>Total Entries</small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="entries" title="View Entries">
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
                        <h5>No entries found</h5>
                        <p>Start by logging your first waste entry!</p>
                      </div>
                    )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OrganicWasteLogging;
