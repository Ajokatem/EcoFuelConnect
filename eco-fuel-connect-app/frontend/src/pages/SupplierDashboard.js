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
import CoinRewards from "../components/CoinRewards";

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
      console.log('Supplier dashboard response:', response);
      
      const data = response.stats || response;
      console.log('Supplier dashboard stats:', data);
      
      setStats({
        totalWasteSupplied: data.totalWasteSupplied || data.userWasteContribution || 0,
        monthlyWaste: data.monthlyWaste || 0,
        weeklyWaste: data.weeklyWaste || 0,
        totalEntries: data.wasteEntriesCount || 0,
        pendingPickups: data.pendingPickups || 0,
        completedPickups: data.wasteEntriesCount || 0,
        earnings: data.earnings || 0,
        carbonImpact: data.carbonImpact || 0,
        totalCoins: data.totalCoins || 0,
        lifetimeCoins: data.lifetimeCoins || 0,
        cashValue: data.cashValue || '0.00',
        recentEntries: data.recentEntries || []
      });
    } catch (error) {
      console.error("Error fetching supplier dashboard data:", error);
      console.error("Error details:", error.response?.data);
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
              <h6 className="text-white-50 mb-2">{translate('wasteLogged')}</h6>
              <h2 className="mb-1" style={{ fontSize: "2.5rem", fontWeight: "600" }}>
                {stats.totalWasteSupplied.toFixed(2)} kg
              </h2>
              <div className="d-flex align-items-center">
                <span className="text-white-50 me-2">{translate('yourContribution')}</span>
                <span className="badge bg-success bg-opacity-25 text-white">
                  ↗ {translate('activeSupplier')}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ borderRadius: "16px", border: "1px solid #e5e7eb", height: "100%" }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              <h6 className="text-muted mb-2">{translate('availableCoins')}</h6>
              <h3 className="mb-1" style={{ color: "#059669" }}>
                {stats.totalCoins || 0} {translate('coins')}
              </h3>
              <small className="text-success">${stats.cashValue || '0.00'} USD</small>
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
                  <h6 className="mb-0 text-muted">{translate('thisMonth')}</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.monthlyWaste.toFixed(0)} kg</h3>
                </div>
              </div>
              <small className="text-success">↗ {translate('monthlySupply')}</small>
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
                  <h6 className="mb-0 text-muted">{translate('thisWeek')}</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.weeklyWaste.toFixed(0)} kg</h3>
                </div>
              </div>
              <small className="text-primary">↗ {translate('weeklySupply')}</small>
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
                  <h6 className="mb-0 text-muted">{translate('lifetimeEarned')}</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>${(stats.earnings || 0).toFixed(2)}</h3>
                </div>
              </div>
              <small className="text-warning">↗ {stats.lifetimeCoins || 0} {translate('coinsEarnedLower')}</small>
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
                  <h6 className="mb-0 text-muted">{translate('totalEntries')}</h6>
                  <h3 className="mb-0" style={{ color: "#059669" }}>{stats.totalEntries}</h3>
                </div>
              </div>
              <small className="text-info">↗ {translate('wasteLogs')}</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Cards */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-4">{translate('recentActivity')}</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>{translate('date')}</th>
                    <th>{translate('wasteType')}</th>
                    <th>{translate('quantity')}</th>
                    <th>{translate('status')}</th>
                    <th>{translate('pickup')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEntries && stats.recentEntries.length > 0 ? (
                    stats.recentEntries.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.wasteType}</td>
                        <td>{entry.quantity} {translate('kg')}</td>
                        <td>
                          <Badge bg={entry.status === 'confirmed' ? 'success' : entry.status === 'pending' ? 'warning' : 'secondary'}>
                            {translate(entry.status)}
                          </Badge>
                        </td>
                        <td>{translate(entry.pickupStatus || 'scheduled')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No recent activity. Start logging waste to see your entries here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={() => history.push('/admin/organic-waste-logging')}
                style={{ borderRadius: "8px" }}
              >
                <i className="nc-ico nc-plnet me-2"></i>
                {translate('addNewEntry')}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <div style={{ marginBottom: "1rem" }}>
            <CoinRewards />
          </div>
          
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <Card.Body>
              <h6 className="mb-3">{translate('monthlyProgress')}</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-sm">{translate('target')}: 500 {translate('kg')}</span>
                  <span className="text-sm">{((stats.monthlyWaste / 500) * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar 
                  now={(stats.monthlyWaste / 500) * 100} 
                  style={{ height: "8px" }} 
                  variant="success" 
                />
              </div>
              <small className="text-muted">
                {(500 - stats.monthlyWaste).toFixed(0)} {translate('kg')} {translate('remaining')}
              </small>
            </Card.Body>
          </Card>

          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h6 className="mb-3">{translate('quickActions')}</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="success"
                  onClick={() => history.push('/admin/organic-waste-logging')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
                  {translate('newEntry')}
                </Button>
                <Button 
                  variant="success"
                  onClick={() => history.push('/admin/messages')}
                  style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600' }}
                >
                  {translate('messages')}
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
