import React from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Privacy() {
  return (
    <Container fluid style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 20px' }}>
      <Card className="shadow-lg border-0" style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '15px' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 style={{ color: '#25805a', fontWeight: '700' }}>Privacy Policy</h2>
            <p style={{ color: '#666' }}>Last updated: January 2025</p>
          </div>

          <div style={{ color: '#2F4F4F', lineHeight: '1.8' }}>
            <h4 style={{ color: '#25805a', marginTop: '30px' }}>1. Information We Collect</h4>
            <p>
              We collect information you provide directly to us, including name, email address, organization details, and waste logging data.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>2. How We Use Your Information</h4>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to process waste entries, and to communicate with you.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>3. Information Sharing</h4>
            <p>
              We do not share your personal information with third parties except as described in this policy or with your consent.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>4. Data Security</h4>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>5. Your Rights</h4>
            <p>
              You have the right to access, update, or delete your personal information at any time through your account settings.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>6. Cookies</h4>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>7. Changes to This Policy</h4>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h4 style={{ color: '#25805a', marginTop: '30px' }}>8. Contact Us</h4>
            <p>
              If you have any questions about this Privacy Policy, please contact us at a.biar@alustudent.com
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

export default Privacy;
