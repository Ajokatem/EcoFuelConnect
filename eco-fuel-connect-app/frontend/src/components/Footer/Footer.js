import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";

class Footer extends Component {
  static contextType = LanguageContext;

  render() {
    const { translate } = this.context;
    return (
      <footer 
        className="footer px-0 px-lg-3" 
        style={{
          background: 'linear-gradient(135deg, #1e6b47 0%, #25805a 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          paddingTop: '20px',
          paddingBottom: '15px'
        }}
      >
        <Container fluid>
          <nav>
            <ul className="footer-menu d-flex justify-content-center list-unstyled mb-3">
              <li className="mx-3">
                <Link 
                  to="/admin/help" 
                  className="text-decoration-none"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  {translate('help')}
                </Link>
              </li>
              <li className="mx-3">
                <Link 
                  to="/privacy" 
                  className="text-decoration-none"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  {translate('privacy')}
                </Link>
              </li>
              <li className="mx-3">
                <Link 
                  to="/terms" 
                  className="text-decoration-none"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  {translate('terms')}
                </Link>
              </li>
            </ul>
            <p 
              className="text-center small mb-0"
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}
            >
              © {new Date().getFullYear()} EcoFuelConnect <br />
              {translate('footerTagline')}
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;

