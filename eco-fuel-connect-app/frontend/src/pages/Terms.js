import React from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Terms() {
  return (
    <Container fluid style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 20px' }}>
      <Card className="shadow-lg border-0" style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '15px' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 style={{ color: '#25805a', fontWeight: '700' }}>Terms of Service</h2>
            <p style={{ color: '#666' }}>Last updated: January 2025</p>
          </div>

          <div style={{ color: '#2F4F4F', lineHeight: '1.8' }}>
            <h4 style={{ color: '#25805a', marginTop: '30px' }}>1. Acceptance of Terms</h4>
            <p>
              By accessing and using EcoFuelConnect, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>2. Use License</h4>
            <p>
              Permission is granted to temporarily use EcoFuelConnect for personal, non-commercial transitory viewing only.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>3. User Responsibilities</h4>
            <p>
              Users are responsible for maintaining the confidentiality of their account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>4. Data Accuracy</h4>
            <p>
              Users must provide accurate waste logging data. False or misleading information may result in account suspension.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>5. Prohibited Activities</h4>
            <p>
              You may not use EcoFuelConnect for any illegal purposes or to violate any laws in your jurisdiction.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>6. Termination</h4>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>7. Contact Us</h4>
            <p>
              If you have any questions about these Terms, please contact us at a.biar@alustudent.com
            </p>
          </div>

          <div className="text-center mt-5">
            <Link to="/auth/register" style={{ color: '#25805a', textDecoration: 'none', fontWeight: '600' }}>
              ← Back to Registration
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Terms;
