import React, { useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup,
  ProgressBar
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import authService from "../services/authService";
import { useUser } from "../contexts/UserContext";
import { sanitizeInput, sanitizeEmail, sanitizeMessage } from '../utils/sanitize';

function Register() {
  const { updateUser } = useUser();
  // Helper for progress bar percent
  const getPasswordStrengthPercent = () => {
    return passwordStrength;
  };
  const history = useHistory();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    phone: "",
    role: "",
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === 'checkbox' ? checked : (name === 'email' ? sanitizeEmail(value) : sanitizeInput(value));

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (name === 'password') {
      calculatePasswordStrength(sanitizedValue);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 20;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "danger";
    if (passwordStrength < 70) return "warning";
    return "success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.role) {
      newErrors.role = "Please select your category";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms and Privacy Policy to register.";
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
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        organization: formData.organization,
        phone: formData.phone,
        role: formData.role
      });

      if (response.user && response.token) {
        updateUser(response.user, response.token);
      }
      showSuccessAlert("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 2500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      showErrorAlert(sanitizeMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send credential to backend for verification and registration
      const response = await authService.googleLogin({ credential: credentialResponse.credential });
      showSuccessAlert("Google account registered! Redirecting to dashboard...");
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 2500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Google registration failed. Please try again.";
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
    setTimeout(() => setShowAlert(false), 3500);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(sanitizeMessage(message));
    setAlertType("danger");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <Container fluid style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)' }}>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col md="8" lg="6" xl="5">
            <Card 
              className="shadow-lg border-0" 
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px'
              }}
            >
              <Card.Body className="p-5">
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
                    Join EcoFuelConnect
                  </h3>
                  <p 
                    style={{
                      color: '#666',
                      fontSize: '0.9rem',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      marginBottom: '0'
                    }}
                  >
                    Create your account to start making a difference
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* First and Last Name */}
                  <Row>
                    <Col md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.firstName}
                          disabled={isLoading}
                        />
                        {errors.firstName && <Form.Text className="text-danger">{errors.firstName}</Form.Text>}
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.lastName}
                          disabled={isLoading}
                        />
                        {errors.lastName && <Form.Text className="text-danger">{errors.lastName}</Form.Text>}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                      disabled={isLoading}
                    />
                    {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                  </Form.Group>

                  {/* Organization */}
                  <Form.Group className="mb-3">
                    <Form.Label>Organization (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="organization"
                      placeholder="Company, school, or organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </Form.Group>

                  {/* Role Selection */}
                  <Form.Group className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      isInvalid={!!errors.role}
                      disabled={isLoading}
                    >
                      <option value="">Select role</option>
                      <option value="school">School</option>
                      <option value="supplier">Supplier</option>
                      <option value="producer">Producer</option>
                    </Form.Select>
                    {errors.role && <Form.Text className="text-danger">{errors.role}</Form.Text>}
                  </Form.Group>

                  {/* Phone */}
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number (Optional)</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      isInvalid={!!errors.phone}
                      disabled={isLoading}
                    />
                    {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                    {formData.password && (
                      <div className="mt-2">
                        <small className="text-muted">Password Strength: </small>
                        <small className={`text-${getPasswordStrengthColor()}`}>
                          {getPasswordStrengthText()}
                        </small>
                        <ProgressBar 
                          variant={getPasswordStrengthColor()} 
                          now={getPasswordStrengthPercent()} 
                          style={{ height: '6px', marginTop: '4px' }}
                        />
                      </div>
                    )}
                    {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      isInvalid={!!errors.confirmPassword}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>}
                  </Form.Group>

                  {/* Terms and Privacy Policy */}
                  <Form.Group className="mb-3">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Link to="/terms" target="_blank" style={{color: '#25805a', textDecoration: 'underline', minWidth: 80, fontSize: '0.95em'}}>Terms</Link>
                      <Link to="/privacy" target="_blank" style={{color: '#25805a', textDecoration: 'underline', minWidth: 80, fontSize: '0.95em'}}>Privacy Policy</Link>
                      <Button
                        variant="success"
                        size="sm"
                        type="button"
                        disabled={formData.agreeToTerms}
                        style={{
                          marginLeft: 10,
                          backgroundColor: formData.agreeToTerms ? '#888' : '#e0e0e0',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          color: formData.agreeToTerms ? '#fff' : '#1976d2',
                          padding: '2px 12px',
                          fontSize: '0.85em',
                          transition: 'background-color 0.2s, color 0.2s'
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: true }))}
                      >
                        {formData.agreeToTerms ? 'Accepted' : 'Accept & Continue'}
                      </Button>
                    </div>
                    {errors.agreeToTerms && <Form.Text className="text-danger">{errors.agreeToTerms}</Form.Text>}
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isLoading}
                    style={{ backgroundColor: '#25805a', border: 'none', borderRadius: '8px', fontWeight: '600', color: '#1976d2' }}
                  >
                    {isLoading ? 'Registering...' : <span style={{color: '#1976d2'}}>Register</span>}
                  </Button>

                  {/* Sign In Option */}
                  <div className="text-center mt-3">
                    <span style={{ color: '#25805a', fontWeight: 500 }}>
                      Already have an account?{' '}
                      <Link to="/auth/login" style={{ color: '#25805a', textDecoration: 'underline', cursor: 'pointer' }}>Sign In</Link>
                    </span>
                  </div>

                  {/* Google Auth */}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}

export default Register;
