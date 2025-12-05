# API Testing Guide - Fluxion Backend

Base URL: `http://localhost:8080/api` (default backend port)

## Documentation Structure

This folder contains API testing documentation organized by controller:

- **[user-api.md](./user-api.md)** - User authentication, profile management, email verification, password reset, and user management
- **[admin-api.md](./admin-api.md)** - Admin dashboard statistics, recent orders, recent users
- **[template-api.md](./template-api.md)** - Template CRUD operations (basic info)
- **[template-details-api.md](./template-details-api.md)** - Template details management (extended info, features, specs)
- **[cart-api.md](./cart-api.md)** - Shopping cart operations (add, update, remove, view, clear)
- **[order-api.md](./order-api.md)** - Order creation (checkout), management, status updates, and cancellation
- **[setup.md](./setup.md)** - Environment setup and prerequisites

## Quick Start

1. Check [setup.md](./setup.md) for environment configuration
2. Start with user registration in [user-api.md](./user-api.md)
3. Verify email with OTP (see user-api.md)
4. Login to get auth cookie (automatically saved with `-c cookies.txt`)
5. Use the cookie file (`-b cookies.txt`) to test protected endpoints

## Authentication

The API uses **httpOnly cookies** for authentication (not bearer tokens):

```bash
# Login and save cookie
curl -X POST "http://localhost:8080/api/user/signin" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"yourPassword123"}'

# Use cookie for authenticated requests
curl -X GET "http://localhost:8080/api/user/profile" \
  -b cookies.txt
```

**Admin users** should save cookies to a separate file:
```bash
# Admin login
curl -X POST "http://localhost:8080/api/user/signin" \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{"email":"admin@example.com","password":"adminPassword123"}'

# Use admin cookie
curl -X GET "http://localhost:8080/api/admin/dashboard-stats" \
  -b admin-cookies.txt
```

## API Categories

### Public Endpoints (No Auth Required)
- User registration (`POST /api/user/signup`)
- User login (`POST /api/user/signin`)
- Template listing and details (`GET /api/templates/*`)
- Template details listing (`GET /api/template-details/*`)

### User-Protected Endpoints (JWT Cookie Required)
- Email verification (send OTP, verify OTP)
- Password reset (request reset, reset with token)
- User profile operations (view, update, delete)
- Cart operations (add, update, remove, view, clear)
- Order operations (checkout, view orders, cancel orders)

### Admin-Only Endpoints (Admin JWT Cookie Required)
- **Dashboard & Analytics:**
  - Dashboard statistics (`GET /api/admin/dashboard-stats`)
  - Recent orders (`GET /api/admin/recent-orders`)
  - Recent users (`GET /api/admin/recent-users`)
- **User Management:**
  - Get all users with pagination/search (`GET /api/user/get-all-users`)
  - Get user by ID (`GET /api/user/get-user/:id`)
  - Update user role (`PUT /api/user/update-user-role/:id`)
- **Template Management:**
  - Template CRUD (create, update, delete) in [template-api.md](./template-api.md)
  - Template Details CRUD in [template-details-api.md](./template-details-api.md)
- **Order Management:**
  - Update order status (`PUT /api/orders/:orderId/status`)

## Security Features

- **Rate Limiting:**
  - General endpoints: 100 requests per 15 minutes
  - Auth endpoints: 10 requests per 15 minutes
  - Password reset: 3 requests per 15 minutes
- **Email Verification:** OTP-based with 10-minute expiry
- **Password Security:** Bcrypt hashing (12 rounds)
- **Token Security:** Reset tokens hashed with bcrypt (10 rounds), 1-hour expiry
- **XSS Protection:** All user inputs sanitized
- **Timing Attack Prevention:** Constant-time delays on password reset

## Testing Tools

Use any of these tools:
- **cURL** (command line - examples provided in all docs)
- **Postman** (can import cURL commands)
- **Thunder Client** (VS Code extension)
- **Insomnia**
- **HTTPie** (user-friendly cURL alternative)

## Response Formats

All responses follow these structures:

**Success:**
```json
{
  "message": "Operation description",
  "data": { /* result object */ }
}
```

**Success with List:**
```json
{
  "message": "Items fetched successfully",
  "items": [ /* array of objects */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasMore": true
  }
}
```

**Error:**
```json
{
  "message": "Error description"
}
```

**Validation Error:**
```json
{
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["fieldName"],
      "message": "Expected string, received number"
    }
  ]
}
```

## Complete Testing Workflow

See the main [API Testing Guide](../../API_TESTING_GUIDE.md) for a comprehensive step-by-step testing workflow covering all 23 API endpoints.

## New Features (Latest Updates)

- ✅ Email verification with OTP system
- ✅ Password reset flow with secure tokens
- ✅ Admin dashboard with statistics and analytics
- ✅ Extended user profile fields (organization, contact, address, avatar)
- ✅ HttpOnly cookie authentication (enhanced security)
- ✅ Comprehensive rate limiting
