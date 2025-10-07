# EcoFuelConnect API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register

Register a new user

- **Body**: `{ firstName, lastName, email, password, phone?, organization?, role? }`
- **Response**: `{ message, token, user }`

#### POST /api/auth/login

Login user

- **Body**: `{ email, password }`
- **Response**: `{ message, token, user }`

#### GET /api/auth/me

Get current user profile (Protected)

- **Response**: `{ user }`

#### PUT /api/auth/profile

Update user profile (Protected)

- **Body**: `{ firstName?, lastName?, phone?, organization?, address?, profile?, preferences? }`
- **Response**: `{ message, user }`

#### POST /api/auth/change-password

Change user password (Protected)

- **Body**: `{ currentPassword, newPassword }`
- **Response**: `{ message }`

---

### Dashboard Routes (`/api/dashboard`)

#### GET /api/dashboard/stats

Get dashboard statistics (Protected)

- **Query**: `?timeframe=month|week|today|year`
- **Response**: `{ message, stats, timeframe, lastUpdated }`

#### GET /api/dashboard/recent-activity

Get recent activity feed (Protected)

- **Query**: `?limit=10`
- **Response**: `{ message, activities, count }`

#### GET /api/dashboard/charts/waste-trends

Get waste trends for charts (Protected)

- **Query**: `?months=6`
- **Response**: `{ message, chartData, months }`

#### GET /api/dashboard/charts/biogas-production

Get biogas production trends (Protected)

- **Query**: `?months=6`
- **Response**: `{ message, chartData, months }`

#### GET /api/dashboard/charts/fuel-requests

Get fuel request analytics (Protected)

- **Query**: `?months=6`
- **Response**: `{ message, chartData, months }`

#### GET /api/dashboard/waste-distribution

Get waste type distribution (Protected)

- **Response**: `{ message, distributionData, totalWeight }`

#### GET /api/dashboard/kpis

Get Key Performance Indicators (Protected)

- **Response**: `{ message, kpis, lastUpdated }`

#### POST /api/dashboard/generate-report

Generate monthly analytics report (Protected - Admin/Manager)

- **Body**: `{ month?, year? }`
- **Response**: `{ message, analytics, reportDate }`

---

### Fuel Request Routes (`/api/fuel-requests`)

#### GET /api/fuel-requests/fuel-types

Get available fuel types (Public)

- **Response**: `{ message, fuelTypes }`

#### POST /api/fuel-requests

Create new fuel request (Protected)

- **Body**: `{ fuelType, quantity, deliveryAddress, preferredDeliveryDate, urgency?, purpose, contactNumber, additionalNotes? }`
- **Response**: `{ message, fuelRequest }`

#### GET /api/fuel-requests

Get user's fuel requests (Protected)

- **Query**: `?page=1&limit=10&status=pending&fuelType=biogas&urgency=high&sortBy=createdAt&sortOrder=desc`
- **Response**: `{ message, fuelRequests, pagination }`

#### GET /api/fuel-requests/:id

Get specific fuel request (Protected)

- **Response**: `{ message, fuelRequest }`

#### PUT /api/fuel-requests/:id

Update fuel request (Protected - Own requests only)

- **Body**: `{ deliveryAddress?, preferredDeliveryDate?, urgency?, contactNumber?, additionalNotes? }`
- **Response**: `{ message, fuelRequest }`

#### DELETE /api/fuel-requests/:id

Cancel fuel request (Protected - Own requests only)

- **Response**: `{ message }`

#### GET /api/fuel-requests/stats/summary

Get fuel request statistics (Protected)

- **Response**: `{ message, stats }`

#### GET /api/fuel-requests/admin/all

Get all fuel requests (Protected - Admin/Manager)

- **Query**: `?page=1&limit=20&status=pending&fuelType=biogas&userId=123&sortBy=createdAt&sortOrder=desc`
- **Response**: `{ message, fuelRequests, pagination }`

#### PUT /api/fuel-requests/admin/:id/status

Update fuel request status (Protected - Admin/Manager)

- **Body**: `{ status, notes? }`
- **Response**: `{ message, fuelRequest }`

---

### Waste Logging Routes (`/api/waste-logging`)

#### GET /api/waste-logging/waste-types

Get available waste types (Public)

- **Response**: `{ message, wasteTypes, supplierTypes }`

#### POST /api/waste-logging

Create new waste entry (Protected)

- **Body**: `{ supplierName, supplierType, supplierContact?, wasteType, wasteCategory?, quality?, weight, unit?, collectionDate, collectionTime?, collectionAddress, collectorName?, collectorId?, collectorContact?, moistureContent?, notes? }`
- **Response**: `{ message, wasteEntry }`

#### GET /api/waste-logging

Get user's waste entries (Protected)

- **Query**: `?page=1&limit=10&wasteType=food_scraps&supplierType=household&quality=good&status=collected&startDate=2023-01-01&endDate=2023-12-31&sortBy=createdAt&sortOrder=desc`
- **Response**: `{ message, wasteEntries, pagination }`

#### GET /api/waste-logging/:id

Get specific waste entry (Protected)

- **Response**: `{ message, wasteEntry }`

#### PUT /api/waste-logging/:id

Update waste entry (Protected - Own entries only)

- **Body**: `{ supplierContact?, quality?, moistureContent?, collectionTime?, notes? }`
- **Response**: `{ message, wasteEntry }`

#### DELETE /api/waste-logging/:id

Delete waste entry (Protected - Own entries only)

- **Response**: `{ message }`

#### GET /api/waste-logging/stats/summary

Get waste logging statistics (Protected)

- **Query**: `?timeframe=month|week|today|year`
- **Response**: `{ message, stats }`

#### GET /api/waste-logging/:id/biogas-potential

Calculate biogas potential for waste entry (Protected)

- **Response**: `{ message, biogasPotential }`

#### GET /api/waste-logging/admin/all

Get all waste entries (Protected - Admin/Manager)

- **Query**: `?page=1&limit=20&wasteType=food_scraps&supplierType=household&status=processed&userId=123&startDate=2023-01-01&endDate=2023-12-31&sortBy=createdAt&sortOrder=desc`
- **Response**: `{ message, wasteEntries, pagination }`

#### PUT /api/waste-logging/admin/:id/processing

Update waste processing status (Protected - Admin/Manager)

- **Body**: `{ status, facilityName?, facilityLocation?, biogasProduced?, fertilizerAmount?, compostAmount?, processingNotes? }`
- **Response**: `{ message, wasteEntry }`

---

## Data Models

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed),
  phone: String,
  organization: String,
  role: 'user' | 'supplier' | 'admin' | 'manager',
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profile: {
    avatar: String,
    bio: String,
    interests: [String],
    preferredFuelTypes: [String]
  },
  isActive: Boolean,
  emailVerified: Boolean,
  lastLogin: Date,
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    language: String,
    theme: 'light' | 'dark'
  }
}
```

### Fuel Request Model

```javascript
{
  requestId: String (auto-generated),
  user: ObjectId (ref: User),
  fuelType: 'biogas' | 'biomethane' | 'bioethanol' | 'bio_diesel',
  fuelDetails: {
    name: String,
    description: String,
    pricePerUnit: Number,
    unit: String
  },
  quantity: Number,
  totalCost: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: { latitude: Number, longitude: Number },
    deliveryInstructions: String
  },
  contactInfo: {
    phone: String,
    email: String,
    alternateContact: String
  },
  preferredDeliveryDate: Date,
  urgency: 'low' | 'normal' | 'medium' | 'high',
  purpose: String,
  status: 'pending' | 'approved' | 'processing' | 'in_transit' | 'delivered' | 'cancelled' | 'rejected',
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: ObjectId (ref: User),
    notes: String
  }],
  approval: {
    approvedBy: ObjectId (ref: User),
    approvedAt: Date,
    rejectionReason: String
  },
  delivery: {
    assignedDriver: String,
    vehicleInfo: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    deliveryNotes: String,
    deliveryConfirmation: {
      receivedBy: String,
      signature: String,
      timestamp: Date
    }
  },
  payment: {
    method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money',
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    transactionId: String,
    paidAt: Date
  },
  additionalNotes: String,
  isActive: Boolean
}
```

### Waste Entry Model

```javascript
{
  entryId: String (auto-generated),
  user: ObjectId (ref: User),
  supplier: {
    name: String,
    contact: {
      phone: String,
      email: String,
      address: String
    },
    type: 'household' | 'restaurant' | 'market' | 'farm' | 'school' | 'hospital' | 'other'
  },
  wasteDetails: {
    type: 'food_scraps' | 'vegetable_peels' | 'fruit_waste' | 'garden_waste' | 'paper_organic' | 'agricultural_residue' | 'animal_manure' | 'mixed_organic' | 'other',
    category: 'wet_waste' | 'dry_organic' | 'mixed',
    quality: 'excellent' | 'good' | 'fair' | 'poor',
    moistureContent: Number,
    contamination: {
      level: 'none' | 'low' | 'medium' | 'high',
      contaminants: [String]
    }
  },
  quantity: {
    weight: Number,
    unit: 'kg' | 'pounds' | 'tons',
    volume: {
      amount: Number,
      unit: 'liters' | 'cubic_meters' | 'gallons'
    }
  },
  collectionInfo: {
    date: Date,
    time: String,
    location: {
      address: String,
      coordinates: { latitude: Number, longitude: Number },
      district: String,
      sector: String
    },
    collectedBy: {
      name: String,
      id: String,
      contact: String
    }
  },
  processing: {
    status: 'collected' | 'in_transit' | 'received' | 'processing' | 'processed' | 'completed',
    facility: {
      name: String,
      location: String,
      capacity: String
    },
    processedDate: Date,
    biogasProduced: {
      amount: Number,
      unit: String,
      estimatedYield: Number
    },
    byProducts: {
      fertilizer: { amount: Number, unit: String },
      compost: { amount: Number, unit: String }
    }
  },
  environmental: {
    carbonFootprintReduced: Number,
    methaneEmissionAvoided: Number,
    energyGenerated: { amount: Number, unit: String }
  },
  payment: {
    amount: Number,
    currency: String,
    status: 'pending' | 'paid' | 'failed',
    paidAt: Date,
    paymentMethod: String
  },
  quality_check: {
    inspector: String,
    inspectionDate: Date,
    passed: Boolean,
    notes: String,
    images: [String]
  },
  notes: {
    supplier: String,
    collector: String,
    processor: String
  },
  isActive: Boolean
}
```

---

## Error Responses

All API endpoints return consistent error responses:

```javascript
{
  message: "Error description",
  errors?: ["Detailed error messages"], // For validation errors
  statusCode: 400 | 401 | 403 | 404 | 500
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized / Authentication Required
- `403` - Forbidden / Insufficient Permissions
- `404` - Not Found
- `500` - Internal Server Error
