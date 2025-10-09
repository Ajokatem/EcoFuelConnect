import React from "react";
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
                  Sustainable biogas initiatives across South Sudan
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
                      Our flagship project serving over 500 households in central Juba. This community-based biogas 
                      production facility processes 2 tons of organic waste daily, producing clean cooking gas and 
                      reducing dependency on traditional fuel sources.
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
                      Educational program training local communities in biogas technology, waste management, and 
                      sustainable practices. We've trained over 200 technicians who now operate mini biogas plants 
                      across rural areas.
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
                      Developing an intelligent waste collection system using mobile technology to optimize routes, 
                      track waste sources, and ensure efficient transportation to biogas facilities. This digital 
                      platform will connect waste producers directly with processing centers.
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
                  Collective Project Impact
                </h3>
                <Row>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>3</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>Active Projects</p>
                  </Col>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>700+</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>Households Served</p>
                  </Col>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>1,200</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>kg Waste Processed Daily</p>
                  </Col>
                  <Col md="3" className="mb-3">
                    <h2 style={{fontWeight: '700', fontSize: '2rem', marginBottom: '10px'}}>60</h2>
                    <p style={{fontSize: '1.1rem', margin: '0'}}>tons CO₂ Saved Monthly</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Projects;