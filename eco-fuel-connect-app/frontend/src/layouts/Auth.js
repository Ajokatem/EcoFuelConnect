import React from "react";
import { useLocation, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";

import Login from "../pages/Login.js";
import Register from "../pages/Register.js";

function Auth() {
  const location = useLocation();
  
  console.log('Auth layout - current location:', location.pathname);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  return (
    <Switch>
      <Route exact path="/auth/login" component={Login} />
      <Route exact path="/auth/register" component={Register} />
      <Route path="/auth" render={() => (
        <div 
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Container>
            <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>
              <h3>EcoFuelConnect Auth</h3>
              <p>Current path: {location.pathname}</p>
              <div style={{marginTop: '20px'}}>
                <a href="/auth/login" style={{color: 'white', margin: '0 10px', textDecoration: 'none'}}>
                  → Go to Login
                </a>
                <a href="/auth/register" style={{color: 'white', margin: '0 10px', textDecoration: 'none'}}>
                  → Go to Register
                </a>
              </div>
            </div>
          </Container>
        </div>
      )} />
    </Switch>
  );
}

export default Auth;
