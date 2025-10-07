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
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    phone: "",
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
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(newValue);
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data in localStorage (in real app, use proper authentication)
      localStorage.setItem('user', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organization: formData.organization,
        phone: formData.phone,
        isAuthenticated: true,
        registrationTime: new Date().toISOString()
      }));
      
      showSuccessAlert("Account created successfully! Redirecting to dashboard...");
      
      // Redirect to dashboard after success message
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2500);
      
    } catch (error) {
      showErrorAlert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3500);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setAlertType("danger");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <div className="auth-page">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center justify-content-center">
          <Col md="8" lg="6" xl="5">
            <div className="text-center mb-4">
              <img 
                src={require("../assets/img/recycle-symbol.png")} 
                alt="EcoFuelConnect" 
                className="auth-logo mb-3"
                style={{ width: '80px', height: '80px' }}
              />
              <h2 className="text-success mb-2">Join EcoFuelConnect</h2>
              <p className="text-muted">Create your account to start making a difference</p>
            </div>

            <Card className="auth-card shadow">
              <Card.Body className="p-4">
                {showAlert && (
                  <Alert variant={alertType} className="mb-4">
                    <i className={`nc-icon nc-${alertType === 'success' ? 'check-2' : 'simple-remove'}`}></i>
                    {" "}{alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <Row>
                    <Col md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="nc-icon nc-single-02"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            isInvalid={!!errors.firstName}
                            disabled={isLoading}
                          />
                        </InputGroup>
                        {errors.firstName && <Form.Text className="text-danger">{errors.firstName}</Form.Text>}
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <i className="nc-icon nc-single-02"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            isInvalid={!!errors.lastName}
                            disabled={isLoading}
                          />
                        </InputGroup>
                        {errors.lastName && <Form.Text className="text-danger">{errors.lastName}</Form.Text>}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
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
                      />
                    </InputGroup>
                    {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                  </Form.Group>

                  {/* Organization */}
                  <Form.Group className="mb-3">
                    <Form.Label>Organization (Optional)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="nc-icon nc-bank"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="organization"
                        placeholder="Company, school, or organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Phone */}
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number (Optional)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="nc-icon nc-mobile"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                        disabled={isLoading}
                      />
                    </InputGroup>
                    {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="nc-icon nc-key-25"></i>
                      </InputGroup.Text>
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
                        <i className={`nc-icon nc-${showPassword ? 'zoom-split' : 'glasses-2'}`}></i>
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
                          now={passwordStrength} 
                          className="mt-1" 
                          style={{ height: '4px' }}
                        />
                      </div>
                    )}
                    {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="nc-icon nc-key-25"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        isInvalid={!!errors.confirmPassword}
                        disabled={isLoading}
                      />
                    </InputGroup>
                    {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>}
                  </Form.Group>

                  {/* Checkboxes */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="agreeToTerms"
                      label={
                        <span>
                          I agree to the{" "}
                          <Link to="/admin/about" className="text-success">Terms of Service</Link>
                          {" "}and{" "}
                          <Link to="/admin/contact" className="text-success">Privacy Policy</Link> *
                        </span>
                      }
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      isInvalid={!!errors.agreeToTerms}
                      disabled={isLoading}
                    />
                    {errors.agreeToTerms && <Form.Text className="text-danger">{errors.agreeToTerms}</Form.Text>}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="subscribeNewsletter"
                      label="Subscribe to our newsletter for eco-friendly tips and updates"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="nc-icon nc-check-2"></i> Create Account
                      </>
                    )}
                  </Button>

                  <hr />

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link to="/auth/login" className="text-success fw-bold">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;