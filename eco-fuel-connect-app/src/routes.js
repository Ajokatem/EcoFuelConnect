
import Dashboard from "./pages/Dashboard.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import SupplierDashboard from "./pages/SupplierDashboard.js";
import SchoolDashboard from "./pages/SchoolDashboard.js";
import UserProfile from "./pages/UserProfile.js";
import FuelRequestManagement from "./pages/FuelRequestManagement.js";
import Reports from "./pages/Reports.js";
import EducationalContent from "./pages/EducationalContent.js";
import AdminContentManagement from "./pages/AdminContentManagement.js";
import SupplierRewards from "./pages/SupplierRewards.js";
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
import Terms from "./pages/Terms.js";
import Privacy from "./pages/Privacy.js";
import EducationalDetail from "./pages/EducationalDetail.js";

export const dashboardRoutes = [
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
    path: "/messages",
    name: "Messages",
    icon: "nc-icon nc-email-85",
    component: require("./pages/Messages.js").default,
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
    path: "/admin-content",
    name: "Content Management",
    icon: "nc-icon nc-paper-2",
    component: AdminContentManagement,
    layout: "/admin",
    adminOnly: true
  },
  {
    path: "/organic-waste-logging",
    name: "Organic Waste Logging",
    icon: "nc-icon nc-planet",
    component: OrganicWasteLogging,
    layout: "/admin"
  },
  {
    path: "/rewards",
    name: "My Rewards",
    icon: "nc-icon nc-money-coins",
    component: SupplierRewards,
    layout: "/admin",
    supplierOnly: true
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
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    layout: ""
  },
  {
    path: "/about",
    name: "About",
    component: About,
    layout: ""
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
    layout: ""
  },
  {
    path: "/terms",
    name: "Terms",
    component: Terms,
    layout: ""
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: Privacy,
    layout: ""
  }
];

// Additional admin routes (not shown in sidebar)
export const additionalAdminRoutes = [
  {
    path: "/educational-detail/:topicId",
    name: "Educational Detail",
    component: EducationalDetail,
    layout: "/admin"
  }
];

// Role-based route filtering
export function getDashboardRoutesByRole(role) {
  if (role === 'admin') {
    // Admin: Full access to all routes
    return dashboardRoutes;
  }
  if (role === 'school') {
    // Schools: No waste log, no reports - only fuel requests, dashboard, profile, messages, educational content, notifications, help, settings
    return dashboardRoutes.filter(route =>
      ["/dashboard", "/user", "/messages", "/fuel-request-management", "/educational-content", "/notifications", "/help", "/settings"].includes(route.path)
    );
  }
  if (role === 'supplier') {
    // Suppliers: No fuel request, no reports - only waste logs, rewards, dashboard, profile, messages, educational content, notifications, help, settings
    return dashboardRoutes.filter(route =>
      ["/dashboard", "/user", "/messages", "/organic-waste-logging", "/rewards", "/educational-content", "/notifications", "/help", "/settings"].includes(route.path)
    );
  }
  if (role === 'producer') {
    // Producers: dashboard, user, messages, reports, educational content, notifications, help, settings
    return dashboardRoutes.filter(route =>
      ["/dashboard", "/user", "/messages", "/reports", "/educational-content", "/notifications", "/help", "/settings"].includes(route.path)
    );
  }
  // Default: show all except admin-only routes
  return dashboardRoutes.filter(route => !route.adminOnly);
}

// Get the appropriate dashboard component based on user role
export function getDashboardComponent(role) {
  switch(role) {
    case 'admin':
      return AdminDashboard;
    case 'supplier':
      return SupplierDashboard;
    case 'school':
      return SchoolDashboard;
    case 'producer':
      return Dashboard;
    default:
      return Dashboard;
  }
}
