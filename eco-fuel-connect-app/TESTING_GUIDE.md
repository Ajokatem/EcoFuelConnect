# Dashboard Testing Guide

## Quick Test Checklist

### 1. Admin Dashboard Testing
**Login as Admin**
- [ ] Dashboard loads with admin-specific metrics
- [ ] Can see total users, schools, suppliers, producers
- [ ] System performance section displays correctly
- [ ] Quick action buttons work:
  - [ ] Manage Content button navigates to `/admin/admin-content`
  - [ ] User Management button navigates to `/admin/user`
  - [ ] View Reports button navigates to `/admin/reports`
  - [ ] System Settings button navigates to `/admin/settings`
- [ ] Recent activity table displays
- [ ] Educational Content appears in sidebar
- [ ] Content Management appears in sidebar

### 2. Supplier Dashboard Testing
**Login as Supplier**
- [ ] Dashboard loads with supplier-specific metrics
- [ ] Can see total waste supplied
- [ ] Environmental impact (CO₂) displays
- [ ] Monthly, weekly metrics show correctly
- [ ] Earnings calculation displays
- [ ] Recent waste entries table shows
- [ ] Monthly progress bar works
- [ ] Quick actions work:
  - [ ] New Entry button navigates to `/admin/organic-waste-logging`
  - [ ] View Reports button navigates to `/admin/reports`
  - [ ] Messages button navigates to `/admin/messages`
- [ ] Educational Content NOT in sidebar
- [ ] Fuel Request Management NOT in sidebar

### 3. School Dashboard Testing
**Login as School**
- [ ] Dashboard loads with school-specific metrics
- [ ] Can see total fuel delivered
- [ ] Students benefited displays
- [ ] Total requests, pending, cost savings show
- [ ] Carbon offset displays
- [ ] Recent fuel requests table shows
- [ ] Monthly consumption progress bar works
- [ ] Environmental impact section displays
- [ ] Quick actions work:
  - [ ] New Request button navigates to `/admin/fuel-request-management`
  - [ ] View Reports button navigates to `/admin/reports`
  - [ ] Messages button navigates to `/admin/messages`
- [ ] Educational Content NOT in sidebar
- [ ] Organic Waste Logging NOT in sidebar

### 4. Producer Dashboard Testing
**Login as Producer**
- [ ] Dashboard loads with producer-specific metrics
- [ ] Biogas production displays
- [ ] Weekly activity chart shows
- [ ] Schools served metric displays
- [ ] Revenue from carbon credits shows
- [ ] Waste source distribution displays
- [ ] Performance table shows school deliveries
- [ ] Waste suppliers section displays
- [ ] Progress track section shows
- [ ] Regional/country/category rankings display
- [ ] Educational Content NOT in sidebar

## API Testing

### Test Dashboard Stats Endpoint

#### Admin Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```
**Expected Response**: Full system stats with all users, waste, biogas data

#### Supplier Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_SUPPLIER_TOKEN" \
  -H "Content-Type: application/json"
```
**Expected Response**: Supplier-specific stats with personal contribution data

#### School Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_SCHOOL_TOKEN" \
  -H "Content-Type: application/json"
```
**Expected Response**: School-specific stats with fuel request data

#### Producer Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_PRODUCER_TOKEN" \
  -H "Content-Type: application/json"
```
**Expected Response**: Producer-specific stats with production data

## Route Access Testing

### Test Educational Content Access

#### Admin (Should Work)
```
Navigate to: /admin/educational-content
Expected: Page loads successfully
```

#### Non-Admin (Should Fail)
```
Navigate to: /admin/educational-content
Expected: Route not in sidebar, direct access should redirect or show error
```

### Test Waste Logging Access

#### Supplier (Should Work)
```
Navigate to: /admin/organic-waste-logging
Expected: Page loads successfully
```

#### School (Should Fail)
```
Navigate to: /admin/organic-waste-logging
Expected: Route not in sidebar
```

### Test Fuel Request Access

#### School (Should Work)
```
Navigate to: /admin/fuel-request-management
Expected: Page loads successfully
```

#### Supplier (Should Fail)
```
Navigate to: /admin/fuel-request-management
Expected: Route not in sidebar
```

## Data Validation Testing

### Verify Calculations

#### Supplier Dashboard
- [ ] Earnings = totalWasteSupplied * 0.5
- [ ] Carbon Impact = totalWasteSupplied * 2.3
- [ ] Monthly Waste = totalWasteSupplied (if within current month)
- [ ] Weekly Waste = monthlyWaste / 4

#### School Dashboard
- [ ] Cost Savings = fuelDelivered * 150
- [ ] Carbon Offset = fuelDelivered * 2.3
- [ ] Monthly Consumption = fuelDelivered * 0.3
- [ ] Trees Saved = carbonOffset / 22

#### Producer Dashboard
- [ ] Biogas Produced = totalWaste * 0.3
- [ ] Carbon Reduction = totalWaste * 2.3
- [ ] Trees Equivalent = (totalWaste * 2.3) / 22

## Responsive Design Testing

### Mobile (< 768px)
- [ ] Dashboard cards stack vertically
- [ ] Tables are scrollable
- [ ] Buttons are full-width
- [ ] Text is readable
- [ ] Charts resize properly

### Tablet (768px - 1024px)
- [ ] Cards display in 2 columns
- [ ] Sidebar collapses to hamburger menu
- [ ] Tables are responsive
- [ ] Charts scale appropriately

### Desktop (> 1024px)
- [ ] Full layout displays
- [ ] Sidebar is always visible
- [ ] Cards display in 3-4 columns
- [ ] All elements properly aligned

## Performance Testing

### Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] API response time < 500ms
- [ ] No console errors
- [ ] No memory leaks

### Data Refresh
- [ ] Auto-refresh works (30 seconds for supplier/school, 10 seconds for producer)
- [ ] Manual refresh updates data
- [ ] No duplicate API calls

## Error Handling Testing

### Network Errors
- [ ] Dashboard handles API failures gracefully
- [ ] Error messages display to user
- [ ] Retry mechanism works

### Invalid Data
- [ ] Dashboard handles null/undefined values
- [ ] Zero values display correctly
- [ ] Negative values are prevented

### Authentication Errors
- [ ] Expired token redirects to login
- [ ] Invalid token shows error
- [ ] Missing token redirects to login

## Browser Compatibility

### Chrome
- [ ] Dashboard displays correctly
- [ ] All features work
- [ ] No console errors

### Firefox
- [ ] Dashboard displays correctly
- [ ] All features work
- [ ] No console errors

### Safari
- [ ] Dashboard displays correctly
- [ ] All features work
- [ ] No console errors

### Edge
- [ ] Dashboard displays correctly
- [ ] All features work
- [ ] No console errors

## User Experience Testing

### Navigation
- [ ] Quick action buttons work
- [ ] Sidebar navigation works
- [ ] Back button works
- [ ] Breadcrumbs (if any) work

### Visual Feedback
- [ ] Hover effects work on buttons
- [ ] Loading states display
- [ ] Success messages show
- [ ] Error messages show

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible

## Test Users

Create test users for each role:

```sql
-- Admin User
INSERT INTO users (firstName, lastName, email, password, role, isActive) 
VALUES ('Admin', 'User', 'admin@ecofuel.com', 'hashed_password', 'admin', true);

-- Supplier User
INSERT INTO users (firstName, lastName, email, password, role, isActive) 
VALUES ('Supplier', 'User', 'supplier@ecofuel.com', 'hashed_password', 'supplier', true);

-- School User
INSERT INTO users (firstName, lastName, email, password, role, isActive) 
VALUES ('School', 'User', 'school@ecofuel.com', 'hashed_password', 'school', true);

-- Producer User
INSERT INTO users (firstName, lastName, email, password, role, isActive) 
VALUES ('Producer', 'User', 'producer@ecofuel.com', 'hashed_password', 'producer', true);
```

## Common Issues and Solutions

### Issue: Dashboard shows no data
**Solution**: 
1. Check if user is authenticated
2. Verify API endpoint is returning data
3. Check browser console for errors
4. Verify database has data

### Issue: Wrong dashboard loads
**Solution**:
1. Check user role in database
2. Verify getDashboardComponent() function
3. Clear browser cache
4. Check route configuration

### Issue: Educational content visible to non-admin
**Solution**:
1. Verify adminOnly flag in routes.js
2. Check Sidebar filtering logic
3. Verify user role in context

### Issue: API returns 403 Forbidden
**Solution**:
1. Check JWT token validity
2. Verify user role matches endpoint requirements
3. Check auth middleware configuration

## Reporting Issues

When reporting issues, include:
1. User role being tested
2. Browser and version
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshots

## Success Criteria

All tests pass when:
- ✓ Each role sees only their designated dashboard
- ✓ All metrics display correctly
- ✓ Navigation works as expected
- ✓ Educational content is admin-only
- ✓ API returns role-specific data
- ✓ No console errors
- ✓ Responsive design works on all devices
- ✓ Performance meets requirements
