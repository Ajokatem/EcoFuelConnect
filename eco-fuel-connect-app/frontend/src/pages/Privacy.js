import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Privacy() {
  return (
    <Container fluid style={{ minHeight: '100vh', background: '#fff', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="mb-5">
          <h1 style={{ color: '#25805a', fontWeight: '700', fontSize: '2.5rem', marginBottom: '10px' }}>Privacy Policy</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Effective Date: January 1, 2025 | Last Updated: January 15, 2025</p>
        </div>

        <div style={{ color: '#2F4F4F', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>1. Introduction</h2>
            <p>
              EcoFuelConnect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our biogas waste management platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
            <p>
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>2. Information We Collect</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>2.1 Personal Information</h3>
            <p>We collect information that you voluntarily provide to us when you register on the platform, including:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Full name (first and last name)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Organization name and details</li>
              <li>Role/account type (school, supplier, producer)</li>
              <li>Physical address and location data</li>
              <li>Profile photograph (optional)</li>
            </ul>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>2.2 Waste Management Data</h3>
            <p>When you use our platform, we collect operational data including:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Waste collection records (type, quantity, source, timestamp)</li>
              <li>GPS coordinates and geolocation data for waste collection points</li>
              <li>Photographs of waste materials</li>
              <li>Biogas production metrics and volumes</li>
              <li>Fuel delivery requests and schedules</li>
              <li>Transaction history and payment information</li>
            </ul>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>2.3 Automatically Collected Information</h3>
            <p>When you access our platform, we automatically collect certain information about your device, including:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>IP address and device identifiers</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Access times and dates</li>
              <li>Pages viewed and links clicked</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Service Delivery:</strong> To create and manage your account, process waste logging entries, coordinate biogas production, and facilitate fuel deliveries</li>
              <li><strong>Communication:</strong> To send you administrative information, updates, security alerts, and support messages</li>
              <li><strong>Analytics:</strong> To monitor and analyze usage patterns, improve our services, and develop new features</li>
              <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms of service</li>
              <li><strong>Safety:</strong> To protect against fraudulent, unauthorized, or illegal activity</li>
              <li><strong>Marketing:</strong> With your consent, to send promotional communications about new features, events, and educational content</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>4. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>4.1 With Other Users</h3>
            <p>Certain information (organization name, location, waste collection data) may be visible to other platform users to facilitate waste management operations and biogas distribution.</p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>4.2 Service Providers</h3>
            <p>We may share your information with third-party service providers who perform services on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.</p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>4.3 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, government agencies).</p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>4.4 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Encryption of data in transit using SSL/TLS protocols</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
            <p>Specific retention periods:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Account information: Retained while your account is active and for 3 years after account closure</li>
              <li>Waste logging data: Retained for 7 years for compliance and audit purposes</li>
              <li>Transaction records: Retained for 10 years as required by financial regulations</li>
              <li>Communication logs: Retained for 2 years</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>7. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Access:</strong> Request access to your personal information and obtain a copy</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where consent was the legal basis</li>
            </ul>
            <p>
              To exercise these rights, please contact us at a.biar@alustudent.com. We will respond to your request within 30 days.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our platform and store certain information. Types of cookies we use:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
              <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
            </ul>
            <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>9. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites and services. We are not responsible for the privacy practices or content of these third parties. We encourage you to read the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>10. Children's Privacy</h2>
            <p>
              Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our platform, you consent to such transfers.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we will provide more prominent notice (including email notification for certain services).
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>13. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <div style={{ marginLeft: '20px', marginTop: '15px' }}>
              <p><strong>Email:</strong> a.biar@alustudent.com</p>
              <p><strong>Phone:</strong> +250792104895</p>
              <p><strong>Address:</strong> Kigali, Rwanda</p>
            </div>
          </section>
        </div>

        <div className="text-center mt-5 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
          <Link to="/auth/register" style={{ color: '#25805a', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
            ← Back to Registration
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default Privacy;
