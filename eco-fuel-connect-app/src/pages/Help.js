import React from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";

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
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
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
            <Row className="mb-5">
              <Col>
                <Card 
                  className="shadow-lg border-0"
                  style={{ 
                    borderRadius: "15px",
                    overflow: "hidden"
                  }}
                >
                  <Card.Header 
                    style={{ 
                      background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
                      borderBottom: "none",
                      padding: "20px"
                    }}
                  >
                    <h5 style={{ 
                      color: "white", 
                      margin: 0, 
                      fontWeight: "600",
                      fontSize: "1.1rem"
                    }}>
                      Getting Started
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ 
                    padding: "15px",
                    background: "white"
                  }}>
                    <p style={{ 
                      color: "#2F4F4F", 
                      fontSize: "16px", 
                      lineHeight: "1.1",
                      marginBottom: "0"
                    }}>
                      Welcome to <strong>EcoFuelConnect</strong>! This comprehensive web application connects biogas producers and users through 
                      transparent systems for real-time biogas production tracking, efficient waste recycling management, 
                      and reliable biogas fuel delivery. Targeting schools as major customers, the platform addresses the 
                      critical challenges of organic waste management where only 2.6% of daily waste is properly collected, 
                      while promoting clean energy access and reducing dependence on harmful charcoal and firewood.
                    </p>
                  </Card.Body>
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
                    className="shadow-sm border-0 h-100"
                    style={{
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 128, 90, 0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
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
                  className="shadow-lg border-0 text-center"
                  style={{
                    borderRadius: "15px",
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
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