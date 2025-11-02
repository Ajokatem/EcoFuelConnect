import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

function Projects() {
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
              <Link to="/projects" style={{ color: "#25805a", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>Projects</Link>
              <Link to="/about" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>About</Link>
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
              className="shadow-lg border-0 mb-4" 
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
                  Our Projects
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
                  Real impact, real communities, real change—witness our biogas revolution in action
                </p>
              </Card.Header>
            </Card>

            {/* Project 1 */}
            <Card 
              className="shadow-lg border-0 mb-4" 
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderLeft: '4px solid #25805a'
              }}
            >
              <Card.Body style={{padding: '30px'}}>
                <Row>
                  <Col md="4" className="mb-3">
                    <div 
                      className="text-center p-4"
                      style={{
                        background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                        borderRadius: '15px',
                        color: 'white',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="nc-icon nc-atom" style={{fontSize: '3rem', marginBottom: '15px'}}></i>
                      <h5 style={{fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                        Community Biogas Hub
                      </h5>
                    </div>
                  </Col>
                  <Col md="8">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h3 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '700'}}>
                        Central Juba Biogas Initiative
                      </h3>
                      <Badge 
                        style={{
                          background: '#25805a',
                          color: 'white',
                          fontSize: '0.8rem',
                          padding: '5px 12px'
                        }}
                      >
                        Active
                      </Badge>
                    </div>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '15px'}}>
                      Picture this: 500 families cooking without smoke, children breathing clean air, and 2 tons of rotting waste transformed daily into life-changing energy. This isn't just a biogas plant—it's a health revolution. Mothers no longer spend hours collecting firewood. Kids aren't missing school due to respiratory infections. This is what sustainable development looks like.
                    </p>
                    <Row>
                      <Col sm="6">
                        <strong style={{color: '#25805a'}}>Location:</strong> Juba, Central Equatoria<br/>
                        <strong style={{color: '#25805a'}}>Capacity:</strong> 800 m³/day
                      </Col>
                      <Col sm="6">
                        <strong style={{color: '#25805a'}}>Households Served:</strong> 500+<br/>
                        <strong style={{color: '#25805a'}}>CO₂ Reduced:</strong> 50 tons/month
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Project 2 */}
            <Card 
              className="shadow-lg border-0 mb-4" 
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderLeft: '4px solid #2d9467'
              }}
            >
              <Card.Body style={{padding: '30px'}}>
                <Row>
                  <Col md="4" className="mb-3">
                    <div 
                      className="text-center p-4"
                      style={{
                        background: 'linear-gradient(135deg, #2d9467, #25805a)',
                        borderRadius: '15px',
                        color: 'white',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="nc-icon nc-tv-2" style={{fontSize: '3rem', marginBottom: '15px'}}></i>
                      <h5 style={{fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                        Training Center
                      </h5>
                    </div>
                  </Col>
                  <Col md="8">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h3 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '700'}}>
                        Rural Skills Development Program
                      </h3>
                      <Badge 
                        style={{
                          background: '#2d9467',
                          color: 'white',
                          fontSize: '0.8rem',
                          padding: '5px 12px'
                        }}
                      >
                        Expanding
                      </Badge>
                    </div>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '15px'}}>
                      Meet our 200+ certified biogas technicians—former farmers, students, and entrepreneurs who've become clean energy champions. Through hands-on training and mentorship, they're now operating 45 mini-plants across remote villages, earning sustainable incomes while transforming their communities. This isn't aid—it's empowerment. It's job creation. It's the future.
                    </p>
                    <Row>
                      <Col sm="6">
                        <strong style={{color: '#2d9467'}}>Locations:</strong> 12 rural communities<br/>
                        <strong style={{color: '#2d9467'}}>Trainees:</strong> 200+ technicians
                      </Col>
                      <Col sm="6">
                        <strong style={{color: '#2d9467'}}>Mini Plants:</strong> 45 operational<br/>
                        <strong style={{color: '#2d9467'}}>Success Rate:</strong> 92%
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Project 3 */}
            <Card 
              className="shadow-lg border-0 mb-4" 
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderLeft: '4px solid #1e6b47'
              }}
            >
              <Card.Body style={{padding: '30px'}}>
                <Row>
                  <Col md="4" className="mb-3">
                    <div 
                      className="text-center p-4"
                      style={{
                        background: 'linear-gradient(135deg, #1e6b47, #25805a)',
                        borderRadius: '15px',
                        color: 'white',
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="nc-icon nc-refresh-02" style={{fontSize: '3rem', marginBottom: '15px'}}></i>
                      <h5 style={{fontFamily: '"Inter", "Segoe UI", sans-serif'}}>
                        Waste Collection
                      </h5>
                    </div>
                  </Col>
                  <Col md="8">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h3 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '700'}}>
                        Smart Waste Collection Network
                      </h3>
                      <Badge 
                        style={{
                          background: '#ffc107',
                          color: 'black',
                          fontSize: '0.8rem',
                          padding: '5px 12px'
                        }}
                      >
                        Planning
                      </Badge>
                    </div>
                    <p style={{color: '#2F4F4F', lineHeight: '1.6', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '15px'}}>
                      Imagine Uber, but for organic waste. Our upcoming smart collection network uses AI-powered route optimization, real-time tracking, and mobile payments to revolutionize waste management. Market vendors get paid for their waste. Collection drivers maximize efficiency. Biogas plants receive consistent supply. Launching Q2 2026, this will connect 5,000 households to the circular economy.
                    </p>
                    <Row>
                      <Col sm="6">
                        <strong style={{color: '#1e6b47'}}>Coverage:</strong> Greater Juba area<br/>
                        <strong style={{color: '#1e6b47'}}>Collection Points:</strong> 50 planned
                      </Col>
                      <Col sm="6">
                        <strong style={{color: '#1e6b47'}}>Launch Date:</strong> Q2 2026<br/>
                        <strong style={{color: '#1e6b47'}}>Expected Impact:</strong> 5,000 households
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Impact Summary */}
            <Card 
              className="shadow-lg border-0" 
              style={{
                background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                color: 'white'
              }}
            >
              <Card.Body style={{padding: '40px', textAlign: 'center'}}>
                <h3 style={{fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '30px'}}>
                  Combined Impact Across All Projects
                </h3>
                <Row>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>745</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>Families Transformed</p>
                  </Col>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>2.4 tons</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>Waste Diverted Daily</p>
                  </Col>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>1,850</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>m³ Clean Gas/Month</p>
                  </Col>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>320</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>Jobs Created</p>
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

export default Projects;