import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Card, Container, Row, Col, Form, Button, Alert, Table, Badge, Tabs, Tab, Modal } from "react-bootstrap";
import wasteService from "../services/wasteService";
import api from "../services/api";

function OrganicWasteLogging() {
  const [formData, setFormData] = useState({ type: "", quantity: "", location: "", description: "", producerId: "", imageBase64: "" });
  const [producers, setProducers] = useState([]);
  const { translate } = useLanguage();
  const [wasteEntries, setWasteEntries] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [activeTab, setActiveTab] = useState("log");
  const [currentUser, setCurrentUser] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [aiEstimatedWeight, setAiEstimatedWeight] = useState(null);
  
  const wasteTypes = [
    { value: "food_scraps", label: "Food Scraps", fuelRatio: 0.5 },
    { value: "agricultural_residue", label: "Agricultural Residue", fuelRatio: 0.4 },
    { value: "animal_manure", label: "Animal Manure", fuelRatio: 0.6 },
    { value: "mixed_organic", label: "Mixed Organic", fuelRatio: 0.4 }
  ];

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);

    // Auto-capture GPS location on component mount
    captureGPSLocation();

      const fetchWasteEntries = async () => {
      try {
        const response = await wasteService.getWasteEntries();
        console.log('Initial fetch response:', response);
        
        if (response.wasteEntries) {
          setWasteEntries(response.wasteEntries);
        } else if (Array.isArray(response)) {
          setWasteEntries(response);
        } else {
          setWasteEntries([]);
        }
      } catch (error) {
        console.error("Error fetching waste entries:", error);
        setWasteEntries([]);
      }
    };

    const fetchProducers = async () => {
      try {
        // Fetch active producers from backend
        const response = await wasteService.getProducers();
        console.log('Producers fetched:', response);
        setProducers(response.producers || response.users || []);
      } catch (error) {
        console.error('Error fetching producers:', error);
        setAlertMessage('Failed to load producers. Please refresh the page.');
        setAlertType('warning');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setProducers([]);
      }
    };

    fetchWasteEntries();
    fetchProducers();
  }, []);

  const captureGPSLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setGpsLocation(location);
          
          // Use coordinates directly
          setFormData(prev => ({ 
            ...prev, 
            location: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` 
          }));
          
          setLoadingLocation(false);
          setAlertMessage('✓ GPS location captured');
          setAlertType('success');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2000);
        },
        (error) => {
          console.error('GPS Error:', error);
          setLoadingLocation(false);
          setAlertMessage('Unable to get GPS location. Please enable location services.');
          setAlertType('warning');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      );
    } else {
      setAlertMessage('GPS not supported by your browser');
      setAlertType('warning');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "producerId") {
      setFormData(prev => ({ ...prev, producerId: value === "" ? "" : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlertMessage('Please upload an image file');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setAnalyzingImage(true);
    setAlertMessage('🔍 AI analyzing image...');
    setAlertType('info');
    setShowAlert(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setFormData(prev => ({ ...prev, imageBase64: base64 }));
      
      try {
        console.log('Sending image to AI for analysis...');
        const response = await api.post('/image-analysis/estimate-weight', {
          imageBase64: base64,
          wasteType: formData.type || 'organic waste'
        });
        
        console.log('AI Response:', response.data);
        
        if (response.data.success && response.data.estimatedWeight > 0) {
          setAiEstimatedWeight(response.data.estimatedWeight);
          setShowVerificationModal(true);
          setAlertMessage(`✓ AI estimated weight: ${response.data.estimatedWeight} kg - Please verify`);
          setAlertType('info');
        } else {
          setAlertMessage('Could not estimate weight. Please enter manually.');
          setAlertType('info');
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      } catch (error) {
        console.error('Image analysis error:', error);
        console.error('Error details:', error.response?.data || error.message);
        setAlertMessage('Image analysis failed. Please enter weight manually.');
        setAlertType('warning');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAI = (weight) => {
    setFormData(prev => ({ ...prev, quantity: weight.toString() }));
    setShowVerificationModal(false);
    setAlertMessage(`✓ AI weight confirmed: ${weight} kg`);
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleOverrideAI = (manualWeight, reason) => {
    setFormData(prev => ({ ...prev, quantity: manualWeight.toString(), description: prev.description + (reason ? `\n[Override reason: ${reason}]` : '') }));
    setShowVerificationModal(false);
    setAlertMessage(`✓ Manual weight entered: ${manualWeight} kg`);
    setAlertType('warning');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // Validate required fields
    if (!formData.type) {
      setAlertMessage("Please select a waste type");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    if (!formData.quantity || !formData.location) {
      setAlertMessage("Please fill in all required fields");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    if (!formData.producerId || isNaN(formData.producerId)) {
      setAlertMessage("Please select a producer");
      setAlertType("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const selectedType = wasteTypes.find(t => t.value === formData.type);
      const estimatedFuel = selectedType ? (parseFloat(formData.quantity) * selectedType.fuelRatio).toFixed(2) : "0.00";

      // Use selected producerId from form
      const wasteData = {
        producerId: Number(formData.producerId),
        wasteType: formData.type,
        wasteSource: 'market',
        sourceLocation: formData.location,
        quantity: parseFloat(formData.quantity),
        unit: 'kg',
        qualityGrade: 'good',
        verificationMethod: 'manual_estimate',
        notes: formData.description,
        status: 'pending'
      };

      console.log('Sending waste data to backend:', wasteData);
      
      // Send entry to backend
      const response = await wasteService.createWasteEntry(wasteData);
      console.log('Backend response:', response);

      // Immediately fetch updated entries
      const entriesResponse = await wasteService.getWasteEntries();
      console.log('Fetched entries:', entriesResponse);
      
      // Update state with new entries
      if (entriesResponse.wasteEntries) {
        setWasteEntries(entriesResponse.wasteEntries);
      } else if (Array.isArray(entriesResponse)) {
        setWasteEntries(entriesResponse);
      }

      // Reset form and show success with coin reward
      setFormData({ type: "", quantity: "", location: "", description: "", producerId: "", imageBase64: "" });
      setGpsLocation(null);
      
      // Show coin reward if available
      if (response.reward && response.reward.coinsEarned > 0) {
        setAlertMessage(`🎉 Waste logged! You earned ${response.reward.coinsEarned} coins! Total: ${response.reward.totalCoins} coins`);
      } else {
        setAlertMessage("Waste entry logged successfully!");
      }
      setAlertType("success");
      setShowAlert(true);
      
      // Auto-switch to View Entries tab
      setTimeout(() => {
        setActiveTab("entries");
        setShowAlert(false);
      }, 3000);
      
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
                      border: activeTab === "log" ? "1px solid #28a745" : "1px solid #dee2e6",
                      color: activeTab === "log" ? "white" : "#495057",
                      borderRadius: "20px",
                      padding: "8px 16px"
                    }}
                  >
                    {translate("logWaste") || "Log Waste"}
                  </Button>
                  <Button
                    onClick={() => setActiveTab("entries")}
                    style={{
                      backgroundColor: activeTab === "entries" ? "#28a745" : "#f8f9fa",
                      border: activeTab === "entries" ? "1px solid #28a745" : "1px solid #dee2e6",
                      color: activeTab === "entries" ? "white" : "#495057",
                      borderRadius: "20px",
                      padding: "8px 16px"
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
                                        border: formData.type === type.value ? "1px solid #28a745" : "1px solid #dee2e6",
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
                                <Form.Label>📸 Upload Waste Photo (AI will estimate weight)</Form.Label>
                                <Form.Control 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleImageUpload}
                                  disabled={analyzingImage}
                                />
                                {analyzingImage && (
                                  <Form.Text className="text-info">
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    AI analyzing image...
                                  </Form.Text>
                                )}
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>{translate("quantity") || "Quantity"} (kg) *</Form.Label>
                                <Form.Control 
                                  type="number" 
                                  name="quantity" 
                                  value={formData.quantity} 
                                  onChange={handleInputChange} 
                                  placeholder={analyzingImage ? "AI estimating..." : "Enter or AI will estimate"} 
                                  min="0.1" 
                                  step="0.1" 
                                  required 
                                  disabled={analyzingImage}
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>{translate("location") || "Location"} *</Form.Label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <Form.Control 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleInputChange} 
                                    placeholder={loadingLocation ? "Getting GPS location..." : "GPS coordinates"} 
                                    required 
                                    readOnly={!!gpsLocation}
                                    style={{ flex: 1 }}
                                  />
                                  <Button
                                    type="button"
                                    onClick={captureGPSLocation}
                                    disabled={loadingLocation}
                                    style={{
                                      backgroundColor: "#28a745",
                                      border: "1px solid #28a745",
                                      color: "white",
                                      padding: "8px 12px",
                                      fontSize: "0.85rem",
                                      whiteSpace: "nowrap"
                                    }}
                                  >
                                    {loadingLocation ? (
                                      <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                      "Refresh GPS"
                                    )}
                                  </Button>
                                </div>
                                {gpsLocation && (
                                  <Form.Text className="text-success">
                                    ✓ GPS captured (Accuracy: {gpsLocation.accuracy.toFixed(0)}m)
                                  </Form.Text>
                                )}
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>{translate("description") || "Description"}</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Additional details..." />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Send To Producer *</Form.Label>
                                <Form.Select
                                  name="producerId"
                                  value={formData.producerId}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Producer</option>
                                  {producers.map(prod => (
                                    <option key={prod.id} value={prod.id}>
                                      {prod.firstName} {prod.lastName} ({prod.organization || prod.role})
                                    </option>
                                  ))}
                                </Form.Select>
                                {!formData.producerId && <div className="text-danger small">Please select a producer</div>}
                              </Form.Group>
                              <Button 
                                type="submit" 
                                className="w-100"
                                style={{
                                  backgroundColor: "#28a745",
                                  border: "1px solid #28a745",
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
                              <td>{
                                entry.collectionTimestamp
                                  ? new Date(entry.collectionTimestamp).toLocaleDateString()
                                  : (entry.date ? new Date(entry.date).toLocaleDateString() : "Invalid Date")
                              }</td>
                              <td>{wasteTypes.find(t => t.value === (entry.wasteType || entry.type))?.label || entry.wasteType || entry.type}</td>
                              <td>{entry.quantity} kg</td>
                              <td>{typeof entry.sourceLocation === 'string' ? entry.sourceLocation : ''}</td>
                              <td><Badge bg={entry.status === 'processed' ? 'success' : entry.status === 'pending' ? 'warning' : 'secondary'}>{entry.status}</Badge></td>
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

        {/* AI Verification Modal */}
        <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)} centered size="sm">
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '1.1rem' }}>AI Weight Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              <h5 className="mb-1">{aiEstimatedWeight} kg</h5>
              <small className="text-muted">AI Estimated Weight</small>
            </div>
            <Button 
              variant="success" 
              size="sm"
              className="w-100 mb-2" 
              onClick={() => handleConfirmAI(aiEstimatedWeight)}
            >
              Confirm
            </Button>
            <div className="text-center my-2">
              <small className="text-muted">or</small>
            </div>
            <Form.Group className="mb-2">
              <Form.Control
                type="number"
                step="0.1"
                min="0.1"
                size="sm"
                id="manualWeightInput"
                placeholder="Enter manual weight (kg)"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={1}
                size="sm"
                id="overrideReasonInput"
                placeholder="Reason (optional)"
              />
            </Form.Group>
            <Button 
              variant="outline-secondary" 
              size="sm"
              className="w-100" 
              onClick={() => {
                const manualWeight = document.getElementById('manualWeightInput').value;
                const reason = document.getElementById('overrideReasonInput').value;
                if (manualWeight && parseFloat(manualWeight) > 0) {
                  handleOverrideAI(parseFloat(manualWeight), reason);
                } else {
                  alert('Please enter a valid weight');
                }
              }}
            >
              Override
            </Button>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default OrganicWasteLogging;
