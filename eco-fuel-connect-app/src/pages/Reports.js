import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Form,
  ProgressBar,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";

function Reports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("thisMonth");
  const [wasteData, setWasteData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [stats, setStats] = useState({
    totalWasteProcessed: 0,
    totalFuelGenerated: 0,
    conversionEfficiency: 0,
    carbonReduced: 0,
    costsaved: 0,
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = () => {
    const wasteEntries = JSON.parse(localStorage.getItem("wasteEntries") || "[]");
    const fuelRequests = JSON.parse(localStorage.getItem("fuelRequests") || "[]");

    setWasteData(wasteEntries);
    setFuelData(fuelRequests);
    calculateStats(wasteEntries, fuelRequests);
  };

  const calculateStats = (waste, fuel) => {
    const totalWaste = waste.reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
    const totalFuel = fuel.reduce((sum, entry) => sum + parseFloat(entry.quantity || 0), 0);
    const efficiency = totalWaste > 0 ? (totalFuel / totalWaste) * 100 : 0;
    const carbonReduced = totalWaste * 0.5; // Approximate CO2 reduction
    const costSaved = totalFuel * 1.2; // Approximate cost savings

    setStats({
      totalWasteProcessed: totalWaste.toFixed(1),
      totalFuelGenerated: totalFuel.toFixed(1),
      conversionEfficiency: efficiency.toFixed(1),
      carbonReduced: carbonReduced.toFixed(1),
      costsaved: costSaved.toFixed(2),
    });
  };

  const getWasteByType = () => {
    const typeMap = {};
    wasteData.forEach((entry) => {
      const type = entry.type || "unknown";
      typeMap[type] = (typeMap[type] || 0) + parseFloat(entry.quantity || 0);
    });
    return Object.entries(typeMap).map(([type, quantity]) => ({ type, quantity: quantity.toFixed(1) }));
  };

  const getFuelByStatus = () => {
    const statusMap = {};
    fuelData.forEach((entry) => {
      const status = entry.status || "unknown";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([status, count]) => ({ status, count }));
  };

  const getMonthlyTrends = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    return months.slice(0, currentMonth + 1).map((month, index) => ({
      month,
      waste: Math.random() * 100 + 50, // Sample data
      fuel: Math.random() * 60 + 30,
      efficiency: Math.random() * 20 + 60,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "approved":
        return "info";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const exportToCSV = (data, filename) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    return [headers, ...rows].join("\n");
  };

  return (
    <div className="content" style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#fafbfc" }}>
      <Container fluid>
        {/* Beautiful Header */}
        <div className="text-center mb-4">
          <h3 className="text-dark mb-2">Analytics and Reports</h3>
          <p className="text-muted">Comprehensive insights into your eco-fuel activities and environmental impact</p>
        </div>

        {/* Date Range Filter */}
        <Row className="mb-4">
          <Col md="4" className="mx-auto">
            <div className="text-center">
              <Form.Group>
                <Form.Label className="fw-medium text-dark mb-3" style={{ fontSize: "16px" }}>
                  Select Date Range
                </Form.Label>
                <Form.Select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ 
                    borderRadius: "8px", 
                    border: "2px solid #28a745",
                    padding: "12px 16px",
                    fontSize: "15px",
                    fontWeight: "500"
                  }}
                >
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="last3Months">Last 3 Months</option>
                  <option value="thisYear">This Year</option>
                  <option value="allTime">All Time</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Col>
        </Row>

        {/* Clean Stats Overview */}
        <Row className="mb-5">
          {[
            { label: "Waste Processed", value: stats.totalWasteProcessed, suffix: " kg", color: "#28a745" },
            { label: "Fuel Generated", value: stats.totalFuelGenerated, suffix: " L", color: "#17a2b8" },
            { label: "Efficiency", value: stats.conversionEfficiency, suffix: "%", color: "#ffc107" },
            { label: "CO₂ Reduced", value: stats.carbonReduced, suffix: " kg", color: "#28a745" },
          ].map(({ label, value, suffix, color }, index) => (
            <Col lg="3" md="6" sm="6" key={label} className="mb-4">
              <div style={{
                backgroundColor: "white",
                padding: "30px 20px",
                borderRadius: "12px",
                boxShadow: "0 2px 15px rgba(40, 167, 69, 0.08)",
                border: "1px solid #f0f0f0",
                textAlign: "center",
                transition: "transform 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
              >
                <div style={{ 
                  fontSize: "36px", 
                  fontWeight: "800", 
                  color: color,
                  marginBottom: "8px",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                }}>
                  {typeof value === 'number' ? value.toFixed(1) : value}{suffix}
                </div>
                <div style={{ 
                  fontSize: "14px", 
                  color: "#6c757d",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Beautiful Detailed Reports Tabs */}
        <Card style={{ 
          border: "1px solid #e9ecef", 
          borderRadius: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
        }}>
          <Card.Body>
            <Tabs 
              activeKey={activeTab} 
              onSelect={(tab) => setActiveTab(tab)} 
              className="mb-4"
              style={{ borderBottom: "1px solid #dee2e6" }}
            >
                  {/* Overview Tab */}
                  <Tab eventKey="overview" title="Overview">
                    <div className="mt-4">
                      <Row>
                        <Col md="6">
                          <Card style={{ 
                            border: "1px solid #e9ecef", 
                            borderRadius: "15px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                          }}>
                            <Card.Header style={{ 
                              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", 
                              borderRadius: "15px 15px 0 0",
                              border: "none",
                              padding: "20px"
                            }}>
                              <h5 className="mb-0 text-dark" style={{ fontWeight: "600" }}>Waste by Type</h5>
                            </Card.Header>
                            <Card.Body style={{ padding: "25px" }}>
                              {getWasteByType().length === 0 ? (
                                <div className="text-center py-4">
                                  <p className="text-muted mb-0">No waste data available</p>
                                </div>
                              ) : (
                                getWasteByType().map((item, index) => (
                                  <div key={index} className="mb-4" style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "12px",
                                    border: "1px solid #e9ecef"
                                  }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <span className="text-capitalize fw-medium" style={{ fontSize: "14px", color: "#495057" }}>
                                        {item.type.replace("_", " ")}
                                      </span>
                                      <span style={{
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        padding: "4px 10px",
                                        borderRadius: "15px",
                                        fontSize: "12px",
                                        fontWeight: "500"
                                      }}>
                                        {item.quantity} kg
                                      </span>
                                    </div>
                                    <div style={{
                                      backgroundColor: "#e9ecef",
                                      height: "8px",
                                      borderRadius: "15px",
                                      overflow: "hidden"
                                    }}>
                                      <div style={{
                                        width: `${(parseFloat(item.quantity) / parseFloat(stats.totalWasteProcessed)) * 100}%`,
                                        height: "100%",
                                        backgroundColor: "#28a745",
                                        borderRadius: "15px",
                                        transition: "width 0.3s ease"
                                      }}>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md="6">
                          <Card style={{ 
                            border: "1px solid #e9ecef", 
                            borderRadius: "15px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                          }}>
                            <Card.Header style={{ 
                              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", 
                              borderRadius: "15px 15px 0 0",
                              border: "none",
                              padding: "20px"
                            }}>
                              <h5 className="mb-0 text-dark" style={{ fontWeight: "600" }}>Fuel Requests Status</h5>
                            </Card.Header>
                            <Card.Body style={{ padding: "25px" }}>
                              {getFuelByStatus().length === 0 ? (
                                <div className="text-center py-4">
                                  <p className="text-muted mb-0">No fuel request data available</p>
                                </div>
                              ) : (
                                getFuelByStatus().map((item, index) => (
                                  <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3" style={{
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "12px",
                                    border: "1px solid #e9ecef"
                                  }}>
                                    <span className="text-capitalize fw-medium" style={{ fontSize: "14px", color: "#495057" }}>
                                      {item.status}
                                    </span>
                                    <span style={{
                                      backgroundColor: getStatusColor(item.status) === 'success' ? '#d4edda' : 
                                                     getStatusColor(item.status) === 'info' ? '#cce5ff' :
                                                     getStatusColor(item.status) === 'warning' ? '#fff3cd' : '#f8d7da',
                                      color: getStatusColor(item.status) === 'success' ? '#155724' : 
                                             getStatusColor(item.status) === 'info' ? '#004085' :
                                             getStatusColor(item.status) === 'warning' ? '#856404' : '#721c24',
                                      padding: "6px 12px",
                                      borderRadius: "15px",
                                      fontSize: "12px",
                                      fontWeight: "500"
                                    }}>
                                      {item.count} requests
                                    </span>
                                  </div>
                                ))
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <Card>
                        <Card.Header>
                          <h5>Monthly Trends</h5>
                          <small className="text-muted">Performance over time</small>
                        </Card.Header>
                        <Card.Body>
                          <div style={{ overflowX: "auto" }}>
                            <Table responsive>
                              <thead>
                                <tr>
                                  <th>Month</th>
                                  <th>Waste (kg)</th>
                                  <th>Fuel (L)</th>
                                  <th>Efficiency (%)</th>
                                  <th>Trend</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getMonthlyTrends().map((data, index) => (
                                  <tr key={index}>
                                    <td>{data.month}</td>
                                    <td>{data.waste.toFixed(1)}</td>
                                    <td>{data.fuel.toFixed(1)}</td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        {data.efficiency.toFixed(1)}%
                                        <ProgressBar
                                          variant="success"
                                          now={data.efficiency}
                                          className="ms-2"
                                          style={{ width: "100px", height: "8px" }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab>

                  {/* Waste Details Tab */}
                  <Tab eventKey="waste" title="Waste Details">
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="text-dark" style={{ fontWeight: "600" }}>Waste Logging History</h5>
                        <Button 
                          size="sm" 
                          onClick={() => exportToCSV(wasteData, "waste_report.csv")}
                          style={{
                            backgroundColor: "#28a745",
                            borderColor: "#28a745",
                            color: "white",
                            borderRadius: "20px",
                            padding: "8px 16px"
                          }}
                        >
                          Export CSV
                        </Button>
                      </div>
                      <div style={{ 
                        maxHeight: "500px", 
                        overflowY: "auto",
                        borderRadius: "12px",
                        border: "1px solid #e9ecef",
                        overflow: "hidden"
                      }}>
                        <Table responsive hover className="mb-0">
                          <thead style={{ 
                            position: "sticky", 
                            top: 0, 
                            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                            borderBottom: "2px solid #dee2e6"
                          }}>
                            <tr>
                              <th style={{ padding: "15px 12px", fontWeight: "600", fontSize: "14px" }}>Date</th>
                              <th style={{ padding: "15px 12px", fontWeight: "600", fontSize: "14px" }}>Type</th>
                              <th style={{ padding: "15px 12px", fontWeight: "600", fontSize: "14px" }}>Quantity</th>
                              <th style={{ padding: "15px 12px", fontWeight: "600", fontSize: "14px" }}>Location</th>
                              <th style={{ padding: "15px 12px", fontWeight: "600", fontSize: "14px" }}>Status</th>
                              <th style={{ padding: "15px 12px", fontWeight: "600", fontSize: "14px" }}>Fuel Output</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wasteData.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="text-center py-5" style={{ backgroundColor: "#f8f9fa" }}>
                                  <div className="py-4">
                                    <p className="text-muted mb-0">No waste data available. Start logging waste to see reports here.</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              wasteData
                                .slice()
                                .reverse()
                                .map((entry) => (
                                  <tr key={entry.id} style={{ borderBottom: "1px solid #f1f3f4" }}>
                                    <td style={{ padding: "15px 12px", verticalAlign: "middle" }}>
                                      <span className="text-muted" style={{ fontSize: "13px" }}>
                                        {new Date(entry.date).toLocaleDateString()}
                                      </span>
                                    </td>
                                    <td style={{ padding: "15px 12px", verticalAlign: "middle" }}>
                                      <span className="text-capitalize fw-medium" style={{ fontSize: "14px", color: "#495057" }}>
                                        {entry.type?.replace("_", " ")}
                                      </span>
                                    </td>
                                    <td style={{ padding: "15px 12px", verticalAlign: "middle" }}>
                                      <span style={{
                                        backgroundColor: "#f8f9fa",
                                        color: "#495057",
                                        padding: "4px 12px",
                                        borderRadius: "15px",
                                        fontSize: "12px",
                                        fontWeight: "500"
                                      }}>
                                        {entry.quantity} kg
                                      </span>
                                    </td>
                                    <td style={{ padding: "15px 12px", verticalAlign: "middle" }}>
                                      <span className="text-muted" style={{ fontSize: "13px" }}>
                                        {entry.location}
                                      </span>
                                    </td>
                                    <td style={{ padding: "15px 12px", verticalAlign: "middle" }}>
                                      <span style={{
                                        backgroundColor: entry.status === "processed" ? '#d4edda' : '#fff3cd',
                                        color: entry.status === "processed" ? '#155724' : '#856404',
                                        padding: "4px 12px",
                                        borderRadius: "15px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        textTransform: "capitalize"
                                      }}>
                                        {entry.status || "pending"}
                                      </span>
                                    </td>
                                    <td style={{ padding: "15px 12px", verticalAlign: "middle" }}>
                                      <span style={{
                                        backgroundColor: "#d4edda",
                                        color: "#155724",
                                        padding: "4px 12px",
                                        borderRadius: "15px",
                                        fontSize: "12px",
                                        fontWeight: "500"
                                      }}>
                                        {entry.estimatedFuelOutput || "N/A"} L
                                      </span>
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Tab>

                  {/* Fuel Requests Tab */}
                  <Tab eventKey="fuel" title="Fuel Requests">
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="text-dark" style={{ fontWeight: "600" }}>Fuel Request History</h5>
                        <Button 
                          size="sm" 
                          onClick={() => exportToCSV(fuelData, "fuel_requests_report.csv")}
                          style={{
                            backgroundColor: "#28a745",
                            borderColor: "#28a745",
                            color: "white",
                            borderRadius: "20px",
                            padding: "8px 16px"
                          }}
                        >
                          Export CSV
                        </Button>
                      </div>
                      <div style={{ 
                        maxHeight: "500px", 
                        overflowY: "auto",
                        borderRadius: "12px",
                        border: "1px solid #e9ecef",
                        overflow: "hidden"
                      }}>
                        <Table responsive hover className="mb-0">
                          <thead>
                            <tr>
                              <th>Tracking #</th>
                              <th>Date</th>
                              <th>Fuel Type</th>
                              <th>Quantity</th>
                              <th>Status</th>
                              <th>Cost ($)</th>
                              <th>Delivery Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fuelData.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center text-muted">
                                  No fuel requests available. Create fuel requests to see reports here.
                                </td>
                              </tr>
                            ) : (
                              fuelData
                                .slice()
                                .reverse()
                                .map((request) => (
                                  <tr key={request.id}>
                                    <td>
                                      <code>{request.trackingNumber}</code>
                                    </td>
                                    <td>{new Date(request.dateRequested).toLocaleDateString()}</td>
                                    <td className="text-capitalize">{request.fuelType?.replace("_", " ")}</td>
                                    <td>{request.quantity}</td>
                                    <td>
                                      <Badge bg={getStatusColor(request.status)}>{request.status}</Badge>
                                    </td>
                                    <td>${request.estimatedCost}</td>
                                    <td>{new Date(request.preferredDate).toLocaleDateString()}</td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Tab>

                  {/* Environmental Impact Tab */}
                  <Tab eventKey="environmental" title=" Environmental Impact">
                    <div className="mt-4">
                      <Row>
                        <Col md="6">
                          <Card className="mb-4">
                            <Card.Header>
                              <h5>Carbon Footprint Reduction</h5>
                            </Card.Header>
                            <Card.Body>
                              <div className="text-center mb-3">
                                <h2 className="text-success">{stats.carbonReduced} kg</h2>
                                <p className="text-muted">CO₂ emissions prevented</p>
                              </div>
                              <Alert variant="success">
                                <strong>Great Impact!</strong> Your waste conversion has prevented the equivalent of:
                                <ul className="mt-2 mb-0">
                                  <li>{(parseFloat(stats.carbonReduced) / 2.3).toFixed(1)} liters of gasoline burned</li>
                                  <li>{(parseFloat(stats.carbonReduced) / 21.8).toFixed(1)} trees needed to absorb this CO₂</li>
                                  <li>{(parseFloat(stats.carbonReduced) * 2.2).toFixed(1)} miles driven by average car</li>
                                </ul>
                              </Alert>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md="6">
                          <Card className="mb-4">
                            <Card.Header>
                              <h5>Economic Impact</h5>
                            </Card.Header>
                            <Card.Body>
                              <div className="text-center mb-3">
                                <h2 className="text-success">${stats.costsaved}</h2>
                                <p className="text-muted">Estimated cost savings</p>
                              </div>
                              <div className="impact-metrics">
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Fuel Cost Savings:</span>
                                  <span className="text-success">${(parseFloat(stats.costsaved) * 0.7).toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Waste Disposal Savings:</span>
                                  <span className="text-success">${(parseFloat(stats.costsaved) * 0.2).toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Carbon Credit Value:</span>
                                  <span className="text-success">${(parseFloat(stats.costsaved) * 0.1).toFixed(2)}</span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <div style={{ padding: "30px 0" }}>
                        <h4 className="text-center mb-4" style={{ color: "#2c3e50", fontWeight: "600" }}>
                          Environmental Impact Summary
                        </h4>
                        <Row className="justify-content-center">
                          <Col md="10">
                            <Row>
                              <Col md="4" className="text-center mb-4">
                                <div style={{
                                  backgroundColor: "#e8f5e8",
                                  padding: "25px 20px",
                                  borderRadius: "12px",
                                  border: "1px solid #28a745",
                                  borderLeft: "4px solid #28a745"
                                }}>
                                  <h5 className="mb-2" style={{ color: "#2c3e50", fontWeight: "600" }}>Waste Diverted</h5>
                                  <h3 style={{ color: "#28a745", fontWeight: "700" }}>{stats.totalWasteProcessed} kg</h3>
                                  <small className="text-muted">from landfills</small>
                                </div>
                              </Col>
                              <Col md="4" className="text-center mb-4">
                                <div style={{
                                  backgroundColor: "#d4edda",
                                  padding: "25px 20px",
                                  borderRadius: "12px",
                                  border: "1px solid #28a745",
                                  borderLeft: "4px solid #28a745"
                                }}>
                                  <h5 className="mb-2" style={{ color: "#2c3e50", fontWeight: "600" }}>Clean Energy</h5>
                                  <h3 style={{ color: "#28a745", fontWeight: "700" }}>{stats.totalFuelGenerated} L</h3>
                                  <small className="text-muted">renewable fuel</small>
                                </div>
                              </Col>
                              <Col md="4" className="text-center mb-4">
                                <div style={{
                                  backgroundColor: "#d4edda",
                                  padding: "25px 20px",
                                  borderRadius: "12px",
                                  border: "1px solid #28a745",
                                  borderLeft: "4px solid #28a745"
                                }}>
                                  <h5 className="mb-2" style={{ color: "#2c3e50", fontWeight: "600" }}>Efficiency</h5>
                                  <h3 style={{ color: "#28a745", fontWeight: "700" }}>{stats.conversionEfficiency}%</h3>
                                  <small className="text-muted">conversion rate</small>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Reports;

