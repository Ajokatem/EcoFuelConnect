import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
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
                  to="/" 
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
                  Home
                </Link>
              </li>
              <li className="mx-3">
                <Link 
                  to="/admin/about" 
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
                  About
                </Link>
              </li>
              <li className="mx-3">
                <Link 
                  to="/admin/projects" 
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
                  Projects
                </Link>
              </li>
              <li className="mx-3">
                <Link 
                  to="/admin/contact" 
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
                  Contact
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
              Empowering South Sudan through sustainable biogas technology and organic waste management.
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;

