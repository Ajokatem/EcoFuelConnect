import React, { useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

function Contact() {
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
      const res = await fetch('/api/contact', {
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
                  Contact Us
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
                  Get in touch with the EcoFuelConnect team
                </p>
              </Card.Header>
              <Card.Body style={{padding: '40px'}}>
                <Row>
                  <Col md="6" className="mb-4">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      Send us a Message
                    </h4>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md="6">
                          <Form.Group className="mb-3">
                            <Form.Label style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', fontWeight: '500'}}>
                              First Name
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
                              Last Name
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
                          Email Address
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
                          Subject
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
                          Message
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
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                      {status === 'success' && (
                        <div className="mt-3 text-success">Message sent successfully!</div>
                      )}
                      {status && status !== 'success' && (
                        <div className="mt-3 text-danger">{typeof status === 'string' ? status : 'Failed to send message.'}</div>
                      )}
                    </Form>
                  </Col>
                  <Col md="6">
                    <h4 style={{color: '#2F4F4F', fontFamily: '"Inter", "Segoe UI", sans-serif', marginBottom: '20px'}}>
                      Contact Information
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
                            Address
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
                            Phone
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
                            Email
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
                            Office Hours
                          </h6>
                          <p style={{color: '#2F4F4F', margin: '0', fontSize: '0.9rem'}}>
                            Monday - Friday: 8:00 AM - 5:00 PM
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
    </>
  );
}

export default Contact;