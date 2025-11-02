import React from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/css/help.css";

function Help() {

  const helpTopics = [
    {
      title: "Logging Organic Waste",
      content: "Record daily organic waste collection from markets, slaughterhouses, and restaurants. Include waste type, quantity, source location, and supplier ID for accurate tracking and biogas production optimization.",
      icon: "nc-icon nc-world-2"
    },
    {
      title: "Monitoring Biogas Production",
      content: "Track daily biogas production volumes, monitor system performance, and access production analytics. Use the dashboard to optimize processes and ensure consistent fuel output for delivery to schools.",
      icon: "nc-icon nc-chart-bar-32"
    },
    {
      title: "School Fuel Requests",
      content: "Schools can submit biogas fuel requests specifying quantity needed and delivery preferences. Track request status, delivery scheduling, and maintain transparent communication with producers.",
      icon: "nc-icon nc-delivery-fast"
    },
    {
      title: "Educational Resources",
      content: "Access educational content about hygiene practices, environmental benefits of biogas, safe handling procedures, and waste management best practices to support community awareness and adoption.",
      icon: "nc-icon nc-bulb-63"
    }
  ];

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, rgba(37, 128, 90, 0.08) 0%, rgba(30, 107, 71, 0.12) 100%)', 
      minHeight: "100vh", 
      paddingTop: "30px",
      paddingBottom: "30px"
    }}>
      <Container fluid>
        <Row>
          <Col>
            {/* Header */}
            <div className="text-center mb-5">
              <h3 
                style={{
                  color: '#2F4F4F',
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "12px"
                }}
              >
                Help Center
              </h3>
              <p style={{ 
                color: "#6c757d", 
                fontSize: "1rem",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                Find answers to common questions and learn how to make the most of EcoFuelConnect
              </p>
            </div>

            {/* Getting Started */}
            <Row className="mb-5 justify-content-center">
              <Col xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <Card 
                  className="border-0 getting-started-card"
                  style={{ 
                    maxWidth: "500px",
                    width: "100%",
                    borderRadius: "20px",
                    background: "rgba(37, 128, 90, 0.15)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(37, 128, 90, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(37, 128, 90, 0.2)",
                    padding: "30px"
                  }}
                >
                  <h5 style={{ 
                    color: "white", 
                    margin: "0 0 20px 0", 
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                  }}>
                    Getting Started
                  </h5>
                  <p style={{ 
                    color: "#2F4F4F", 
                    fontSize: "15px", 
                    lineHeight: "1.6",
                    marginBottom: "0",
                    fontWeight: "500"
                  }}>
                    Welcome to <strong>EcoFuelConnect</strong>! This comprehensive web application connects biogas producers and users through 
                    transparent systems for real-time biogas production tracking, efficient waste recycling management, 
                    and reliable biogas fuel delivery. Targeting schools as major customers, the platform addresses the 
                    critical challenges of organic waste management where only 2.6% of daily waste is properly collected, 
                    while promoting clean energy access and reducing dependence on harmful charcoal and firewood.
                  </p>
                </Card>
              </Col>
            </Row>

            {/* Help Topics Section */}
            <Row className="mb-4">
              <Col>
                <h4 style={{
                  color: '#2F4F4F',
                  fontWeight: '600',
                  marginBottom: '5px',
                  textAlign: 'center',
                  fontSize: '1.3rem'
                }}>
                  How to Use EcoFuelConnect
                </h4>
              </Col>
            </Row>

            <Row>
              {helpTopics.map((topic, index) => (
                <Col lg="6" key={index} className="mb-4">
                  <Card 
                    className="border-0 h-100"
                    style={{
                      borderRadius: "16px",
                      background: "rgba(37, 128, 90, 0.12)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow: "0 6px 24px rgba(37, 128, 90, 0.25), 0 2px 6px rgba(0, 0, 0, 0.08)",
                      border: "1px solid rgba(37, 128, 90, 0.15)",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 32px rgba(37, 128, 90, 0.35), 0 4px 12px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 128, 90, 0.25), 0 2px 6px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <Card.Body style={{ padding: "25px" }}>
                      <div className="d-flex align-items-start mb-3">

                        <div style={{ flex: 1 }}>
                          <h5 style={{ 
                            color: "#2F4F4F", 
                            fontWeight: "600",
                            marginBottom: "12px",
                            fontSize: "1.1rem"
                          }}>
                            {topic.title}
                          </h5>
                          <p style={{ 
                            color: "#6c757d", 
                            fontSize: "14px",
                            lineHeight: "1.6",
                            margin: 0
                          }}>
                            {topic.content}
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Contact Support Section */}
            <Row className="mt-5">
              <Col>
                <Card 
                  className="border-0 text-center"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(37, 128, 90, 0.12)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(37, 128, 90, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(37, 128, 90, 0.2)"
                  }}
                >
                  <Card.Body style={{ padding: "40px" }}>
                    <h5 style={{
                      color: '#2F4F4F',
                      fontWeight: '600',
                      marginBottom: '15px',
                      fontSize: '1.2rem'
                    }}>
                      Still Need Help?
                    </h5>
                    <p style={{
                      color: '#6c757d',
                      fontSize: '16px',
                      marginBottom: '25px'
                    }}>
                      Our support team is here to help you make the most of EcoFuelConnect
                    </p>
                    <Button
                      as={Link}
                      to="/admin/contact"
                      style={{
                        background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 30px',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}
                    >
                      Contact Support
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Help;