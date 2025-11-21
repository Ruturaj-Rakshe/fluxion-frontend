# API Testing Guide - Fluxion Backend

Base URL: `http://localhost:3000/api` (adjust port as needed)


## Authentication APIs

### 1. Register User (Sign Up)
**Endpoint:** `POST /users/signup`  
**Auth Required:** No  
**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "USER"
}
```

**Success Response (201):**
```json
{
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

**Error Responses:**
- `400` - User already exists
- `400` - Validation errors (Zod)
- `500` - Server error

**Postman/Thunder Client:**
- Method: POST
- URL: `http://localhost:3000/api/users/signup`
- Headers: `Content-Type: application/json`
- Body: (raw JSON - see above)

---

### 2. Login User (Sign In)
**Endpoint:** `POST /users/login`  
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

**Error Responses:**
- `400` - Invalid email or password
- `400` - Validation errors (Zod)
- `500` - Server error

---

## User Profile APIs

### 3. Get User Profile
**Endpoint:** `GET /users/profile`  
**Auth Required:** Yes (JWT Token)  
**Description:** Get current logged-in user's profile

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
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

**Error Responses:**
- `401` - Unauthorized (no token or invalid token)
- `404` - User not found
- `500` - Server error

**Postman/Thunder Client:**
- Method: GET
- URL: `http://localhost:3000/api/users/profile`
- Headers: 
  - `Authorization: Bearer <token>`

---

### 4. Update User Profile
**Endpoint:** `PUT /users/update-profile`  
**Auth Required:** Yes (JWT Token)  
**Description:** Update current user's name or password

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (only include fields to update):**
```json
{
  "name": "John Updated",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
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

**Error Responses:**
- `400` - No valid fields to update
- `400` - Validation errors (Zod)
- `401` - Unauthorized
- `500` - Server error

---

### 5. Delete User Account
**Endpoint:** `DELETE /users/account`  
**Auth Required:** Yes (JWT Token)  
**Description:** Delete current user's account (requires password confirmation)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "User account deleted successfully"
}
```

**Error Responses:**
- `400` - Password confirmation required
- `401` - Invalid password
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

### 6. Logout User
**Endpoint:** `POST /users/logout`  
**Auth Required:** Yes (JWT Token)  
**Description:** Logout user (client-side token deletion, placeholder endpoint)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Note:** This is primarily handled client-side by deleting the JWT token from storage.

---

## User Management APIs

### 7. Get User By ID
**Endpoint:** `GET /users/:id`  
**Auth Required:** Yes (JWT Token)  
**Description:** Get any user's profile by ID (email hidden unless viewing own profile)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**URL Parameters:**
- `id` - User ID (e.g., `clx1234567890`)

**Success Response (200) - Own Profile:**
```json
{
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

**Success Response (200) - Other User:**
```json
{
  "user": {
    "id": "clx9876543210",
    "name": "Jane Doe",
    "role": "USER",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---




## Environment Setup

Make sure your `.env` file has:
```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key_here"
```

Run Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

---