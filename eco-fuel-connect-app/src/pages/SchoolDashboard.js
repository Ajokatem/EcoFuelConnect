import React, { useEffect, useState } from "react";
import '../assets/css/dashboard-responsive.css';
import { useLanguage } from "../contexts/LanguageContext";
import { useHistory } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import dashboardService from "../services/dashboardService";

function SchoolDashboard() {
  const history = useHistory();
  const { translate } = useLanguage();
  const [stats, setStats] = useState({
    totalFuelRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    deliveredFuel: 0,
    monthlyConsumption: 0,
    costSavings: 0,
    carbonOffset: 0,
    studentsBenefited: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardStats();
      setStats({
        totalFuelRequests: data.fuelRequests || 0,
        pendingRequests: Math.floor(data.fuelRequests * 0.2) || 0,
        approvedRequests: Math.floor(data.fuelRequests * 0.8) || 0,
        deliveredFuel: data.fuelDelivered || 0,
        monthlyConsumption: data.fuelDelivered * 0.3 || 0,
        costSavings: (data.fuelDelivered * 150) || 0,
        carbonOffset: (data.fuelDelivered * 2.3) || 0,
        studentsBenefited: 450,
      });
    } catch (error) {
      console.error("Error fetching school dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* School Header */}
      <Row className="mb-4">
        <Col md={8}>
          <Card style={{ 
            background: "linear-gradient(135deg, #4fbe99ff, #6aaf99ff)", 
            color: "white",
            borderRadius: "16px",
            border: "none"
          }}>
            <Card.Body className="p-4">
              <h6 className="text-white-50 mb-2">Total Fuel Delivered</h6>
              <h2 className="mb-1" style={{ fontSize: "2.5rem", fontWeight: "600" }}>
                {stats.deliveredFuel.toFixed(2)} m³
              </h2>
              <div className="d-flex align-items-center">
                <span className="text-white-50 me-2">Clean biogas fuel</span>
                <span className="badge bg-success bg-opacity-25 text-white">
                  ↗ Active School
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ borderRadius: "16px", border: "1px solid #e5e7eb", height: "100%" }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              <h6 className="text-muted mb-2">Students Benefited</h6>
              <h3 className="mb-1" style={{ color: "#059669" }}>
                {stats.studentsBenefited}
              </h3>
              <small className="text-success">Access to clean energy</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dbeafe" }}>
                  <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Total Requests</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.totalFuelRequests}</h3>
                </div>
              </div>
              <small className="text-primary">↗ Fuel requests</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#fef3c7" }}>
                  <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Pending</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.pendingRequests}</h3>
                </div>
              </div>
              <small className="text-warning">↗ Awaiting approval</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dcfce7" }}>
                  <svg width="24" height="24" fill="#16a34a" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Cost Savings</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>SSP {stats.costSavings.toFixed(0)}</h3>
                </div>
              </div>
              <small className="text-success">↗ vs traditional fuel</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#e0e7ff" }}>
                  <svg width="24" height="24" fill="#6366f1" viewBox="0 0 24 24">
                    <path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Carbon Offset</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.carbonOffset.toFixed(0)} kg</h3>
                </div>
              </div>
              <small className="text-info">↗ CO₂ reduced</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-4">Recent Fuel Requests</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#FR-2024-001</td>
                    <td>Today</td>
                    <td>50 m³</td>
                    <td><Badge bg="success">Approved</Badge></td>
                    <td>Tomorrow</td>
                  </tr>
                  <tr>
                    <td>#FR-2024-002</td>
                    <td>Yesterday</td>
                    <td>45 m³</td>
                    <td><Badge bg="warning">Pending</Badge></td>
                    <td>TBD</td>
                  </tr>
                  <tr>
                    <td>#FR-2024-003</td>
                    <td>2 days ago</td>
                    <td>60 m³</td>
                    <td><Badge bg="info">Delivered</Badge></td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>#FR-2024-004</td>
                    <td>3 days ago</td>
                    <td>55 m³</td>
                    <td><Badge bg="info">Delivered</Badge></td>
                    <td>Completed</td>
                  </tr>
                </tbody>
              </Table>
              <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={() => history.push('/admin/fuel-request-management')}
                style={{ borderRadius: "8px" }}
              >
                <i className="nc-icon nc-delivery-fast me-2"></i>
                Submit New Fuel Request
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <Card.Body>
              <h6 className="mb-3">Monthly Consumption</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-sm">Target: 200 m³</span>
                  <span className="text-sm">{((stats.monthlyConsumption / 200) * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar 
                  now={(stats.monthlyConsumption / 200) * 100} 
                  style={{ height: "8px" }} 
                  variant="primary" 
                />
              </div>
              <small className="text-muted">
                {stats.monthlyConsumption.toFixed(0)} m³ consumed this month
              </small>
            </Card.Body>
          </Card>

          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <Card.Body>
              <h6 className="mb-3">Environmental Impact</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-sm">Trees Saved</span>
                  <span className="fw-bold" style={{ color: "#059669" }}>
                    {Math.floor(stats.carbonOffset / 22)}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-sm">Clean Energy Used</span>
                  <span className="fw-bold" style={{ color: "#059669" }}>
                    100%
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h6 className="mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-success"
                  onClick={() => history.push('/admin/fuel-request-management')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-delivery-fast me-2"></i>
                  New Request
                </Button>
                <Button 
                  variant="outline-primary"
                  onClick={() => history.push('/admin/reports')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-chart-pie-36 me-2"></i>
                  View Reports
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => history.push('/admin/messages')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-email-85 me-2"></i>
                  Messages
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SchoolDashboard;
