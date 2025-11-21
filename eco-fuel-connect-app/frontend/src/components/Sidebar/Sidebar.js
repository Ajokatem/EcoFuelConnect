import React, { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import { useLanguage } from "../../contexts/LanguageContext";



function Sidebar({ routes }) {
  const location = useLocation();
  const { user } = useUser();
  const { translate } = useLanguage();

  // Filter routes for sidebar: hide admin-only routes for non-admins
  const filteredRoutes = routes.filter(route => {
    // Hide admin-only routes from non-admins
    if (route.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  // Force override sidebar styles
  useEffect(() => {
    const sidebarElement = document.querySelector('.sidebar');
    const sidebarBackground = document.querySelector('.sidebar-background');
    
    if (sidebarElement) {
      sidebarElement.style.setProperty('background', 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%)', 'important');
      sidebarElement.style.setProperty('background-color', '#25805a', 'important');
      sidebarElement.style.setProperty('background-image', 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%)', 'important');
    }
    
    if (sidebarBackground) {
      sidebarBackground.style.setProperty('background', 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%)', 'important');
      sidebarBackground.style.setProperty('background-color', '#25805a', 'important');
      sidebarBackground.style.setProperty('background-image', 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%)', 'important');
    }
  }, []);

  const isActiveRoute = (routePath) => {
    return location.pathname.startsWith(routePath) ? "active" : "";
  };

  return (
    <>
      <style>
        {`
          .sidebar,
          body > .navbar-collapse {
            background: linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important;
            background-color: #25805a !important;
            background-image: linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important;
          }
          .sidebar .sidebar-background,
          body > .navbar-collapse .sidebar-background {
            background: linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important;
            background-color: #25805a !important;
            background-image: linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important;
          }
        `}
      </style>
      <div
        className="sidebar"
        style={{ 
          background: 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important',
          backgroundColor: '#25805a !important',
          backgroundImage: 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important',
          boxShadow: '4px 0 20px rgba(37, 128, 90, 0.3)'
        }}
      >
      <div 
        className="sidebar-background" 
        style={{
          background: 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important',
          backgroundColor: '#25805a !important',
          backgroundImage: 'linear-gradient(180deg, #25805a 0%, #1e6b47 100%) !important',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start px-3 py-4">
          <a href="/" className="simple-text logo-mini me-3">
            <div className="logo-img">
              <img
                src={require("../../assets/img/recycle-symbol.png")}
                alt="EcoFuelConnect Logo"
                style={{ width: 40, height: 45, marginRight: '12px' }}
              />
            </div>
          </a>
          <a 
            href="/" 
            className="simple-text fw-bold text-white"
            style={{
              fontWeight: '700',
              fontSize: '0.85rem',
              letterSpacing: '0.3px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #ffffff 0%, #d4f5e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              fontFamily: '"Inter", "Segoe UI", sans-serif'
            }}
          >
            EcoFuelConnect
          </a>
        </div>
        <Nav as="ul" className="list-unstyled ps-0">
          {filteredRoutes.map((route, key) => {
            if (route.redirect) return null;
            return (
              <li
                key={key}
                className={`nav-item ${route.upgrade ? "active active-pro" : ""} ${isActiveRoute(
                  route.layout + route.path
                )}`}
              >
                <NavLink
                  to={route.layout + route.path}
                  className="nav-link d-flex align-items-center text-white"
                  activeClassName="active"
                  style={{
                    padding: '12px 20px',
                    margin: '4px 12px',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    letterSpacing: '0.3px',
                    textDecoration: 'none',
                    fontFamily: '"Inter", "Segoe UI", sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    const navLink = e.target.closest('.nav-link');
                    if (navLink) {
                      navLink.style.background = 'rgba(255,255,255,0.15)';
                      navLink.style.transform = 'translateX(5px)';
                      navLink.style.color = '#d4f5e0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const navLink = e.target.closest('.nav-link');
                    if (navLink && !navLink.classList.contains('active')) {
                      navLink.style.background = 'transparent';
                      navLink.style.transform = 'translateX(0)';
                      navLink.style.color = 'white';
                    }
                  }}
                >
                  <i 
                    className={`${route.icon} me-3`}
                    style={{
                      fontSize: '1.2rem',
                      opacity: '0.9'
                    }}
                  ></i>
                  <span style={{opacity: '0.95'}}>{translate(route.translationKey || route.name)}</span>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
    </>
  );
}

export default Sidebar;
