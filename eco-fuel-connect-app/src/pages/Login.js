import React, { useState } from "react";
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
import { Link } from "react-router-dom";

function Login() {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data in localStorage (in real app, use proper authentication)
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }));
      
      showSuccessAlert("Login successful! Redirecting to dashboard...");
      
      // Redirect to dashboard after success message
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);
      
    } catch (error) {
      showErrorAlert("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setAlertType("danger");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@ecofuelconnect.com",
      password: "demo123",
      rememberMe: false
    });
    showSuccessAlert("Demo credentials filled! Click Login to continue.");
  };

  return (
    <div className="auth-page">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center justify-content-center">
          <Col md="6" lg="4">
            <div className="text-center mb-4">
              <img 
                src={require("../assets/img/recycle-symbol.png")} 
                alt="EcoFuelConnect" 
                className="auth-logo mb-3"
                style={{ width: '80px', height: '80px' }}
              />
              <h2 className="text-success mb-2">Welcome Back!</h2>
              <p className="text-muted">Sign in to your EcoFuelConnect account</p>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
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

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="nc-icon nc-key-25"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
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
                    {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                  </Form.Group>

                  <Row className="mb-3">
                    <Col>
                      <Form.Check
                        type="checkbox"
                        name="rememberMe"
                        label="Remember me"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </Col>
                    <Col className="text-end">
                      <Link to="/auth/forgot-password" className="text-success">
                        Forgot Password?
                      </Link>
                    </Col>
                  </Row>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="nc-icon nc-key-25"></i> Sign In
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline-success"
                    className="w-100 mb-3"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    <i className="nc-icon nc-spaceship"></i> Try Demo Account
                  </Button>

                  <hr />

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <Link to="/auth/register" className="text-success fw-bold">
                        Create Account
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="text-muted small">
                By signing in, you agree to our{" "}
                <Link to="/admin/about" className="text-success">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/admin/contact" className="text-success">Privacy Policy</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;