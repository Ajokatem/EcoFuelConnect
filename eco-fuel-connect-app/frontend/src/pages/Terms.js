import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Terms() {
  return (
    <Container fluid style={{ minHeight: '100vh', background: '#fff', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="mb-5">
          <h1 style={{ color: '#25805a', fontWeight: '700', fontSize: '2.5rem', marginBottom: '10px' }}>Terms of Service</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Effective Date: January 1, 2025 | Last Updated: January 15, 2025</p>
        </div>

        <div style={{ color: '#2F4F4F', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and EcoFuelConnect ("Company," "we," "us," or "our") concerning your access to and use of the EcoFuelConnect platform, including our website, mobile application, and related services (collectively, the "Platform").
            </p>
            <p>
              By accessing or using the Platform, you agree that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>2. Eligibility and Account Registration</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>2.1 Eligibility</h3>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into contracts to use the Platform. By using the Platform, you represent and warrant that you meet these eligibility requirements.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>2.2 Account Creation</h3>
            <p>To access certain features of the Platform, you must create an account. When creating an account, you agree to:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Immediately notify us of any unauthorized use of your account</li>
            </ul>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>2.3 Account Types</h3>
            <p>The Platform offers different account types for different user roles:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Schools:</strong> Educational institutions requesting biogas fuel</li>
              <li><strong>Waste Suppliers:</strong> Individuals or organizations providing organic waste</li>
              <li><strong>Biogas Producers:</strong> Facilities converting waste into biogas</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>3. Platform Use and Restrictions</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>3.1 License Grant</h3>
            <p>
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for its intended purpose.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>3.2 Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Use the Platform for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Violate or infringe upon the rights of others, including intellectual property rights</li>
              <li>Transmit any viruses, malware, or other malicious code</li>
              <li>Attempt to gain unauthorized access to the Platform or related systems</li>
              <li>Interfere with or disrupt the Platform or servers or networks connected to the Platform</li>
              <li>Use automated systems (bots, scrapers) to access the Platform without our permission</li>
              <li>Impersonate any person or entity or falsely state or misrepresent your affiliation</li>
              <li>Collect or store personal data about other users without their consent</li>
              <li>Submit false, inaccurate, or misleading waste logging data</li>
              <li>Engage in any fraudulent activities or schemes</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>4. Waste Logging and Data Accuracy</h2>
            <p>
              Users who log waste data agree to provide accurate, truthful, and verifiable information. This includes:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Accurate waste type classification</li>
              <li>Correct quantity measurements</li>
              <li>Authentic photographs of waste materials</li>
              <li>Accurate GPS location data</li>
              <li>Truthful source information</li>
            </ul>
            <p>
              Falsification of waste data may result in immediate account suspension or termination, and may be reported to relevant authorities if fraud is suspected.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>5. Biogas Production and Delivery</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>5.1 Producer Obligations</h3>
            <p>Biogas producers agree to:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Maintain accurate production records</li>
              <li>Ensure biogas quality meets safety standards</li>
              <li>Fulfill delivery commitments in a timely manner</li>
              <li>Comply with all applicable environmental and safety regulations</li>
            </ul>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>5.2 School Obligations</h3>
            <p>Schools requesting biogas fuel agree to:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Provide accurate fuel requirements</li>
              <li>Ensure safe storage facilities</li>
              <li>Make timely payments for delivered fuel</li>
              <li>Follow proper handling and safety procedures</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>6. Payment Terms</h2>
            <p>
              For services involving payment transactions:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>All prices are stated in the applicable currency and are subject to change</li>
              <li>Payment is due according to the terms specified in each transaction</li>
              <li>We use third-party payment processors and are not responsible for their errors</li>
              <li>Refunds are handled on a case-by-case basis according to our refund policy</li>
              <li>You are responsible for all taxes associated with your transactions</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>7. Intellectual Property Rights</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>7.1 Our Intellectual Property</h3>
            <p>
              The Platform and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by EcoFuelConnect and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>7.2 User Content</h3>
            <p>
              By submitting content to the Platform (including waste photos, data, and communications), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content for the purpose of operating and improving the Platform.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>8. Disclaimers and Limitations of Liability</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>8.1 Platform "As Is"</h3>
            <p>
              THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>8.2 Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ECOFUELCONNECT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>8.3 Third-Party Interactions</h3>
            <p>
              We are not responsible for the actions, content, or data of third parties, and you release us from any claims and damages arising from your interactions with other users or third-party services.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless EcoFuelConnect and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Your access to or use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the Platform</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including but not limited to:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Breach of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Requests by law enforcement or government agencies</li>
              <li>Extended periods of inactivity</li>
              <li>Technical or security issues</li>
            </ul>
            <p>
              Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>11. Dispute Resolution</h2>
            
            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>11.1 Informal Resolution</h3>
            <p>
              Before filing a formal dispute, you agree to first contact us at a.biar@alustudent.com to attempt to resolve the issue informally.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>11.2 Arbitration</h3>
            <p>
              Any dispute arising out of or relating to these Terms or the Platform shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration association, rather than in court.
            </p>

            <h3 style={{ color: '#2F4F4F', fontSize: '1.2rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }}>11.3 Class Action Waiver</h3>
            <p>
              You agree that any arbitration or proceeding shall be limited to the dispute between you and us individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Rwanda, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in Kigali, Rwanda.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>14. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published by us on the Platform, constitute the entire agreement between you and EcoFuelConnect concerning the Platform and supersede all prior agreements and understandings.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>15. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <div style={{ marginLeft: '20px', marginTop: '15px' }}>
              <p><strong>Email:</strong> a.biar@alustudent.com</p>
              <p><strong>Phone:</strong> +250792104895</p>
              <p><strong>Address:</strong> Kigali, Rwanda</p>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#25805a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>16. Acknowledgment</h2>
            <p>
              BY USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
            </p>
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

export default Terms;
