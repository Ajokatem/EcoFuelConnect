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

function AdminDashboard() {
  const history = useHistory();
  const { translate } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSchools: 0,
    totalSuppliers: 0,
    totalProducers: 0,
    totalWaste: 0,
    biogasProduced: 0,
    fuelRequests: 0,
    carbonReduction: 0,
    activeUsers: 0,
    pendingApprovals: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Admin Overview Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1" style={{ color: "#059669", fontWeight: "600" }}>
            Admin Dashboard
          </h2>
          <p className="text-muted">System-wide overview and management</p>
        </Col>
      </Row>

      {/* Key Metrics Cards */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dbeafe" }}>
                  <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Total Users</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.totalUsers || 0}</h3>
                </div>
              </div>
              <small className="text-success">↗ Active accounts</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dcfce7" }}>
                  <svg width="24" height="24" fill="#16a34a" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Schools</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.totalSchools || 0}</h3>
                </div>
              </div>
              <small className="text-success">↗ Registered schools</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#fef3c7" }}>
                  <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Suppliers</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.wasteSuppliers || 0}</h3>
                </div>
              </div>
              <small className="text-success">↗ Active suppliers</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#e0e7ff" }}>
                  <svg width="24" height="24" fill="#6366f1" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Producers</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.totalProducers || 0}</h3>
                </div>
              </div>
              <small className="text-success">↗ Active producers</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Performance */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-4">System Performance</h5>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Waste Collection</span>
                  <span className="text-muted">{stats.totalWaste || 0} kg</span>
                </div>
                <ProgressBar now={75} style={{ height: "8px" }} variant="success" />
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Biogas Production</span>
                  <span className="text-muted">{stats.biogasProduced || 0} m³</span>
                </div>
                <ProgressBar now={68} style={{ height: "8px" }} variant="primary" />
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Fuel Deliveries</span>
                  <span className="text-muted">{stats.fuelDelivered || 0} units</span>
                </div>
                <ProgressBar now={85} style={{ height: "8px" }} variant="info" />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span>User Engagement</span>
                  <span className="text-muted">{stats.activeUsers || 0} active</span>
                </div>
                <ProgressBar now={92} style={{ height: "8px" }} variant="warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-4">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button 
                  variant="success" 
                  onClick={() => history.push('/admin/admin-content')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-paper-2 me-2"></i>
                  Manage Content
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => history.push('/admin/user')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-circle-09 me-2"></i>
                  User Management
                </Button>
                <Button 
                  variant="info" 
                  onClick={() => history.push('/admin/reports')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-chart-pie-36 me-2"></i>
                  View Reports
                </Button>
                <Button 
                  variant="warning" 
                  onClick={() => history.push('/admin/settings')}
                  style={{ borderRadius: "8px" }}
                >
                  <i className="nc-icon nc-settings-gear-64 me-2"></i>
                  System Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Row>
        <Col>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-3">Recent System Activity</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Activity</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td><Badge bg="primary">School</Badge></td>
                    <td>Fuel Request Submitted</td>
                    <td><Badge bg="warning">Pending</Badge></td>
                    <td>2 mins ago</td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td><Badge bg="success">Supplier</Badge></td>
                    <td>Waste Entry Logged</td>
                    <td><Badge bg="success">Completed</Badge></td>
                    <td>15 mins ago</td>
                  </tr>
                  <tr>
                    <td>Mike Johnson</td>
                    <td><Badge bg="info">Producer</Badge></td>
                    <td>Production Report</td>
                    <td><Badge bg="success">Completed</Badge></td>
                    <td>1 hour ago</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
