import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function About() {
  return (
    <>
      {/* Navbar */}
      <nav style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 1000, padding: "12px 0" }}>
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#25805a", letterSpacing: "-0.5px" }}>EcoFuelConnect</span>
            </Link>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <Link to="/" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>Home</Link>
              <Link to="/projects" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>Projects</Link>
              <Link to="/about" style={{ color: "#25805a", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>About</Link>
              <Link to="/contact" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>Contact</Link>
            </div>
          </div>
        </Container>
      </nav>

      <Container 
        fluid 
        style={{
          background: '#F9FAFB',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        <Row className="justify-content-center">
          <Col lg="10">
            <Card 
              className="shadow-lg border-0" 
              style={{
                background: 'linear-gradient(135deg, #d4f5e0 0%, #ffffff 100%)',
                borderTop: '4px solid #25805a'
              }}
            >
              <Card.Header style={{background: 'transparent', border: 'none', paddingBottom: '0'}}>
                <Card.Title 
                  as="h2" 
                  className="text-center"
                  style={{
                    color: '#2F4F4F', 
                    fontWeight: '700', 
                    fontSize: '2rem',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    marginBottom: '10px'
                  }}
                >
                  About Us
                </Card.Title>
                <p 
                  className="text-center"
                  style={{
                    color: '#25805a',
                    fontSize: '1.1rem',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    fontWeight: '500'
                  }}
                >
                  Pioneering Africa's first integrated biogas ecosystem - where technology meets sustainability
                </p>
              </Card.Header>
              <Card.Body style={{padding: '40px'}}>
                <Row>
                  <Col md="6" className="mb-4">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      Our Mission
                    </h4>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                      We're revolutionizing South Sudan's energy landscape by creating the first comprehensive digital platform that transforms organic waste into opportunity. Our mission goes beyond technology—we're building a movement that empowers communities, protects forests, and saves lives by making clean biogas accessible to every household and school.
                    </p>
                  </Col>
                  <Col md="6" className="mb-4">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      Our Vision
                    </h4>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                      Imagine a South Sudan where every child breathes clean air, every forest thrives, and every community has reliable energy. We're making this vision reality by 2030—connecting 10,000 households, eliminating 500,000 tons of CO₂ annually, and creating 5,000 green jobs. Our platform will become the blueprint for sustainable waste-to-energy transformation across Africa.
                    </p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg="12">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      What We Do
                    </h4>
                    <Row>
                      <Col md="4" className="mb-3">
                        <div 
                          className="text-center p-3"
                          style={{
                            background: 'rgba(37, 128, 90, 0.1)',
                            borderRadius: '10px',
                            height: '100%'
                          }}
                        >
                          <i className="nc-icon nc-refresh-02" style={{fontSize: '2.5rem', color: '#25805a', marginBottom: '15px'}}></i>
                          <h5 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                            Waste Management
                          </h5>
                          <p style={{color: '#2F4F4F', fontSize: '0.9rem', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                            Smart digital tracking system capturing every kilogram of waste with GPS verification, photo documentation, and blockchain-secured supplier records—ensuring complete transparency from source to biogas
                          </p>
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div 
                          className="text-center p-3"
                          style={{
                            background: 'rgba(37, 128, 90, 0.1)',
                            borderRadius: '10px',
                            height: '100%'
                          }}
                        >
                          <i className="nc-icon nc-atom" style={{fontSize: '2.5rem', color: '#25805a', marginBottom: '15px'}}></i>
                          <h5 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                            Biogas Production
                          </h5>
                          <p style={{color: '#2F4F4F', fontSize: '0.9rem', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                            AI-powered analytics dashboard providing live production metrics, predictive maintenance alerts, and efficiency recommendations—maximizing output while minimizing operational costs
                          </p>
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div 
                          className="text-center p-3"
                          style={{
                            background: 'rgba(37, 128, 90, 0.1)',
                            borderRadius: '10px',
                            height: '100%'
                          }}
                        >
                          <i className="nc-icon nc-tv-2" style={{fontSize: '2.5rem', color: '#25805a', marginBottom: '15px'}}></i>
                          <h5 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                            School Fuel Delivery
                          </h5>
                          <p style={{color: '#2F4F4F', fontSize: '0.9rem', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                            Automated scheduling and route optimization connecting producers directly with schools—guaranteeing on-time delivery, quality assurance, and fair pricing through our verified marketplace
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg="12">
                    <div 
                      className="text-center p-4"
                      style={{
                        background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                        borderRadius: '15px',
                        color: 'white'
                      }}
                    >
                      <h4 style={{fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '15px'}}>
                        Impact Statistics
                      </h4>
                      <Row>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>18</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>Partner Organizations</p>
                        </Col>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>3,200+</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>Lives Impacted</p>
                        </Col>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>92%</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>User Satisfaction</p>
                        </Col>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>24/7</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>Platform Uptime</p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer style={{ background: "linear-gradient(135deg, #25805a 0%, #1e6b47 100%)", color: "#fff", padding: "40px 0 20px" }}>
        <Container>
          <Row>
            <Col md={4} className="mb-3">
              <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>EcoFuelConnect</h5>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>Transforming organic waste into clean biogas energy for a sustainable South Sudan.</p>
            </Col>
            <Col md={4} className="mb-3">
              <h6 style={{ fontWeight: 600, marginBottom: "16px" }}>Quick Links</h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>Home</Link>
                <Link to="/projects" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>Projects</Link>
                <Link to="/about" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>About</Link>
                <Link to="/contact" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>Contact</Link>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <h6 style={{ fontWeight: 600, marginBottom: "16px" }}>Contact Info</h6>
              <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>📍 Kigali, Rwanda</p>
              <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>📞 +250792104895</p>
              <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>✉️ a.biar@alustudent.com</p>
            </Col>
          </Row>
          <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "20px 0" }} />
          <div style={{ textAlign: "center", fontSize: "0.85rem" }}>
            <p style={{ margin: 0 }}>© 2025 EcoFuelConnect. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default About;