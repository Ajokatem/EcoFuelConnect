import React, { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useHistory } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Badge,
  Alert,
  ProgressBar,
  Button,
} from "react-bootstrap";
import dashboardService from "../services/dashboardService";

function Dashboard() {
  const history = useHistory();
  const { translate } = useLanguage();
  const [stats, setStats] = useState({
    totalWaste: 0,
    dailyWaste: 0,
    biogasProduced: 0,
    fuelRequests: 0,
    fuelDelivered: 0,
    carbonReduction: 0,
    communityEngagement: 0,
    educationalMessages: 0,
    forestSaved: 0,
    schoolsServed: 0,
    wasteSuppliers: 0,
    monthlyTarget: 0,
  });

  // Fetch dashboard analytics from backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();

    // No localStorage event listener needed. Real-time update handled by backend and React state/context.
  }, []);

  return (
  <Container fluid className="p-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Main Biogas Production Card (Sales Value Style) */}
      <Row className="mb-4">
        <Col md={8}>
          <Card style={{ 
            background: "linear-gradient(135deg, #4fbe99ff, #6aaf99ff)", 
            color: "white",
            borderRadius: "16px",
            border: "none"
          }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-white-50 mb-2">{translate("biogasProduced")}</h6>
                  <h2 className="mb-1" style={{ fontSize: "2.5rem", fontWeight: "600" }}>
                    {stats.biogasProduced} m3
                  </h2>
                  <div className="d-flex align-items-center">
                    <span className="text-white-50 me-2">{translate("overview")}</span>
                    <span className="badge bg-success bg-opacity-25 text-white">
                      7 12.4%
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderColor: "#dee2e6",
                      color: "#495057",
                      borderRadius: "20px",
                      padding: "4px 12px"
                    }}
                  >
                    {translate("month") || "Month"}
                  </Button>
                  <Button 
                    size="sm"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      color: "white",
                      borderRadius: "20px",
                      padding: "4px 12px"
                    }}
                  >
                    {translate("week") || "Week"}
                  </Button>
                </div>
              </div>
              
              {/* Mini Chart Simulation */}
              <div style={{ height: "120px", position: "relative" }}>
                <svg width="100%" height="120" style={{ overflow: "visible" }}>
                  <polyline
                    points="20,80 120,70 220,75 320,50 420,45 520,60 620,40"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="3"
                  />
                  {[20, 120, 220, 320, 420, 520, 620].map((x, i) => (
                    <circle key={i} cx={x} cy={[80, 70, 75, 50, 45, 60, 40][i]} r="4" fill="white" />
                  ))}
                </svg>
                <div className="d-flex justify-content-between text-white-50 text-xs mt-2">
                  <span>{translate("mon") || "Mon"}</span><span>{translate("tue") || "Tue"}</span><span>{translate("wed") || "Wed"}</span><span>{translate("thu") || "Thu"}</span><span>{translate("fri") || "Fri"}</span><span>{translate("sat") || "Sat"}</span><span>{translate("sun") || "Sun"}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Weekly Chart */}
        <Col md={4}>
          <Card style={{ borderRadius: "16px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h6 className="text-muted mb-3">Weekly Activity</h6>
              <div style={{ height: "180px" }}>
                <svg width="100%" height="180">
                  {[45, 52, 48, 61, 70, 65, 58].map((height, i) => (
                    <rect
                      key={i}
                      x={i * 35 + 10}
                      y={180 - height * 2}
                      width="25"
                      height={height * 2}
                      fill={i === 4 ? "#10b981" : "#d1fae5"}
                      rx="4"
                    />
                  ))}
                </svg>
                <div className="d-flex justify-content-between text-xs text-muted mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dbeafe" }}>
                  <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                    <path d="M17 9V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2a3 3 0 0 0-3 3v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9a3 3 0 0 0-3-3zM9 7h6v2H9V7z"/>
                  </svg>
                </div>
                <div>
                  <h5 className="mb-0">{translate("schools")}</h5>
                  <small className="text-muted">{translate("activePartners") || "Active Partners"}</small>
                </div>
              </div>
              <h3 className="mb-2" style={{ color: "#059669" }}>{stats.schoolsServed}</h3>
              <div className="d-flex align-items-center text-sm">
                <span className="text-muted">Oct 1 - Nov 1, </span>
                <span className="text-success ms-1">Worldwide</span>
              </div>
              <div className="d-flex align-items-center mt-2">
                <span className="text-success me-1">↗ 18.2%</span>
                <span className="text-muted text-sm">Since last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded me-3" style={{ backgroundColor: "#dcfce7" }}>
                  <svg width="24" height="24" fill="#16a34a" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10 9.9 11 11 11V13H7V11C7 9.9 6.1 9 5 9S3 9.9 3 11V21H5V13H7V21H11V11C12.1 11 13 10 13 9Z"/>
                  </svg>
                </div>
                <div>
                  <h5 className="mb-0">{translate("revenue") || "Revenue"}</h5>
                  <small className="text-muted">{translate("carbonCredits") || "Carbon Credits"}</small>
                </div>
              </div>
              <h3 className="mb-2" style={{ color: "#059669" }}>SSP {(parseFloat(stats.carbonReduction) * 45).toLocaleString()}</h3>
              <div className="d-flex align-items-center text-sm">
                <span className="text-muted">Oct 1 - Nov 1, </span>
                <span className="text-success ms-1">Worldwide</span>
              </div>
              <div className="d-flex align-items-center mt-2">
                <span className="text-success me-1">↗ 28.4%</span>
                <span className="text-muted text-sm">Since last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h5 className="mb-3">Waste Source</h5>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div style={{ position: "relative", width: "120px", height: "120px" }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="#10b981" />
                    <circle cx="60" cy="60" r="50" fill="#3b82f6" strokeDasharray="90 283" strokeDashoffset="25" transform="rotate(-90 60 60)" />
                    <circle cx="60" cy="60" r="50" fill="#06b6d4" strokeDasharray="32 283" strokeDashoffset="-65" transform="rotate(-90 60 60)" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="d-flex align-items-center">
                  <span className="badge me-2" style={{ backgroundColor: "#dbeafe", color: "#3b82f6" }}>■</span>
                  <span className="text-sm">Markets 60%</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge me-2" style={{ backgroundColor: "#f0f9ff", color: "#0ea5e9" }}>■</span>
                  <span className="text-sm">Restaurants 30%</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge me-2" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>■</span>
                  <span className="text-sm">Households 10%</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Performance Table and Team Section */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead>
                  <tr className="border-bottom">
                    <th className="text-muted fw-normal">School/Location</th>
                    <th className="text-muted fw-normal">Deliveries</th>
                    <th className="text-muted fw-normal">Revenue</th>
                    <th className="text-muted fw-normal">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>/schools/Promised-land-Secondary</td>
                    <td>15</td>
                    <td>SSP 2,450</td>
                    <td><span className="text-danger">↓ 43.52%</span></td>
                  </tr>
                  <tr>
                    <td>/schools/Juba-academy</td>
                    <td>12</td>
                    <td>SSP 1,890</td>
                    <td><span className="text-danger">↓ 32.35%</span></td>
                  </tr>
                  <tr>
                    <td>/schools/Juba-parents-Scondary</td>
                    <td>8</td>
                    <td>SSP 1,240</td>
                    <td><span className="text-success">↑ 15.78%</span></td>
                  </tr>
                  <tr>
                    <td>/schools/Wau-secondary</td>
                    <td>3</td>
                    <td>SSP 450</td>
                    <td><span className="text-danger">↓ 75.12%</span></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Waste Suppliers</h6>
                <Button 
                  size="sm"
                  onClick={() => history.push('/admin/organic-waste-logging')}
                  style={{
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                    color: "white",
                    borderRadius: "20px",
                    padding: "4px 12px"
                  }}
                >
                  See all
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-3" style={{ width: "40px", height: "40px", backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "500" }}>
                    CW
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Konyokoyo Market</div>
                    <div className="text-success d-flex align-items-center">
                      <span className="badge bg-success me-2" style={{ width: "8px", height: "8px", borderRadius: "50%" }}></span>
                      Active
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      color: "white",
                      borderRadius: "20px",
                      padding: "4px 12px"
                    }}
                  >
                    Invite
                  </Button>
                </div>

                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-3" style={{ width: "40px", height: "40px", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "500" }}>
                    JR
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Imperial Plaza Restaurant</div>
                    <div className="text-warning d-flex align-items-center">
                      <span className="badge bg-warning me-2" style={{ width: "8px", height: "8px", borderRadius: "50%" }}></span>
                      Pending
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      color: "white",
                      borderRadius: "20px",
                      padding: "4px 12px"
                    }}
                  >
                    Message
                  </Button>
                </div>

                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-3" style={{ width: "40px", height: "40px", backgroundColor: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "500" }}>
                    BG
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Gumbo Gardens</div>
                    <div className="text-muted d-flex align-items-center">
                      <span className="badge bg-secondary me-2" style={{ width: "8px", height: "8px", borderRadius: "50%" }}></span>
                      Offline
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      color: "white",
                      borderRadius: "20px",
                      padding: "4px 12px"
                    }}
                  >
                    Invite
                  </Button>
                </div>

                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-3" style={{ width: "40px", height: "40px", backgroundColor: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "500" }}>
                    NS
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Nimule Suppliers</div>
                    <div className="text-success d-flex align-items-center">
                      <span className="badge bg-success me-2" style={{ width: "8px", height: "8px", borderRadius: "50%" }}></span>
                      Active
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      color: "white",
                      borderRadius: "20px",
                      padding: "4px 12px"
                    }}
                  >
                    Message
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Tracking and Rankings */}
      <Row>
        <Col lg={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <h6 className="mb-4">Progress Track</h6>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-2">B</span>
                    <span>Biogas - Monthly Target</span>
                  </div>
                  <span className="text-muted">68%</span>
                </div>
                <ProgressBar now={68} style={{ height: "8px" }} variant="primary" />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-danger me-2">A</span>
                    <span>Waste - Collection Goal</span>
                  </div>
                  <span className="text-muted">85%</span>
                </div>
                <ProgressBar now={85} style={{ height: "8px" }} variant="danger" />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success me-2">V</span>
                    <span>Schools - Partnership</span>
                  </div>
                  <span className="text-muted">45%</span>
                </div>
                <ProgressBar now={45} style={{ height: "8px" }} variant="success" />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">S</span>
                    <span>Suppliers - Onboarding</span>
                  </div>
                  <span className="text-muted">35%</span>
                </div>
                <ProgressBar now={35} style={{ height: "8px" }} variant="info" />
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-2">B</span>
                    <span>Impact - Carbon Credits</span>
                  </div>
                  <span className="text-muted">68%</span>
                </div>
                <ProgressBar now={68} style={{ height: "8px" }} variant="primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <svg width="20" height="20" className="me-2" fill="#6b7280" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="fw-medium">Regional Rank</span>
                  <span className="ms-auto text-muted">#5</span>
                  <svg width="16" height="16" className="ms-1" fill="#10b981" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <svg width="20" height="20" className="me-2" fill="#6b7280" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                  <span className="fw-medium">Country Rank</span>
                  <span className="ms-auto text-muted">#2</span>
                  <svg width="16" height="16" className="ms-1" fill="#10b981" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                </div>
                <div className="text-muted text-sm ms-4">South Sudan ↗</div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <svg width="20" height="20" className="me-2" fill="#6b7280" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="fw-medium">Category Rank</span>
                  <span className="ms-auto text-muted">#1</span>
                  <svg width="16" height="16" className="ms-1" fill="#10b981" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                </div>
                <div className="text-muted text-sm ms-4">Renewable Energy</div>
              </div>

              <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#f8fafc" }}>
                <h6 className="mb-2">Impact Summary</h6>
                <p className="text-muted text-sm mb-0">
                  Your biogas production contributes to clean energy access 
                  and waste reduction in South Sudan's educational sector.
                </p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => history.push('/admin/reports')}
                  style={{
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                    color: "white",
                    borderRadius: "20px",
                    padding: "4px 12px"
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

export default Dashboard;

