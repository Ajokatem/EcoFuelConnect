import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

import routes from "../../routes.js";

function Header() {
  const location = useLocation();

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "eco-fuel-body-click";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for(let i=0; i<routes.length; i++) {
      if(location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  }

  return (
    <Navbar 
      expand="lg" 
      style={{
        background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
        boxShadow: '0 2px 10px rgba(37, 128, 90, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white'
            }}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand 
            href="#home" 
            onClick={e => e.preventDefault()} 
            className="mr-2"
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '1.25rem',
              fontFamily: '"Inter", "Segoe UI", sans-serif'
            }}
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="eco-fuel-navbar-nav" className="mr-2" style={{borderColor: 'rgba(255, 255, 255, 0.3)'}}>
          <span className="navbar-toggler-bar burger-lines" style={{background: 'white'}}></span>
          <span className="navbar-toggler-bar burger-lines" style={{background: 'white'}}></span>
          <span className="navbar-toggler-bar burger-lines" style={{background: 'white'}}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="eco-fuel-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            <Nav.Item>
              <Nav.Link 
                data-toggle="dropdown" 
                href="#pablo" 
                onClick={e => e.preventDefault()} 
                className="m-0"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                <span className="d-lg-none ml-1">Dashboard</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="/" 
                className="nav-link m-0"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Home
              </Link>
            </Nav.Item>
            <Nav.Item className="d-flex align-items-center">
              <div className="search-container d-flex align-items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    padding: '6px 15px',
                    color: 'white',
                    fontSize: '14px',
                    width: '200px',
                    fontFamily: '"Inter", "Segoe UI", sans-serif'
                  }}
                  onFocus={e => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                  onBlur={e => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                />
              </div>
            </Nav.Item>
          </Nav>

          <Nav className="ml-auto" navbar>
            <Nav.Item>
              <Link 
                to="/admin/contact" 
                className="nav-link m-0"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Contact
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link 
                to="/admin/about" 
                className="nav-link m-0"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                About
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant=""
                className="m-0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
              >
                <i className="nc-icon nc-button-power"></i> Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;
