# Role-Based Dashboard Implementation

## Overview
This document outlines the implementation of role-based dashboards for the EcoFuelConnect application. The system now supports four distinct dashboard views based on user roles: Admin, Supplier, School, and Producer.

## Changes Made

### 1. New Dashboard Components Created

#### AdminDashboard.js (`src/pages/AdminDashboard.js`)
- **Purpose**: System-wide overview and management for administrators
- **Key Features**:
  - Total users, schools, suppliers, and producers metrics
  - System performance tracking (waste collection, biogas production, fuel deliveries)
  - Quick action buttons for content management, user management, reports, and settings
  - Recent system activity table
- **Access**: Admin role only

#### SupplierDashboard.js (`src/pages/SupplierDashboard.js`)
- **Purpose**: Waste supply tracking and earnings for suppliers
- **Key Features**:
  - Total waste supplied and environmental impact
  - Monthly, weekly, and daily waste metrics
  - Earnings calculation based on waste supplied
  - Recent waste entries table
  - Monthly progress tracking
  - Quick actions for logging waste, viewing reports, and messaging
- **Access**: Supplier role only

#### SchoolDashboard.js (`src/pages/SchoolDashboard.js`)
- **Purpose**: Fuel request management and consumption tracking for schools
- **Key Features**:
  - Total fuel delivered and students benefited
  - Fuel request status tracking (pending, approved, delivered)
  - Cost savings compared to traditional fuel
  - Carbon offset calculations
  - Recent fuel requests table
  - Monthly consumption progress
  - Environmental impact summary
- **Access**: School role only

#### Producer Dashboard (existing Dashboard.js)
- **Purpose**: Production monitoring and biogas generation tracking
- **Access**: Producer role only

### 2. Routing Updates

#### routes.js Updates
- **Imports**: Added AdminDashboard, SupplierDashboard, and SchoolDashboard imports
- **Educational Content**: Marked as `adminOnly: true` to restrict access
- **getDashboardRoutesByRole()**: Updated to filter routes based on user role
  - **Admin**: Full access to all routes including educational content
  - **School**: Access to dashboard, profile, messages, fuel requests, reports, notifications, help, settings
  - **Supplier**: Access to dashboard, profile, messages, waste logging, reports, notifications, help, settings
  - **Producer**: Access to dashboard, profile, messages, reports, notifications, help, settings
- **getDashboardComponent()**: New function to return the appropriate dashboard component based on role

#### Admin.js Layout Updates
- **Dynamic Dashboard Loading**: Uses `getDashboardComponent()` to load the correct dashboard for each role
- **Route Filtering**: Applies role-based filtering to sidebar routes

### 3. Backend API Updates

#### dashboard.js Route Updates
- **Role-Based Stats**: `/api/dashboard/stats` endpoint now returns role-specific data
  - **Admin Stats**: System-wide metrics including all users, waste, biogas, and fuel data
  - **Supplier Stats**: Personal contribution metrics, earnings, and environmental impact
  - **School Stats**: Fuel request metrics, consumption, cost savings, and carbon offset
  - **Producer Stats**: Production metrics, efficiency, and community engagement
- **Data Segregation**: Each role receives only relevant data for their dashboard

### 4. Sidebar Updates

#### Sidebar.js Updates
- **Admin-Only Filtering**: Routes marked with `adminOnly: true` are hidden from non-admin users
- **Educational Content**: Now only visible to admin users
- **Dynamic Route Filtering**: Sidebar automatically adjusts based on user role

## User Role Access Matrix

| Feature | Admin | Supplier | School | Producer |
|---------|-------|----------|--------|----------|
| Dashboard (Role-Specific) | ✓ | ✓ | ✓ | ✓ |
| User Profile | ✓ | ✓ | ✓ | ✓ |
| Messages | ✓ | ✓ | ✓ | ✓ |
| Notifications | ✓ | ✓ | ✓ | ✓ |
| Help | ✓ | ✓ | ✓ | ✓ |
| Settings | ✓ | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | ✓ | ✓ |
| Organic Waste Logging | ✓ | ✓ | ✗ | ✗ |
| Fuel Request Management | ✓ | ✗ | ✓ | ✗ |
| Educational Content | ✓ | ✗ | ✗ | ✗ |
| Content Management | ✓ | ✗ | ✗ | ✗ |

## Dashboard Features by Role

### Admin Dashboard
1. **System Overview**
   - Total users count
   - Schools, suppliers, and producers count
   - System-wide waste and biogas metrics

2. **Performance Tracking**
   - Waste collection progress
   - Biogas production progress
   - Fuel delivery progress
   - User engagement metrics

3. **Quick Actions**
   - Manage content
   - User management
   - View reports
   - System settings

4. **Activity Monitoring**
   - Recent system activities
   - User actions tracking
   - Status updates

### Supplier Dashboard
1. **Contribution Metrics**
   - Total waste supplied
   - Monthly/weekly/daily breakdown
   - Environmental impact (CO₂ reduction)

2. **Financial Tracking**
   - Earnings based on waste supplied
   - Payment status

3. **Waste Management**
   - Recent waste entries
   - Entry status tracking
   - Quality metrics

4. **Progress Tracking**
   - Monthly target progress
   - Performance indicators

### School Dashboard
1. **Fuel Management**
   - Total fuel delivered
   - Pending requests
   - Approved requests

2. **Impact Metrics**
   - Students benefited
   - Cost savings vs traditional fuel
   - Carbon offset achieved

3. **Request Tracking**
   - Recent fuel requests
   - Delivery status
   - Request history

4. **Consumption Analysis**
   - Monthly consumption
   - Usage patterns
   - Environmental benefits

### Producer Dashboard (Existing)
1. **Production Metrics**
   - Biogas produced
   - Production efficiency
   - Weekly activity

2. **Community Impact**
   - Schools served
   - Revenue from carbon credits
   - Waste sources distribution

3. **Performance Tracking**
   - Monthly targets
   - Regional rankings
   - Category rankings

4. **Supplier Management**
   - Active suppliers
   - Waste supplier status
   - Communication tools

## API Endpoints

### Dashboard Stats
- **Endpoint**: `GET /api/dashboard/stats`
- **Authentication**: Required
- **Role-Based Response**: Returns different data based on user role
- **Query Parameters**: `timeframe` (optional, default: 'month')

### Response Structure by Role

#### Admin Response
```json
{
  "stats": {
    "totalUsers": 45,
    "totalSchools": 12,
    "totalSuppliers": 8,
    "totalProducers": 5,
    "totalWaste": 2840,
    "biogasProduced": 852,
    "fuelRequests": 34,
    "fuelDelivered": 680,
    "carbonReduction": 6532,
    "activeUsers": 45,
    "wasteEntriesCount": 156
  }
}
```

#### Supplier Response
```json
{
  "stats": {
    "totalWasteSupplied": 450,
    "monthlyWaste": 150,
    "weeklyWaste": 37.5,
    "wasteEntriesCount": 23,
    "carbonImpact": 1035,
    "earnings": 225,
    "biogasProduced": 135
  }
}
```

#### School Response
```json
{
  "stats": {
    "totalFuelRequests": 8,
    "fuelDelivered": 120,
    "monthlyConsumption": 36,
    "costSavings": 18000,
    "carbonOffset": 276,
    "studentsBenefited": 450
  }
}
```

## Security Considerations

1. **Route Protection**: All dashboard routes require authentication
2. **Role Verification**: Backend validates user role before returning data
3. **Data Segregation**: Users only receive data relevant to their role
4. **Admin-Only Features**: Educational content and content management restricted to admins
5. **Authorization Checks**: Middleware ensures proper role-based access

## Design Consistency

All dashboards follow the EcoFuelConnect design theme:
- **Primary Color**: #25805a (eco-green)
- **Gradient**: linear-gradient(135deg, #4fbe99ff, #6aaf99ff)
- **Card Style**: Rounded corners (12-16px), subtle shadows
- **Typography**: Clean, modern fonts with proper hierarchy
- **Icons**: Consistent icon usage across all dashboards
- **Responsive**: Mobile-first design approach

## Testing Recommendations

1. **Role-Based Access**
   - Test each role can only access their designated dashboard
   - Verify educational content is hidden from non-admins
   - Confirm sidebar routes filter correctly

2. **Data Accuracy**
   - Verify stats match database records
   - Test calculations (biogas, carbon, earnings)
   - Confirm role-specific data segregation

3. **Navigation**
   - Test quick action buttons
   - Verify route transitions
   - Confirm back navigation works

4. **Responsive Design**
   - Test on mobile devices
   - Verify tablet layouts
   - Confirm desktop experience

## Future Enhancements

1. **Real-Time Updates**: Implement WebSocket for live dashboard updates
2. **Advanced Analytics**: Add trend analysis and predictive metrics
3. **Customization**: Allow users to customize their dashboard layout
4. **Export Features**: Enable data export for reports
5. **Notifications**: Add dashboard-specific notification badges
6. **Charts**: Integrate interactive charts for better data visualization

## Deployment Notes

1. **Database**: Ensure all user roles are properly set in the database
2. **Environment**: Verify JWT_SECRET is configured
3. **Dependencies**: All required packages are already installed
4. **Migration**: No database migrations required
5. **Testing**: Test with users of each role before production deployment

## Support

For issues or questions regarding the dashboard implementation:
- Check the STYLE_GUIDE.md for design consistency
- Review the README-Final-product.md for project overview
- Consult the backend API documentation for endpoint details
