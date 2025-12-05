# User API Documentation

Base URL: `http://localhost:8080/api/user`

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

**Success Response (200):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "isEmailVerified": false,
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/user/signup" \
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
**Description:** Authenticate existing user and get JWT token (sets httpOnly cookie)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "NewSecurePass123"
}

```

**Success Response (200):**
```json
{
  "message": "Signin successful",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "isEmailVerified": false,
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/user/signin" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Note:** Auth token is set as httpOnly cookie. Save cookies using `-c cookies.txt` and use with `-b cookies.txt`

---

## User Profile APIs

### 3. Get User Profile

**Endpoint:** `GET /get-profile`  
**Auth Required:** Yes (JWT Token)  
**Description:** Get current logged-in user's profile

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/user/get-profile" \
  -b cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Profile fetched successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "organization": "Tech Corp",
    "contactNumber": "+1234567890",
    "address": "123 Main St",
    "avatarUrl": "https://example.com/avatar.jpg",
    "role": "USER",
    "isEmailVerified": true,
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  }
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /update-profile`  
**Auth Required:** Yes (JWT Token)  
**Description:** Update current user's profile (name, organization, contact, address, avatar)

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "organization": "Tech Corp",
  "contactNumber": "+1234567890",
  "address": "456 New Ave",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8080/api/user/update-profile" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"John Updated","organization":"Tech Corp"}'
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Updated",
    "organization": "Tech Corp",
    "role": "USER",
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:05:00.000Z"
  }
}
```

---

## Email Verification APIs

### 5. Send Email Verification OTP
**Endpoint:** `POST /send-verification-email`  
**Auth Required:** Yes (JWT Token)  
**Description:** Send a 6-digit OTP to user's email for verification

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/user/send-verification-email" \
  -b cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Verification email sent successfully"
}
```

**Error Responses:**
- `400` - Email already verified
- `429` - Too many requests (rate limited)
- `500` - Email sending failed

**Note:** OTP is valid for 10 minutes

---

### 6. Verify Email with OTP
**Endpoint:** `POST /verify-email`  
**Auth Required:** Yes (JWT Token)  
**Description:** Verify email address using the OTP sent via email

**Request Body:**
```json
{
  "otp": "123456"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/user/verify-email" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"otp":"123456"}'
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "isEmailVerified": true,
    "role": "USER"
  }
}
```

**Error Responses:**
- `400` - Invalid or expired OTP
- `400` - Email already verified
- `429` - Too many requests

---

## Password Reset APIs

### 7. Request Password Reset
**Endpoint:** `POST /forgot-password`  
**Auth Required:** No  
**Description:** Send password reset link to user's email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/user/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Success Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

**Error Responses:**
- `429` - Too many requests (rate limited - 3 per 15 minutes)
- `500` - Email sending failed

**Note:** Reset token is valid for 1 hour. Check email for reset link.

---

### 8. Reset Password
**Endpoint:** `POST /reset-password`  
**Auth Required:** No  
**Description:** Reset password using the token from email

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/user/reset-password" \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123xyz...","newPassword":"NewSecurePass123!"}'
```

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Error Responses:**
- `400` - Invalid or expired token
- `400` - Password validation failed

---

### 9. Logout User
**Endpoint:** `POST /logout`  
**Auth Required:** Yes (JWT Token)  
**Description:** Logout user and clear auth cookie

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/user/logout" \
  -b cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## User Management APIs (Admin Only)

### 10. Get All Users
**Endpoint:** `GET /get-all-users`  
**Auth Required:** Yes (Admin)  
**Description:** Get paginated list of all users (admin only)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by email or name
- `role` (optional): Filter by role (USER, ADMIN)

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/user/get-all-users?page=1&limit=20&search=john" \
  -b admin-cookies.txt
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
      "isEmailVerified": true,
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

### 11. Get User By ID
**Endpoint:** `GET /get-user/:id`  
**Auth Required:** Yes (JWT Token)  
**Description:** Get any user's profile by ID

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/user/get-user/clx1234567890" \
  -b cookies.txt
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
    "isEmailVerified": true,
    "createdAt": "2025-11-21T10:00:00.000Z",
    "updatedAt": "2025-11-21T10:00:00.000Z"
  }
}
```

---

### 12. Update User Role
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
curl -X PUT "http://localhost:8080/api/user/update-user-role/clx1234567890" \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
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

## Rate Limiting

The following rate limits are applied:

- **General endpoints**: 100 requests per 15 minutes
- **Auth endpoints** (signup, signin): 10 requests per 15 minutes  
- **Password reset**: 3 requests per 15 minutes
- **Email verification**: Rate limited per endpoint

---

## Security Notes

- **Authentication**: Uses httpOnly cookies for JWT tokens (more secure than localStorage)
- **Password Security**: Passwords hashed with bcrypt (12 rounds)
- **OTP Security**: OTPs hashed with bcrypt (10 rounds), 10-minute expiry
- **Reset Tokens**: Tokens hashed with bcrypt (10 rounds), 1-hour expiry
- **XSS Protection**: All user inputs are sanitized
- **Timing Attacks**: Password reset uses constant-time delay to prevent email enumeration

---

## Testing Workflow

1. **Register** a new user
2. **Login** to get auth cookie
3. **Send verification email** and verify with OTP
4. **Update profile** with additional info
5. Test **password reset** flow
6. Login as **admin** (use seeded admin account)
7. Test **admin endpoints** (get users, update roles)
8. **Logout** when done
