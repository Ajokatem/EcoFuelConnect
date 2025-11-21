import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { useLanguage } from "../contexts/LanguageContext";

function Contact() {
  const { translate } = useLanguage();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      // Use the backend API URL directly
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        // Handle non-JSON error responses
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setStatus(data.error || 'Failed to send message');
        } else {
          setStatus('Server error - please try again later');
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        setStatus(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('Network error - please check your connection and try again');
    }
    setLoading(false);
  };

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
              <Link to="/" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>{translate('home')}</Link>
              <Link to="/projects" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>{translate('projects')}</Link>
              <Link to="/about" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>{translate('about')}</Link>
              <Link to="/contact" style={{ color: "#25805a", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>{translate('contact')}</Link>
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
                  {translate('contactUs')}
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
                  {translate('contactPageSubtitle')}
                </p>
              </Card.Header>
              <Card.Body style={{padding: '40px'}}>
                <Row>
                  <Col md="6" className="mb-4">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      {translate('sendUsMessage')}
                    </h4>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md="6">
                          <Form.Group className="mb-3">
                            <Form.Label style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '500'}}>
                              {translate('firstName')}
                            </Form.Label>
                            <Form.Control 
                              type="text" 
                              name="firstName"
                              value={form.firstName}
                              onChange={handleChange}
                              placeholder="Enter your first name"
                              style={{
                                borderColor: '#25805a',
                                borderRadius: '8px'
                              }}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group className="mb-3">
                            <Form.Label style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '500'}}>
                              {translate('lastName')}
                            </Form.Label>
                            <Form.Control 
                              type="text" 
                              name="lastName"
                              value={form.lastName}
                              onChange={handleChange}
                              placeholder="Enter your last name"
                              style={{
                                borderColor: '#25805a',
                                borderRadius: '8px'
                              }}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '500'}}>
                          {translate('emailAddress')}
                        </Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          style={{
                            borderColor: '#25805a',
                            borderRadius: '8px'
                          }}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '500'}}>
                          {translate('subject')}
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Enter message subject"
                          style={{
                            borderColor: '#25805a',
                            borderRadius: '8px'
                          }}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '500'}}>
                          {translate('message')}
                        </Form.Label>
                        <Form.Control 
                          as="textarea" 
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={5} 
                          placeholder="Enter your message"
                          style={{
                            borderColor: '#25805a',
                            borderRadius: '8px'
                          }}
                          required
                        />
                      </Form.Group>
                      <Button 
                        style={{
                          background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 30px',
                          fontFamily: '"Inter", "Segoe UI", sans-serif',
                          fontWeight: '500'
                        }}
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? translate('sending') : translate('sendMessage')}
                      </Button>
                      {status === 'success' && (
                        <div className="mt-3 text-success">{translate('messageSentSuccess')}</div>
                      )}
                      {status && status !== 'success' && (
                        <div className="mt-3 text-danger">{typeof status === 'string' ? status : 'Failed to send message.'}</div>
                      )}
                    </Form>
                  </Col>
                  <Col md="6">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      {translate('contactInformation')}
                    </h4>
                    <div className="mb-4">
                      <div 
                        className="d-flex align-items-center mb-3 p-3"
                        style={{
                          background: 'rgba(37, 128, 90, 0.1)',
                          borderRadius: '10px'
                        }}
                      >
                        <i className="fas fa-map-marker-alt" style={{color: '#25805a', fontSize: '1.5rem', marginRight: '15px'}}></i>
                        <div>
                          <h6 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '5px'}}>
                            {translate('address')}
                          </h6>
                          <p style={{color: '#2F4F4F', margin: '0', fontSize: '0.9rem'}}>
                            Kigali, Rwanda
                          </p>
                        </div>
                      </div>
                      <div 
                        className="d-flex align-items-center mb-3 p-3"
                        style={{
                          background: 'rgba(37, 128, 90, 0.1)',
                          borderRadius: '10px'
                        }}
                      >
                        <i className="fas fa-phone" style={{color: '#25805a', fontSize: '1.5rem', marginRight: '15px'}}></i>
                        <div>
                          <h6 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '5px'}}>
                            {translate('phone')}
                          </h6>
                          <p style={{color: '#2F4F4F', margin: '0', fontSize: '0.9rem'}}>
                            +250792104895, +211928410720
                          </p>
                        </div>
                      </div>
                      <div 
                        className="d-flex align-items-center mb-3 p-3"
                        style={{
                          background: 'rgba(37, 128, 90, 0.1)',
                          borderRadius: '10px'
                        }}
                      >
                        <i className="fas fa-envelope" style={{color: '#25805a', fontSize: '1.5rem', marginRight: '15px'}}></i>
                        <div>
                          <h6 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '5px'}}>
                            {translate('email')}
                          </h6>
                          <p style={{color: '#2F4F4F', margin: '0', fontSize: '0.9rem'}}>
                            a.biar@alustudent.com
                          </p>
                        </div>
                      </div>
                      <div 
                        className="d-flex align-items-center mb-3 p-3"
                        style={{
                          background: 'rgba(37, 128, 90, 0.1)',
                          borderRadius: '10px'
                        }}
                      >
                        <i className="fas fa-clock" style={{color: '#25805a', fontSize: '1.5rem', marginRight: '15px'}}></i>
                        <div>
                          <h6 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '5px'}}>
                            {translate('officeHours')}
                          </h6>
                          <p style={{color: '#2F4F4F', margin: '0', fontSize: '0.9rem'}}>
                            {translate('mondayFriday')}
                          </p>
                        </div>
                      </div>
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
                <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>{translate('home')}</Link>
                <Link to="/projects" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>{translate('projects')}</Link>
                <Link to="/about" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>{translate('about')}</Link>
                <Link to="/contact" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>{translate('contact')}</Link>
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

export default Contact;