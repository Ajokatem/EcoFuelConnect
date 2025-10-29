import React from 'react';
import { Alert, Container, Row, Col, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Helper to stringify error object
      const getErrorString = (err) => {
        if (!err) return '';
        if (typeof err === 'string') return err;
        if (err instanceof Error) return err.toString();
        try {
          return JSON.stringify(err, null, 2);
        } catch {
          return String(err);
        }
      };
      return (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Alert variant="danger">
                <Alert.Heading>Something went wrong!</Alert.Heading>
                <p>
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details style={{ marginTop: '20px' }}>
                    <summary>Error Details (Development Only)</summary>
                    <pre style={{ marginTop: '10px', fontSize: '12px' }}>
                      {getErrorString(this.state.error)}
                      <br />
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                <hr />
                <div className="d-flex justify-content-center">
                  <Button variant="outline-danger" onClick={this.handleReload}>
                    Refresh Page
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;