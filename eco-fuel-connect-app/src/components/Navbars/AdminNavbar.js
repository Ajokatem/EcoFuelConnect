import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";

import { dashboardRoutes } from "../../routes.js";

function Header() {
  const location = useLocation();
  const history = useHistory();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to Welcome page after logout
      history.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to Welcome page
      history.push('/');
    }
  };

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
    for(let i=0; i<dashboardRoutes.length; i++) {
      if(location.pathname.indexOf(dashboardRoutes[i].layout + dashboardRoutes[i].path) !== -1) {
        return dashboardRoutes[i].name;
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
          <Nav className="ms-auto" navbar>
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
                onClick={handleLogout}
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
