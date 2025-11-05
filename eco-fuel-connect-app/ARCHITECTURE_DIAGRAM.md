# EcoFuelConnect Dashboard Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGIN                               │
│                    (Authentication Layer)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROLE IDENTIFICATION                           │
│              (UserContext + JWT Token)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬───────────────┐
         │               │               │               │
         ▼               ▼               ▼               ▼
    ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
    │ ADMIN  │      │SUPPLIER│      │ SCHOOL │      │PRODUCER│
    │  ROLE  │      │  ROLE  │      │  ROLE  │      │  ROLE  │
    └────┬───┘      └────┬───┘      └────┬───┘      └────┬───┘
         │               │               │               │
         ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│              DASHBOARD COMPONENT SELECTION                       │
│           (getDashboardComponent() function)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬───────────────┐
         │               │               │               │
         ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    Admin     │ │   Supplier   │ │    School    │ │   Producer   │
│  Dashboard   │ │  Dashboard   │ │  Dashboard   │ │  Dashboard   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API REQUEST                                   │
│         GET /api/dashboard/stats                                 │
│         Authorization: Bearer <JWT_TOKEN>                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND MIDDLEWARE                               │
│              (auth.js - Token Validation)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              ROLE-BASED DATA RETRIEVAL                           │
│           (dashboard.js - Role-specific queries)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬───────────────┐
         │               │               │               │
         ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ System-wide  │ │  Supplier    │ │   School     │ │  Producer    │
│    Stats     │ │   Stats      │ │   Stats      │ │   Stats      │
│              │ │              │ │              │ │              │
│ • All users  │ │ • Waste      │ │ • Fuel       │ │ • Biogas     │
│ • Schools    │ │   supplied   │ │   requests   │ │   produced   │
│ • Suppliers  │ │ • Earnings   │ │ • Deliveries │ │ • Efficiency │
│ • Producers  │ │ • Impact     │ │ • Savings    │ │ • Schools    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DASHBOARD RENDER                               │
│              (Role-specific UI Display)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
│
├── BrowserRouter
│   │
│   ├── Switch
│   │   │
│   │   ├── Route (/) → Welcome
│   │   ├── Route (/auth) → AuthLayout
│   │   │   ├── Login
│   │   │   └── Register
│   │   │
│   │   └── Route (/admin) → AdminLayout
│   │       │
│   │       ├── Sidebar (Role-filtered routes)
│   │       ├── AdminNavbar
│   │       │
│   │       └── Content Area
│   │           │
│   │           ├── /dashboard → getDashboardComponent(role)
│   │           │   │
│   │           │   ├── AdminDashboard (if role === 'admin')
│   │           │   ├── SupplierDashboard (if role === 'supplier')
│   │           │   ├── SchoolDashboard (if role === 'school')
│   │           │   └── Dashboard (if role === 'producer')
│   │           │
│   │           ├── /user → UserProfile
│   │           ├── /messages → Messages
│   │           ├── /organic-waste-logging → OrganicWasteLogging (Supplier only)
│   │           ├── /fuel-request-management → FuelRequestManagement (School only)
│   │           ├── /educational-content → EducationalContent (Admin only)
│   │           ├── /admin-content → AdminContentManagement (Admin only)
│   │           ├── /reports → Reports
│   │           ├── /notifications → Notifications
│   │           ├── /help → Help
│   │           └── /settings → Settings
│   │
│   └── Footer
```

## Data Flow Diagram

```
┌──────────────┐
│   Frontend   │
│  Dashboard   │
└──────┬───────┘
       │
       │ 1. Component mounts
       │ 2. useEffect() triggers
       │ 3. fetchDashboardData()
       │
       ▼
┌──────────────────────────────────────┐
│   dashboardService.getDashboardStats()│
└──────┬───────────────────────────────┘
       │
       │ 4. HTTP GET request
       │    with JWT token
       │
       ▼
┌──────────────────────────────────────┐
│   Backend API                         │
│   /api/dashboard/stats                │
└──────┬───────────────────────────────┘
       │
       │ 5. auth middleware
       │    validates token
       │
       ▼
┌──────────────────────────────────────┐
│   Extract user role                   │
│   from req.user.role                  │
└──────┬───────────────────────────────┘
       │
       │ 6. Query database
       │    based on role
       │
       ▼
┌──────────────────────────────────────┐
│   Database Queries                    │
│   • Users table                       │
│   • WasteEntries table                │
│   • FuelRequests table                │
└──────┬───────────────────────────────┘
       │
       │ 7. Calculate stats
       │    based on role
       │
       ▼
┌──────────────────────────────────────┐
│   Return JSON response                │
│   with role-specific data             │
└──────┬───────────────────────────────┘
       │
       │ 8. Response received
       │
       ▼
┌──────────────────────────────────────┐
│   Frontend Dashboard                  │
│   setStats(data)                      │
└──────┬───────────────────────────────┘
       │
       │ 9. State updated
       │
       ▼
┌──────────────────────────────────────┐
│   Dashboard Re-renders                │
│   with new data                       │
└──────────────────────────────────────┘
```

## Route Protection Flow

```
User navigates to /admin/educational-content
                │
                ▼
┌────────────────────────────────────────┐
│  Check if user is authenticated        │
│  (JWT token exists)                    │
└────────┬───────────────────────────────┘
         │
    ┌────┴────┐
    │         │
   NO        YES
    │         │
    ▼         ▼
Redirect  ┌────────────────────────────┐
to Login  │ Check user role            │
          │ (from UserContext)         │
          └────────┬───────────────────┘
                   │
              ┌────┴────┐
              │         │
            ADMIN    NON-ADMIN
              │         │
              ▼         ▼
         ┌────────┐  ┌──────────────┐
         │ Allow  │  │ Route not in │
         │ Access │  │ sidebar      │
         └────────┘  │ (filtered)   │
                     └──────────────┘
```

## Sidebar Filtering Logic

```
dashboardRoutes (all routes)
        │
        ▼
getDashboardRoutesByRole(user.role)
        │
        ├─── if role === 'admin'
        │    └─→ Return ALL routes (including adminOnly)
        │
        ├─── if role === 'supplier'
        │    └─→ Filter: dashboard, user, messages, waste-logging,
        │              reports, notifications, help, settings
        │
        ├─── if role === 'school'
        │    └─→ Filter: dashboard, user, messages, fuel-requests,
        │              reports, notifications, help, settings
        │
        └─── if role === 'producer'
             └─→ Filter: dashboard, user, messages, reports,
                       notifications, help, settings
        │
        ▼
Filtered routes passed to Sidebar
        │
        ▼
Sidebar.js applies additional filtering
        │
        ├─→ Hide routes with adminOnly: true
        │   if user.role !== 'admin'
        │
        └─→ Render visible routes
```

## Database Schema (Relevant Tables)

```
┌─────────────────────────────────────────┐
│              USERS TABLE                 │
├─────────────────────────────────────────┤
│ id (PK)                                  │
│ firstName                                │
│ lastName                                 │
│ email                                    │
│ password (hashed)                        │
│ role (admin/supplier/school/producer)    │
│ organization                             │
│ phone                                    │
│ isActive                                 │
│ createdAt                                │
│ updatedAt                                │
└─────────────────────────────────────────┘
         │
         │ Referenced by
         │
    ┌────┴────┬────────────────┐
    │         │                │
    ▼         ▼                ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│ WASTE   │ │  FUEL    │ │NOTIFICA- │
│ ENTRIES │ │ REQUESTS │ │  TIONS   │
├─────────┤ ├──────────┤ ├──────────┤
│ id (PK) │ │ id (PK)  │ │ id (PK)  │
│supplier │ │ schoolId │ │ userId   │
│  Id(FK) │ │   (FK)   │ │   (FK)   │
│producer │ │producer  │ │ type     │
│  Id(FK) │ │  Id(FK)  │ │ message  │
│wasteType│ │fuelType  │ │ isRead   │
│quantity │ │quantity  │ │createdAt │
│status   │ │status    │ └──────────┘
│createdAt│ │createdAt │
└─────────┘ └──────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    LAYER 1: FRONTEND                     │
│  • Route filtering based on role                         │
│  • Sidebar hides unauthorized routes                     │
│  • Components check user role before rendering           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                LAYER 2: AUTHENTICATION                   │
│  • JWT token validation                                  │
│  • Token expiration check                                │
│  • User session management                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                LAYER 3: AUTHORIZATION                    │
│  • Role verification in middleware                       │
│  • Endpoint-level access control                         │
│  • Admin-only route protection                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                LAYER 4: DATA SEGREGATION                 │
│  • Role-based database queries                           │
│  • User-specific data filtering                          │
│  • Sensitive data masking                                │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
eco-fuel-connect-app/
│
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.js         ← NEW
│   │   ├── SupplierDashboard.js      ← NEW
│   │   ├── SchoolDashboard.js        ← NEW
│   │   ├── Dashboard.js              (Producer)
│   │   ├── UserProfile.js
│   │   ├── FuelRequestManagement.js
│   │   ├── OrganicWasteLogging.js
│   │   ├── EducationalContent.js     (Admin only)
│   │   └── ...
│   │
│   ├── layouts/
│   │   └── Admin.js                  ← MODIFIED
│   │
│   ├── components/
│   │   └── Sidebar/
│   │       └── Sidebar.js            ← MODIFIED
│   │
│   ├── contexts/
│   │   └── UserContext.js
│   │
│   ├── services/
│   │   └── dashboardService.js
│   │
│   └── routes.js                     ← MODIFIED
│
├── backend/
│   ├── routes/
│   │   ├── dashboard.js              ← MODIFIED
│   │   ├── auth.js
│   │   ├── wasteLogging.js
│   │   └── fuelRequests.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   └── models/
│       ├── User.js
│       ├── WasteEntry.js
│       └── FuelRequest.js
│
└── Documentation/
    ├── DASHBOARD_IMPLEMENTATION.md   ← NEW
    ├── TESTING_GUIDE.md              ← NEW
    ├── IMPLEMENTATION_SUMMARY.md     ← NEW
    ├── QUICK_START.md                ← NEW
    └── ARCHITECTURE_DIAGRAM.md       ← NEW (this file)
```

## Request/Response Flow Example

### Admin Dashboard Request

```
1. User logs in as admin
   └─→ JWT token generated with role: 'admin'

2. Navigate to /admin/dashboard
   └─→ getDashboardComponent('admin') returns AdminDashboard

3. AdminDashboard mounts
   └─→ useEffect() calls fetchDashboardData()

4. API Request:
   GET /api/dashboard/stats
   Headers: {
     Authorization: Bearer eyJhbGc...
   }

5. Backend Processing:
   • auth middleware validates token
   • Extract user role: 'admin'
   • Query all users, schools, suppliers, producers
   • Calculate system-wide stats

6. API Response:
   {
     "stats": {
       "totalUsers": 45,
       "totalSchools": 12,
       "totalSuppliers": 8,
       "totalProducers": 5,
       "totalWaste": 2840,
       "biogasProduced": 852,
       ...
     }
   }

7. Frontend Updates:
   • setStats(data.stats)
   • Dashboard re-renders with new data
   • Metrics display on screen
```

## Summary

This architecture provides:
- ✓ Clear separation of concerns
- ✓ Role-based access control at multiple layers
- ✓ Secure data segregation
- ✓ Scalable component structure
- ✓ Maintainable codebase
- ✓ Consistent user experience
