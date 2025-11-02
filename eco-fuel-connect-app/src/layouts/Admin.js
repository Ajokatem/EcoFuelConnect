
import React, { Component } from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";

import { dashboardRoutes, getDashboardRoutesByRole, additionalAdminRoutes } from "../routes.js";
import { useUser } from "../contexts/UserContext";

function Admin() {
  const { user } = useUser();
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const filteredRoutes = getDashboardRoutesByRole(user?.role);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getAllRoutes = () => {
    return [...getRoutes(filteredRoutes), ...getRoutes(additionalAdminRoutes)];
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar routes={filteredRoutes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content" style={{padding: '0', margin: '0'}}>
            <Switch>{getAllRoutes()}</Switch>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
