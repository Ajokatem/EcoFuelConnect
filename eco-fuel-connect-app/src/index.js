
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/eco-fuel-connect.scss?v=1.0.0";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/sidebar-override.css";

import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import Welcome from "./pages/Welcome.js";
import ErrorBoundary from "./components/common/ErrorBoundary.js";
import { LanguageProvider } from "./contexts/LanguageContext.js";
import { ThemeProvider } from "./contexts/ThemeContext.js";
import { UserProvider } from "./contexts/UserContext.js";

ReactDOM.render(
  <ErrorBoundary>
    <LanguageProvider>
      <ThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Welcome} />
              <Route path="/admin" component={AdminLayout} />
              <Route path="/auth" component={AuthLayout} />
              <Redirect from="*" to="/" />
            </Switch>
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  </ErrorBoundary>,
  document.getElementById("root")
);
