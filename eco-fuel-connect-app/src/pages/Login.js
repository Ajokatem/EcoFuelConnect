import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import authService from "../services/authService";
import api from "../services/api";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useUser } from "../contexts/UserContext";
import { sanitizeInput, sanitizeEmail, sanitizeMessage } from '../utils/sanitize';

function Login() {
  console.log('Login component is rendering...');
  const history = useHistory();
  const { updateUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Test backend connection on component mount
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await api.get('/health');
        console.log('Backend connection successful:', response.data);
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error.message || error);
        setBackendStatus('disconnected');
        showErrorAlert('Backend server is not accessible. Please check if the server is running.');
      }
    };

    testBackendConnection();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === 'checkbox' ? checked : (name === 'email' ? sanitizeEmail(value) : sanitizeInput(value));
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Real API call to backend
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      showSuccessAlert("Login successful! Setting up your profile...");

      // Auto-update profile with login details and set token in axios
      if (response.user && response.token) {
        updateUser(response.user, response.token);
      }

      // Redirect to dashboard after success message
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials and try again.";
      showErrorAlert(sanitizeMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send credential to backend for verification and login
      const response = await authService.googleLogin({ credential: credentialResponse.credential });
      showSuccessAlert("Google login successful! Redirecting to dashboard...");
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Google login failed. Please try again.";
      showErrorAlert(sanitizeMessage(errorMessage));
    }
  };

  const handleGoogleError = () => {
    showErrorAlert("Google authentication failed. Please try again.");
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(sanitizeMessage(message));
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(sanitizeMessage(message));
    setAlertType("danger");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <Container fluid style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)' }}>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col md="6" lg="5" xl="4">
            <Card 
              className="shadow-lg border-0" 
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px'
              }}
            >
              <Card.Body className="p-5">
                {/* Header Section */}
                <div className="text-center mb-4">
                  <h3 
                    style={{
                      color: '#25805a', 
                      fontWeight: '600', 
                      fontSize: '1.5rem',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      marginBottom: '8px'
                    }}
                  >
                    Welcome Back!
                  </h3>
                  <p 
                    style={{
                      color: '#666',
                      fontSize: '0.9rem',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      marginBottom: '0'
                    }}
                  >
                    Sign in to your EcoFuelConnect account
                  </p>
                </div>

                {/* Alert Section */}
                {showAlert && (
                  <Alert 
                    variant={alertType} 
                    className="mb-4"
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      background: alertType === 'success' ? 'rgba(37, 128, 90, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                      color: alertType === 'success' ? '#25805a' : '#dc3545'
                    }}
                  >
                    {alertMessage}
                  </Alert>
                )}

                {/* Backend Status Indicator */}
                {backendStatus === 'disconnected' && (
                  <Alert 
                    variant="warning" 
                    className="mb-4"
                    style={{
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(255, 193, 7, 0.1)',
                      color: '#856404'
                    }}
                  >
                    Backend server connection failed. Please check if the server is running.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label 
                      style={{
                        color: '#2F4F4F', 
                        fontWeight: '600',
                        fontFamily: '"Inter", "Segoe UI", sans-serif'
                      }}
                    >
                      Email Address
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text 
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          color: '#25805a'
                        }}
                      >
                        <i className="nc-icon nc-email-85"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        disabled={isLoading}
                        style={{
                          border: '1px solid #e9ecef',
                          borderRadius: '0 8px 8px 0',
                          padding: '12px 15px',
                          fontFamily: '"Inter", "Segoe UI", sans-serif'
                        }}
                      />
                    </InputGroup>
                    {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label 
                      style={{
                        color: '#2F4F4F', 
                        fontWeight: '600',
                        fontFamily: '"Inter", "Segoe UI", sans-serif'
                      }}
                    >
                      Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                        disabled={isLoading}
                        style={{
                          border: '1px solid #e9ecef',
                          padding: '12px 15px',
                          fontFamily: '"Inter", "Segoe UI", sans-serif'
                        }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        style={{
                          border: '1px solid #e9ecef',
                          borderRadius: '0 8px 8px 0',
                          background: '#f8f9fa',
                          color: '#25805a'
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                    {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      label="Remember me"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      style={{
                        color: '#2F4F4F',
                        fontFamily: '"Inter", "Segoe UI", sans-serif'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={isLoading || backendStatus === 'disconnected'}
                    className="w-100 mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(37, 128, 90, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="d-flex align-items-center my-3">
                    <hr className="flex-grow-1" style={{ borderColor: '#e0e0e0' }} />
                    <span className="px-3 text-muted" style={{ fontSize: '14px', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
                      or
                    </span>
                    <hr className="flex-grow-1" style={{ borderColor: '#e0e0e0' }} />
                  </div>

                </Form>
                {/* Google Auth */}
                <div className="text-center mt-3">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </div>
                <div className="text-center mt-4">
                  <p style={{ color: '#666', marginBottom: '10px', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
                    Don't have an account?
                  </p>
                  <Link 
                    to="/auth/register" 
                    style={{
                      color: '#25805a',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontFamily: '"Inter", "Segoe UI", sans-serif'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Create an account here
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </GoogleOAuthProvider>
  );
}

export default Login;