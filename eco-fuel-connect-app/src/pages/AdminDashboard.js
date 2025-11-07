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
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      const data = response.stats || response;
      setStats({
        totalUsers: data.totalUsers || 0,
        totalSchools: data.totalSchools || 0,
        totalSuppliers: data.totalSuppliers || data.wasteSuppliers || 0,
        totalProducers: data.totalProducers || 0,
        totalWaste: data.totalWaste || 0,
        biogasProduced: data.biogasProduced || 0,
        fuelRequests: data.fuelRequests || 0,
        carbonReduction: data.carbonReduction || 0,
        activeUsers: data.activeUsers || data.totalUsers || 0,
        wasteEntriesCount: data.wasteEntriesCount || 0,
        fuelDelivered: data.fuelDelivered || 0,
      });
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await dashboardService.getRecentActivities(10);
      setRecentActivity(response.activities || []);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivity();
    const intervalId = setInterval(() => {
      fetchDashboardData();
      fetchRecentActivity();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Admin Overview Header */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-1" style={{ color: "#059669", fontWeight: "600" }}>
            Admin Dashboard
          </h4>
          <p className="text-muted">System-wide overview and management</p>
        </Col>
      </Row>

      {/* Key Metrics Cards */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div>
                <h6 className="mb-2 text-muted">Total Users</h6>
                <h3 className="mb-2" style={{ color: "#059669" }}>{stats.totalUsers}</h3>
                <small className="text-success">Active accounts</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div>
                <h6 className="mb-2 text-muted">Schools</h6>
                <h3 className="mb-2" style={{ color: "#059669" }}>{stats.totalSchools}</h3>
                <small className="text-success">Registered schools</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div>
                <h6 className="mb-2 text-muted">Suppliers</h6>
                <h3 className="mb-2" style={{ color: "#059669" }}>{stats.totalSuppliers}</h3>
                <small className="text-success">Active suppliers</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div>
                <h6 className="mb-2 text-muted">Producers</h6>
                <h3 className="mb-2" style={{ color: "#059669" }}>{stats.totalProducers}</h3>
                <small className="text-success">Active producers</small>
              </div>
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
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
                  Manage Content
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => history.push('/admin/user')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
                  User Management
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => history.push('/admin/reports')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
                  View Reports
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => history.push('/admin/settings')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
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
                    <th>Activity</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 10).map((activity, index) => (
                      <tr key={index}>
                        <td>{activity.title || activity.description}</td>
                        <td><Badge bg="primary">{activity.type?.replace('_', ' ')}</Badge></td>
                        <td><Badge bg={activity.status === 'completed' ? 'success' : 'warning'}>{activity.status}</Badge></td>
                        <td>{new Date(activity.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No recent activity</td>
                    </tr>
                  )}
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
