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
                  Empowering South Sudan through sustainable biogas technology
                </p>
              </Card.Header>
              <Card.Body style={{padding: '40px'}}>
                <Row>
                  <Col md="6" className="mb-4">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      Our Mission
                    </h4>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                      EcoFuelConnect is a simple digital tool that helps biogas producers efficiently manage organic waste recycling, connect schools with clean fuel, and support a cleaner, healthier South Sudan by replacing charcoal and firewood with sustainable biogas.
                    </p>
                  </Col>
                  <Col md="6" className="mb-4">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      Our Vision
                    </h4>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                      To scale biogas adoption through integrated digital solutions that promote public health, 
                      environmental sustainability, and clean energy access. We aim to transform scattered pilot projects 
                      into a coordinated, transparent ecosystem serving schools and communities across the region.
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
                            Track organic waste from markets, slaughterhouses, and restaurants with supplier IDs and geo-timestamps
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
                            Real-time monitoring of daily biogas production quantities and process optimization
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
                            Transparent coordination between producers and schools for reliable biogas fuel distribution
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
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>1,200+</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>kg Waste Recycled</p>
                        </Col>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>1,345</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>m³ Biogas Produced</p>
                        </Col>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>432</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>Active Users</p>
                        </Col>
                        <Col md="3" className="mb-2">
                          <h3 style={{fontWeight: '700', marginBottom: '5px'}}>75</h3>
                          <p style={{fontSize: '0.9rem', margin: '0'}}>Trees Saved</p>
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