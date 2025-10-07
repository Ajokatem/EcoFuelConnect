
import Dashboard from "./pages/Dashboard.js";
import UserProfile from "./pages/UserProfile.js";
import FuelRequestManagement from "./pages/FuelRequestManagement.js";
import Reports from "./pages/Reports.js";
import EducationalContent from "./pages/EducationalContent.js";
import Help from "./pages/Help.js";
import Notifications from "./pages/Notifications.js";
import OrganicWasteLogging from "./pages/OrganicWasteLogging.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Projects from "./pages/Projects.js";
import Settings from "./pages/Settings.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Welcome from "./pages/Welcome.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-bar-32",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/educational-content",
    name: "Educational Content",
    icon: "nc-icon nc-tv-2",
    component: EducationalContent,
    layout: "/admin"
  },
  {
    path: "/organic-waste-logging",
    name: "Organic Waste Logging",
    icon: "nc-icon nc-planet",
    component: OrganicWasteLogging,
    layout: "/admin"
  },
  {
    path: "/fuel-request-management",
    name: "Fuel Request Management",
    icon: "nc-icon nc-delivery-fast",
    component: FuelRequestManagement,
    layout: "/admin"
  },
  {
    path: "/reports",
    name: "Reports",
    icon: "nc-icon nc-chart-pie-36",
    component: Reports,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/help",
    name: "Help",
    icon: "nc-icon nc-bulb-63",
    component: Help,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "nc-icon nc-settings-gear-64",
    component: Settings,
    layout: "/admin"
  }
];

// Auth routes (separate from dashboard routes)
export const authRoutes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    layout: ""
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register", 
    name: "Register",
    component: Register,
    layout: "/auth"
  }
];

// Additional admin routes (not shown in sidebar)
export const additionalAdminRoutes = [
  {
    path: "/about",
    name: "About",
    component: About,
    layout: "/admin"
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
    layout: "/admin"
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    layout: "/admin"
  }
];

export default dashboardRoutes;
