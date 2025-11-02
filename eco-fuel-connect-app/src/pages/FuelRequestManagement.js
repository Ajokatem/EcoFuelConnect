import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Modal,
  Badge
} from "react-bootstrap";
import fuelService from "../services/fuelService";
import userService from "../services/userService";

function FuelRequestManagement() {
  const { user } = useUser();
  // Route guard: Only allow schools and producers
  if (user && user.role !== 'school' && user.role !== 'producer') {
    return (
      <div className="content" style={{ minHeight: "100vh", padding: "30px", backgroundColor: "#f8f9fa" }}>
        <Container fluid>
          <div className="text-center py-5">
            <h2 className="text-danger">Access Denied</h2>
            <p className="text-muted">You do not have permission to view this page.</p>
          </div>
        </Container>
      </div>
    );
  }
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    fuelType: '',
    quantity: '',
    deliveryAddress: '',
    preferredDate: '',
    urgency: 'normal',
    purpose: '',
    contactNumber: '',
    additionalNotes: '',
    producerId: ''
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [fuelRequests, setFuelRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    delivered: 0
  });
  const [producers, setProducers] = useState([]);

  const fuelTypes = [
    { 
      value: 'biogas', 
      label: 'Biogas', 
      price: 0.8, 
      unit: 'cubic meter',
      description: 'Clean burning gas for cooking and heating'
    },
    { 
      value: 'biomethane', 
      label: 'Biomethane', 
      price: 1.2, 
      unit: 'liter',
      description: 'Refined biogas suitable for vehicles'
    },
    { 
      value: 'bioethanol', 
      label: 'Bioethanol', 
      price: 1.5, 
      unit: 'liter',
      description: 'Alcohol-based fuel for vehicles'
    },
    { 
      value: 'bio_diesel', 
      label: 'Bio-Diesel', 
      price: 1.8, 
      unit: 'liter',
      description: 'Diesel alternative from organic sources'
    }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'success', description: 'Flexible delivery timeline' },
    { value: 'normal', label: 'Normal', color: 'secondary', description: 'Standard processing time' },
    { value: 'medium', label: 'Medium Priority', color: 'warning', description: 'Expedited processing needed' },
    { value: 'high', label: 'High Priority', color: 'danger', description: 'Urgent delivery required' }
  ];

  useEffect(() => {
    loadFuelRequests();
    loadProducers();
  }, []);
  const loadProducers = async () => {
    try {
      const result = await userService.getActiveProducers();
      setProducers(result || []);
    } catch (error) {
      setProducers([]);
    }
  };
  
  useEffect(() => {
    calculateStats();
  }, [fuelRequests]);

  const loadFuelRequests = async () => {
    try {
      const response = await fuelService.getFuelRequests();
      // Map backend data to frontend display format
      const mappedRequests = (response.requests || []).map(r => {
        const selectedFuel = fuelTypes.find(fuel => fuel.value === r.fuelType);
        return {
          id: r.id,
          requestNumber: r.requestId || r.requestNumber || `REQ-${r.id}`,
          status: r.status,
          fuelType: r.fuelType,
          fuelTypeLabel: selectedFuel ? selectedFuel.label : r.fuelType,
          quantity: r.quantityRequested,
          unit: r.unit,
          estimatedCost: selectedFuel && r.quantityRequested ? (parseFloat(r.quantityRequested) * selectedFuel.price).toFixed(2) : '0.00',
          preferredDate: r.preferredDeliveryDate || r.preferredDate,
          dateRequested: r.dateRequested || r.createdAt,
          deliveryAddress: typeof r.deliveryAddress === 'string' ? r.deliveryAddress : (r.deliveryAddress?.address || ''),
          urgency: r.priority || r.urgencyLevel || 'normal',
          purpose: r.contactPerson || r.purpose,
          contactNumber: r.contactPhone || r.contactNumber,
          additionalNotes: r.notes || r.additionalNotes,
          producerId: r.producerId,
          producerName: r.producer?.organization || r.producer?.firstName || ''
        };
      });
      setFuelRequests(mappedRequests);
    } catch (error) {
      setFuelRequests([]); // Show empty if backend fails
    }
  };

  const calculateStats = () => {
    // Calculate stats from fuelRequests state
    const newStats = {
      totalRequests: fuelRequests.length,
      pending: fuelRequests.filter(r => r.status === 'pending').length,
      approved: fuelRequests.filter(r => r.status === 'approved').length,
      delivered: fuelRequests.filter(r => r.status === 'delivered').length
    };
    setStats(newStats);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fuelType) newErrors.fuelType = 'Please select fuel type';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Please enter valid quantity';
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Please enter delivery address';
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select preferred date';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Please enter contact number';
    if (!formData.purpose.trim()) newErrors.purpose = 'Please specify purpose of fuel';
    if (!formData.producerId) newErrors.producerId = 'Please select a producer';
    // Validate phone number format
    if (formData.contactNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }
    // Validate future date
    if (formData.preferredDate && new Date(formData.preferredDate) < new Date()) {
      newErrors.preferredDate = 'Please select a future date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCost = () => {
    const selectedFuel = fuelTypes.find(fuel => fuel.value === formData.fuelType);
    if (!selectedFuel || !formData.quantity) return '0.00';
    return (parseFloat(formData.quantity) * selectedFuel.price).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setAlertType('danger');
      setAlertMessage('You must be logged in to submit a fuel request. Please log in and try again.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    if (!validateForm()) {
      setAlertType('danger');
      setAlertMessage('Please fix the errors in the form before submitting.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    try {
      const selectedFuel = fuelTypes.find(fuel => fuel.value === formData.fuelType);
      // Get user ID from context
      const requestData = {
        fuelType: formData.fuelType,
        quantityRequested: parseFloat(formData.quantity),
        unit: selectedFuel ? selectedFuel.unit : 'units',
        deliveryAddress: formData.deliveryAddress,
        preferredDeliveryDate: formData.preferredDate,
        priority: formData.urgency,
        notes: formData.additionalNotes,
        contactPerson: formData.purpose,
        contactPhone: formData.contactNumber,
        schoolId: user.id,
        producerId: formData.producerId
      };

      const newRequest = await fuelService.createFuelRequest(requestData);

      // Add proper display data
      const displayRequest = {
        ...newRequest,
        id: newRequest.id || Date.now(),
        requestNumber: newRequest.requestNumber || `REQ-${Date.now()}`,
        status: 'pending',
        dateRequested: new Date().toISOString(),
        fuelTypeLabel: selectedFuel ? selectedFuel.label : formData.fuelType,
        unit: selectedFuel ? selectedFuel.unit : 'units',
        producerName: producers.find(p => p.id === formData.producerId)?.name || ''
      };

      setFuelRequests(prev => [displayRequest, ...prev]);

      // Automatic dashboard refresh: fetch latest stats from backend and update React state/context
      if (window.dashboardService && window.dashboardService.getDashboardStats) {
        window.dashboardService.getDashboardStats().then(stats => {
          // Update dashboard stats in React state/context (handled in parent/dashboard component)
        });
      }

      // Dispatch custom event to refresh report page
      window.dispatchEvent(new Event('reportRefresh'));

      // Reset form
      setFormData({
        fuelType: '',
        quantity: '',
        deliveryAddress: '',
        preferredDate: '',
        urgency: 'normal',
        purpose: '',
        contactNumber: '',
        additionalNotes: '',
        producerId: ''
      });

      setAlertType('success');
      setAlertMessage(`Fuel request submitted successfully! Request ID: ${displayRequest.requestNumber}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);

      // Refresh data
      calculateStats();

    } catch (error) {
      console.error('Fuel request error:', error);
      setAlertType('danger');
      setAlertMessage(error.message || String(error) || 'Failed to submit fuel request. Please try again.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#17a2b8';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const selectedFuelType = fuelTypes.find(fuel => fuel.value === formData.fuelType);

  return (
    <div className="content" style={{ minHeight: "100vh", padding: "30px", backgroundColor: "#f8f9fa" }}>
      <Container fluid>
        {showAlert && (
          <div style={{
            backgroundColor: alertType === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${alertType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: "12px",
            padding: "15px 20px",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "500"
          }}>
            <span style={{ marginRight: "10px", fontSize: "20px" }}>
              {alertType === 'success' ? '✅' : '❌'}
            </span>
            {alertType === 'success' ? (translate("fuelRequestSuccess") || alertMessage) : (translate("fuelRequestError") || alertMessage)}
          </div>
        )}

        {/* Beautiful Header */}
        <div className="text-center mb-5">
          <h1 className="text-dark mb-3" style={{ fontWeight: "800", fontSize: "1.8rem" }}>
            {translate("fuelRequestManagement") || "Fuel Request Center"}
          </h1>
          <p className="text-muted" style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
            {translate("fuelRequestDesc") || "Request eco-friendly fuel for your needs. From biogas to bio-diesel, we've got sustainable energy solutions for you."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-4">
          <Row>
            <Col lg="12">
              <div style={{
                padding: "10px",
                boxShadow: "0 4px 20px rgba(40, 167, 69, 0.1)",
                border: "1px solid #e8f5e8"
              }}>
                <div className="d-flex justify-content-center">
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => setActiveTab('create')}
                      style={{
                        padding: "15px 30px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: activeTab === 'create' ? '#28a745' : 'transparent',
                        color: activeTab === 'create' ? 'white' : '#6c757d',
                        fontWeight: "600",
                        fontSize: "16px",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      New Request
                    </button>
                    <button
                      onClick={() => setActiveTab('manage')}
                      style={{
                        padding: "15px 30px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: activeTab === 'manage' ? '#28a745' : 'transparent',
                        color: activeTab === 'manage' ? 'white' : '#6c757d',
                        fontWeight: "600",
                        fontSize: "16px",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Manage Requests
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Beautiful Tab Content */}
        {activeTab === 'create' && (
          <Row className="justify-content-center">
            <Col lg="10">
              <div style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 8px 30px rgba(40, 167, 69, 0.1)",
                border: "1px solid #e8f5e8"
              }}>
                <div className="text-center mb-4">
                  <h4 style={{ color: "#2c3e50", fontWeight: "700", marginBottom: "10px" }}>
                    Create New Fuel Request
                  </h4>
                  <p style={{ color: "#6c757d", fontSize: "16px" }}>
                    Fill out the form below to request eco-friendly fuel delivery
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Fuel Type Selection */}
                    <Col lg="6" className="mb-4">
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e9ecef"
                      }}>
                        <h5 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "600" }}>
                          Fuel Selection
                        </h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                            Fuel Type *
                          </Form.Label>
                          <Form.Select
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleInputChange}
                            isInvalid={!!errors.fuelType}
                            style={{
                              borderRadius: "10px",
                              border: "2px solid #e9ecef",
                              padding: "12px 16px",
                              fontSize: "15px"
                            }}
                          >
                            <option value="">Select fuel type...</option>
                            {fuelTypes.map(fuel => (
                              <option key={fuel.value} value={fuel.value}>
                                {fuel.label} - ${fuel.price}/{fuel.unit}
                              </option>
                            ))}
                          </Form.Select>
                          {errors.fuelType && (
                            <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                              {errors.fuelType}
                            </div>
                          )}
                          {selectedFuelType && (
                            <div style={{
                              backgroundColor: "#e8f5e8",
                              borderRadius: "8px",
                              padding: "15px",
                              marginTop: "15px",
                              border: "1px solid #28a745"
                            }}>
                              <h6 style={{ color: "#28a745", marginBottom: "8px" }}>Selected Fuel Details</h6>
                              <p style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>
                                {selectedFuelType.description}
                              </p>
                              <small style={{ color: "#28a745", fontWeight: "600" }}>
                                Price: ${selectedFuelType.price} per {selectedFuelType.unit}
                              </small>
                            </div>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                            Quantity *
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="quantity"
                              value={formData.quantity}
                              onChange={handleInputChange}
                              placeholder="Enter quantity"
                              isInvalid={!!errors.quantity}
                              style={{
                                borderRadius: "10px 0 0 10px",
                                border: "2px solid #e9ecef",
                                padding: "12px 16px",
                                fontSize: "15px"
                              }}
                            />
                            <InputGroup.Text style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "2px solid #28a745",
                              borderRadius: "0 10px 10px 0",
                              fontWeight: "600"
                            }}>
                              {selectedFuelType ? selectedFuelType.unit : 'units'}
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.quantity && (
                            <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                              {errors.quantity}
                            </div>
                          )}
                          {formData.quantity && selectedFuelType && (
                            <div style={{
                              backgroundColor: "#e3f2fd",
                              borderRadius: "8px",
                              padding: "10px",
                              marginTop: "10px",
                              textAlign: "center"
                            }}>
                              <strong style={{ color: "#17a2b8", fontSize: "16px" }}>
                                Estimated Cost: ${calculateCost()}
                              </strong>
                            </div>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    {/* Producer Selection */}
                    <Col lg="6" className="mb-4">
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e9ecef"
                      }}>
                        <h5 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "600" }}>
                          Select Producer *
                        </h5>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                            Producer
                          </Form.Label>
                          <Form.Select
                            name="producerId"
                            value={formData.producerId}
                            onChange={handleInputChange}
                            isInvalid={!!errors.producerId}
                            style={{
                              borderRadius: "10px",
                              border: "2px solid #e9ecef",
                              padding: "12px 16px",
                              fontSize: "15px"
                            }}
                          >
                            <option value="">Select Producer</option>
                            {producers.map(prod => (
                              <option key={prod.id} value={prod.id}>
                                {prod.firstName} {prod.lastName} ({prod.organization || prod.role})
                              </option>
                            ))}
                          </Form.Select>
                          {errors.producerId && (
                            <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                              {errors.producerId}
                            </div>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    {/* Delivery Details */}
                    <Col lg="6" className="mb-4">
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e9ecef"
                      }}>
                        <h5 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "600" }}>
                          Delivery Details
                        </h5>
                        {/* ...existing code... */}
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                            Delivery Address *
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="deliveryAddress"
                            value={formData.deliveryAddress}
                            onChange={handleInputChange}
                            placeholder="Enter complete delivery address with landmarks..."
                            isInvalid={!!errors.deliveryAddress}
                            style={{
                              borderRadius: "10px",
                              border: "2px solid #e9ecef",
                              padding: "12px 16px",
                              fontSize: "15px",
                              resize: "vertical"
                            }}
                          />
                          {errors.deliveryAddress && (
                            <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                              {errors.deliveryAddress}
                            </div>
                          )}
                        </Form.Group>
                        {/* ...existing code... */}
                        <Row>
                          <Col md="6">
                            <Form.Group className="mb-3">
                              <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                                Preferred Date *
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                isInvalid={!!errors.preferredDate}
                                style={{
                                  borderRadius: "10px",
                                  border: "2px solid #e9ecef",
                                  padding: "12px 16px",
                                  fontSize: "15px"
                                }}
                              />
                              {errors.preferredDate && (
                                <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                                  {errors.preferredDate}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md="6">
                            <Form.Group className="mb-3">
                              <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                                Contact Number *
                              </Form.Label>
                              <Form.Control
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                isInvalid={!!errors.contactNumber}
                                style={{
                                  borderRadius: "10px",
                                  border: "2px solid #e9ecef",
                                  padding: "12px 16px",
                                  fontSize: "15px"
                                }}
                              />
                              {errors.contactNumber && (
                                <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                                  {errors.contactNumber}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    {/* Additional Details */}
                    <Col lg="6" className="mb-4">
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "20px",
                        border: "2px solid #e9ecef"
                      }}>
                        <h5 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "600" }}>
                          Additional Information
                        </h5>
                        {/* ...existing code... */}
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                            Purpose of Fuel *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            placeholder="e.g., Cooking, Heating, Vehicle fuel..."
                            isInvalid={!!errors.purpose}
                            style={{
                              borderRadius: "10px",
                              border: "2px solid #e9ecef",
                              padding: "12px 16px",
                              fontSize: "15px"
                            }}
                          />
                          {errors.purpose && (
                            <div style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
                              {errors.purpose}
                            </div>
                          )}
                        </Form.Group>
                        {/* ...existing code... */}
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600", color: "#495057", marginBottom: "10px" }}>
                            Priority Level
                          </Form.Label>
                          <Form.Select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleInputChange}
                            style={{
                              borderRadius: "10px",
                              border: "2px solid #e9ecef",
                              padding: "8px 12px",
                              fontSize: "14px",
                              maxWidth: "100%",
                              width: "100%"
                            }}
                          >
                            {urgencyLevels.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label} - {level.description}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg="6" className="mb-4">
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                        padding: "25px",
                        border: "2px solid #e9ecef"
                      }}>
                        <h5 style={{ color: "#2c3e50", marginBottom: "20px", fontWeight: "600" }}>
                          Additional Notes
                        </h5>
                        {/* ...existing code... */}
                        <Form.Group className="mb-3">
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            placeholder="Any special instructions, delivery preferences, or additional information..."
                            style={{
                              borderRadius: "10px",
                              border: "2px solid #e9ecef",
                              padding: "12px 16px",
                              fontSize: "15px",
                              resize: "vertical"
                            }}
                          />
                        </Form.Group>
                        {/* ...existing code... */}
                        <div className="text-center mt-4">
                          <Button
                            type="submit"
                            style={{
                              backgroundColor: "#28a745",
                              border: "none",
                              borderRadius: "12px",
                              padding: "15px 40px",
                              fontSize: "18px",
                              fontWeight: "600",
                              boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                              transition: "all 0.3s ease"
                            }}
                          >
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        )}

        {/* Manage Requests Tab */}
        {activeTab === 'manage' && (
          <Row className="justify-content-center">
            <Col lg="12">
              <div style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 8px 30px rgba(40, 167, 69, 0.1)",
                border: "1px solid #e8f5e8"
              }}>
                <div className="text-center mb-4">
                  <h4 style={{ color: "#2c3e50", fontWeight: "700", marginBottom: "10px" }}>
                    My Fuel Requests
                  </h4>
                  <p style={{ color: "#6c757d", fontSize: "16px" }}>
                    Track and manage all your fuel requests in one place
                  </p>
                </div>

                {fuelRequests.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "15px"
                  }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>⛽</div>
                    <h4 style={{ color: "#6c757d", marginBottom: "10px" }}>No fuel requests yet</h4>
                    <p style={{ color: "#adb5bd" }}>Create your first fuel request to get started</p>
                    <Button
                      onClick={() => setActiveTab('create')}
                      style={{
                        backgroundColor: "#28a745",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px 30px",
                        fontWeight: "600",
                        marginTop: "20px"
                      }}
                    >
                      Create New Request
                    </Button>
                  </div>
                ) : (
                  <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                    {fuelRequests.map((request, index) => (
                      <div
                        key={request.id}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "15px",
                          padding: "25px",
                          marginBottom: "20px",
                          border: "2px solid #e9ecef",
                          transition: "transform 0.2s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}
                        onClick={() => viewRequestDetails(request)}
                      >
                        <Row className="align-items-center">
                          <Col md="2" className="text-center">
                            <Badge
                              style={{
                                backgroundColor: getStatusColor(request.status),
                                fontSize: "12px",
                                padding: "6px 12px",
                                borderRadius: "20px"
                              }}
                            >
                              {request.status.toUpperCase()}
                            </Badge>
                          </Col>
                          <Col md="6">
                            <h5 style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "8px" }}>
                              {request.fuelTypeLabel} - {request.quantity} {request.unit}
                            </h5>
                            <p style={{ color: "#6c757d", margin: "0", fontSize: "14px" }}>
                              Request #{request.requestNumber}
                            </p>
                            <p style={{ color: "#6c757d", margin: "0", fontSize: "14px" }}>
                              {new Date(request.preferredDate).toLocaleDateString()}
                            </p>
                          </Col>
                          <Col md="2" className="text-center">
                            <h4 style={{ color: "#28a745", fontWeight: "700", margin: "0" }}>
                              ${request.estimatedCost}
                            </h4>
                            <small style={{ color: "#6c757d" }}>Estimated</small>
                          </Col>
                          <Col md="2" className="text-center">
                            <Button
                              variant="outline-success"
                              size="sm"
                              style={{ fontWeight: "600" }}
                            >
                              View Details
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )}

        {/* Request Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header 
            closeButton 
            style={{ 
              backgroundColor: "#28a745", 
              color: "white",
              borderRadius: "15px 15px 0 0"
            }}
          >
            <Modal.Title>
              Request Details - #{selectedRequest?.requestNumber}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px" }}>
            {selectedRequest && (
              <Row>
                <Col md="6">
                  <h6 style={{ color: "#28a745", fontWeight: "600", marginBottom: "15px" }}>
                    Fuel Information
                  </h6>
                  <p><strong>Type:</strong> {selectedRequest.fuelTypeLabel}</p>
                  <p><strong>Quantity:</strong> {selectedRequest.quantity} {selectedRequest.unit}</p>
                  <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
                  <p><strong>Estimated Cost:</strong> ${selectedRequest.estimatedCost}</p>
                  <p><strong>Producer:</strong> {selectedRequest.producerName || (producers.find(p => p.id === selectedRequest.producerId)?.name || '')}</p>
                </Col>
                <Col md="6">
                  <h6 style={{ color: "#28a745", fontWeight: "600", marginBottom: "15px" }}>
                    Delivery Information
                  </h6>
                  <p><strong>Address:</strong><br/>{selectedRequest.deliveryAddress}</p>
                  <p><strong>Preferred Date:</strong> {new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
                  <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
                  <p><strong>Priority:</strong> 
                    <Badge 
                      bg={urgencyLevels.find(u => u.value === selectedRequest.urgency)?.color || 'secondary'}
                      className="ms-2"
                    >
                      {urgencyLevels.find(u => u.value === selectedRequest.urgency)?.label}
                    </Badge>
                  </p>
                </Col>
                {selectedRequest.additionalNotes && (
                  <Col md="12" className="mt-3">
                    <h6 style={{ color: "#28a745", fontWeight: "600", marginBottom: "15px" }}>
                      Additional Notes
                    </h6>
                    <p style={{ 
                      backgroundColor: "#f8f9fa", 
                      padding: "15px", 
                      borderRadius: "10px",
                      fontStyle: "italic" 
                    }}>
                      {selectedRequest.additionalNotes}
                    </p>
                  </Col>
                )}
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "1px solid #e9ecef", padding: "20px 30px" }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)}
              style={{ borderRadius: "8px", fontWeight: "600" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default FuelRequestManagement;