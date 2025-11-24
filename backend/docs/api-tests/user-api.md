# User API Documentation

Base URL: `http://localhost:3000/api/user`

## Authentication APIs

### 1. Register User (Sign Up)
**Endpoint:** `POST /signup`  
**Auth Required:** No  
**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/user/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","password":"password123"}'
```

**Error Responses:**
- `400` - User already exists
- `400` - Validation errors
- `500` - Server error

---

### 2. Login User (Sign In)
**Endpoint:** `POST /signin`  
**Auth Required:** No  
**Description:** Authenticate existing user and get JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/user/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Note:** Save the `token` from response - you'll need it for protected endpoints.

---

## User Profile APIs

### 3. Get User Profile
**Endpoint:** `GET /get-profile`  
**Auth Required:** Yes (JWT Token)  
**Description:** Get current logged-in user's profile

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/user/get-profile" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "User profile fetched successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  }
}
```

---

### 4. Update User Profile
**Endpoint:** `PUT /update-profile`  
**Auth Required:** Yes (JWT Token)  
**Description:** Update current user's name or password

**Request Body (partial):**
```json
{
  "name": "John Updated",
  "password": "newpassword123"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/user/update-profile" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_TOKEN>" \
  -d '{"name":"John Updated"}'
```

**Success Response (200):**
```json
{
  "message": "User profile updated successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Updated",
    "role": "USER",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:05:00.000Z"
  }
}
```

---

### 5. Delete User Account
**Endpoint:** `DELETE /delete-account`  
**Auth Required:** Yes (JWT Token)  
**Description:** Delete current user's account (requires password confirmation)

**Request Body:**
```json
{
  "password": "current_password"
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/user/delete-account" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_TOKEN>" \
  -d '{"password":"current_password"}'
```

**Success Response (200):**
```json
{
  "message": "User account deleted successfully"
}
```

---

### 6. Logout User
**Endpoint:** `POST /logout`  
**Auth Required:** Yes (JWT Token)  
**Description:** Logout user and clear auth cookie

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/user/logout" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## User Management APIs (Admin Only)

### 7. Get All Users
**Endpoint:** `GET /get-all-users`  
**Auth Required:** Yes (Admin)  
**Description:** Get paginated list of all users

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by email or name
- `role` (optional): Filter by role (USER, ADMIN)

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/user/get-all-users?page=1&limit=20&search=john" \
  -H "Cookie: auth_token=<YOUR_ADMIN_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Users fetched successfully",
  "users": [
    {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2025-11-21T10:00:00.000Z",
      "updatedAt": "2025-11-21T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### 8. Get User By ID
**Endpoint:** `GET /get-user/:id`  
**Auth Required:** Yes (JWT Token)  
**Description:** Get any user's profile by ID (email hidden unless viewing own profile or admin)

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/user/get-user/clx1234567890" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "User profile fetched successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  }
}
```

---

### 9. Update User Role
**Endpoint:** `PUT /update-user-role/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Change a user's role (admin only, cannot change own role)

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/user/update-user-role/clx1234567890" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_ADMIN_TOKEN>" \
  -d '{"role":"ADMIN"}'
```

**Success Response (200):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:20:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid role or trying to modify own role
- `403` - Forbidden (not admin)
- `404` - User not found

---

## Notes

- **Authentication**: Most endpoints use httpOnly cookies (`auth_token`) for auth. You can also use `Authorization: Bearer <token>` header.
- **Role System**: Only `USER` and `ADMIN` roles exist. Registration always creates USER role.
- **Admin Access**: Admin users must be created via seed script or role update by another admin.
