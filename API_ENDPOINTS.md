# Museum API Endpoints

## Base URL: http://localhost:5000

## Authentication Endpoints

### Login
```
POST /api/auth/login
Body: {
  "username": "superadmin",
  "password": "admin123"
}
Response: {
  "token": "jwt_token_here",
  "user": { user_details }
}
```

### Get Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

## Admin Management (Super Admin Only)

### Get All Admins
```
GET /api/admin
Headers: Authorization: Bearer <token>
```

### Create Admin
```
POST /api/admin
Headers: Authorization: Bearer <token>
Body: {
  "username": "newadmin",
  "firstname": "New",
  "lastname": "Admin",
  "email": "admin@example.com",
  "mobile_no": "1234567890",
  "password": "password123",
  "admin_role_id": 2
}
```

### Update Admin
```
PUT /api/admin/:id
Headers: Authorization: Bearer <token>
```

### Delete Admin
```
DELETE /api/admin/:id
Headers: Authorization: Bearer <token>
```

### Get Admin Roles
```
GET /api/admin/roles/list
Headers: Authorization: Bearer <token>
```

## Museum Entry Endpoints

### Public Entry (No Auth Required)
```
POST /api/museum/public
Body: {
  "firstname": "John Doe",
  "phone": "1234567890",
  "address": "Delhi",
  "total_amt": "100"
}
```

### Admin Entry (Auth Required)
```
POST /api/museum
Headers: Authorization: Bearer <token>
Body: { same as public }
```

### Get All Entries
```
GET /api/museum
```

### Search Entries
```
GET /api/museum/search/phone/1234567890
GET /api/museum/search/name/john
GET /api/museum/search/date/2024-01-01
GET /api/museum/search/all/searchterm
```

### Update Entry (Admin Only)
```
PUT /api/museum/:id
Headers: Authorization: Bearer <token>
```

### Delete Entry (Admin Only)
```
DELETE /api/museum/:id
Headers: Authorization: Bearer <token>
```

## Default Login Credentials
- Username: superadmin
- Password: admin123 (bcrypt hashed in database)

## Admin Roles
1. Super Admin - Full access
2. Admin - Museum management
3. Accountant - Financial access
4. Operator - Basic operations
5. User - Limited access