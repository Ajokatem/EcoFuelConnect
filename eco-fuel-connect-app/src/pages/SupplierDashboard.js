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

function SupplierDashboard() {
  const history = useHistory();
  const { translate } = useLanguage();
  const [stats, setStats] = useState({
    totalWasteSupplied: 0,
    monthlyWaste: 0,
    weeklyWaste: 0,
    totalEntries: 0,
    pendingPickups: 0,
    completedPickups: 0,
    earnings: 0,
    carbonImpact: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      const data = response.stats || response;
      setStats({
        totalWasteSupplied: data.totalWasteSupplied || data.userWasteContribution || 0,
        monthlyWaste: data.monthlyWaste || 0,
        weeklyWaste: data.weeklyWaste || 0,
        totalEntries: data.wasteEntriesCount || 0,
        pendingPickups: Math.floor(Math.random() * 5),
        completedPickups: data.wasteEntriesCount || 0,
        earnings: data.earnings || 0,
        carbonImpact: data.carbonImpact || 0,
      });
    } catch (error) {
      console.error("Error fetching supplier dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Supplier Header */}
      <Row className="mb-4">
        <Col md={8}>
          <Card style={{ 
            background: "linear-gradient(135deg, #4fbe99ff, #6aaf99ff)", 
            color: "white",
            borderRadius: "16px",
            border: "none"
          }}>
            <Card.Body className="p-4">
              <h6 className="text-white-50 mb-2">Total Waste Supplied</h6>
              <h2 className="mb-1" style={{ fontSize: "2.5rem", fontWeight: "600" }}>
                {stats.totalWasteSupplied.toFixed(2)} kg
              </h2>
              <div className="d-flex align-items-center">
                <span className="text-white-50 me-2">Your contribution</span>
                <span className="badge bg-success bg-opacity-25 text-white">
                  ↗ Active Supplier
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ borderRadius: "16px", border: "1px solid #e5e7eb", height: "100%" }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              <h6 className="text-muted mb-2">Environmental Impact</h6>
              <h3 className="mb-1" style={{ color: "#059669" }}>
                {stats.carbonImpact.toFixed(2)} kg CO₂
              </h3>
              <small className="text-success">Carbon reduction achieved</small>
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
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dcfce7" }}>
                  <svg width="24" height="24" fill="#16a34a" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">This Month</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.monthlyWaste.toFixed(0)} kg</h3>
                </div>
              </div>
              <small className="text-success">↗ Monthly supply</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dbeafe" }}>
                  <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">This Week</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.weeklyWaste.toFixed(0)} kg</h3>
                </div>
              </div>
              <small className="text-primary">↗ Weekly supply</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#fef3c7" }}>
                  <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Earnings</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>SSP {stats.earnings.toFixed(0)}</h3>
                </div>
              </div>
              <small className="text-warning">↗ Total earned</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#e0e7ff" }}>
                  <svg width="24" height="24" fill="#6366f1" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Total Entries</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.totalEntries}</h3>
                </div>
              </div>
              <small className="text-info">↗ Waste logs</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Cards */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-4">Recent Waste Entries</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Waste Type</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Pickup</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Today</td>
                    <td>Food Waste</td>
                    <td>45 kg</td>
                    <td><Badge bg="success">Collected</Badge></td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>Yesterday</td>
                    <td>Organic Waste</td>
                    <td>38 kg</td>
                    <td><Badge bg="success">Collected</Badge></td>
                    <td>Completed</td>
                  </tr>
                  <tr>
                    <td>2 days ago</td>
                    <td>Market Waste</td>
                    <td>52 kg</td>
                    <td><Badge bg="warning">Pending</Badge></td>
                    <td>Scheduled</td>
                  </tr>
                </tbody>
              </Table>
              <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={() => history.push('/admin/organic-waste-logging')}
                style={{ borderRadius: "8px" }}
              >
                <i className="nc-ico nc-plnet me-2"></i>
                Log New Waste Entry
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <Card.Body>
              <h6 className="mb-3">Monthly Progress</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-sm">Target: 500 kg</span>
                  <span className="text-sm">{((stats.monthlyWaste / 500) * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar 
                  now={(stats.monthlyWaste / 500) * 100} 
                  style={{ height: "8px" }} 
                  variant="success" 
                />
              </div>
              <small className="text-muted">
                {(500 - stats.monthlyWaste).toFixed(0)} kg remaining to reach monthly target
              </small>
            </Card.Body>
          </Card>

          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h6 className="mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="success"
                  onClick={() => history.push('/admin/organic-waste-logging')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
                  New Entry
                </Button>
                <Button 
                  variant="success"
                  onClick={() => history.push('/admin/messages')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
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

export default SupplierDashboard;
