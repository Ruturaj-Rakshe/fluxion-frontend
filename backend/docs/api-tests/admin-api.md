# Admin API Documentation

Base URL: `http://localhost:8080/api/admin`

**Note:** All admin endpoints require authentication with admin role.

## Admin Dashboard Endpoints

### 1. Get Dashboard Statistics
**Endpoint:** `GET /dashboard-stats`  
**Auth Required:** Yes (Admin)  
**Description:** Get comprehensive dashboard statistics including user counts, order metrics, revenue data, and template stats

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/admin/dashboard-stats" \
  -b admin-cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Dashboard stats fetched successfully",
  "stats": {
    "totalUsers": 45,
    "totalOrders": 128,
    "totalRevenue": 12450.00,
    "totalTemplates": 12,
    "usersByDate": {
      "2025-01-15": 3,
      "2025-01-16": 5,
      "2025-01-17": 2
    },
    "ordersByDate": {
      "2025-01-15": 8,
      "2025-01-16": 12,
      "2025-01-17": 6
    },
    "revenueByDate": {
      "2025-01-15": 890.00,
      "2025-01-16": 1240.00,
      "2025-01-17": 560.00
    },
    "usersByRole": {
      "USER": 42,
      "ADMIN": 3
    },
    "templatesByStatus": {
      "ACTIVE": 10,
      "INACTIVE": 2
    }
  }
}
```

**Response Fields:**
- `totalUsers`: Total number of registered users
- `totalOrders`: Total number of orders (all statuses)
- `totalRevenue`: Sum of all order totals
- `totalTemplates`: Total number of templates (all statuses)
- `usersByDate`: User registration count by date (ISO date string as key)
- `ordersByDate`: Order count by creation date
- `revenueByDate`: Revenue total by order date
- `usersByRole`: User count by role (USER, ADMIN)
- `templatesByStatus`: Template count by status (ACTIVE, INACTIVE)

**Error Responses:**
- `401` - Unauthorized (no auth cookie)
- `403` - Forbidden (user is not admin)

---

### 2. Get Recent Orders
**Endpoint:** `GET /recent-orders`  
**Auth Required:** Yes (Admin)  
**Description:** Get the 10 most recent orders with user and order item details

**Query Parameters:**
- `limit` (optional): Number of orders to return (default: 10, max: 50)

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/admin/recent-orders?limit=10" \
  -b admin-cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Recent orders fetched successfully",
  "orders": [
    {
      "id": "clxorder123",
      "total": 297.00,
      "status": "COMPLETED",
      "paymentId": "pay_abc123xyz",
      "paymentRef": "ref_xyz789abc",
      "createdAt": "2025-01-17T14:30:00.000Z",
      "updatedAt": "2025-01-17T15:00:00.000Z",
      "user": {
        "id": "clxuser456",
        "email": "customer@example.com",
        "name": "John Doe"
      },
      "orderItems": [
        {
          "id": "clxitem789",
          "quantity": 2,
          "price": 99.00,
          "tempelate": {
            "id": "clxtemplate123",
            "title": "E-commerce Template"
          }
        }
      ]
    }
  ]
}
```

**Response Fields:**
- Orders are sorted by `createdAt` descending (newest first)
- Each order includes:
  - Basic order info (id, total, status, payment details, timestamps)
  - User info (id, email, name)
  - Order items with template details

**Error Responses:**
- `401` - Unauthorized (no auth cookie)
- `403` - Forbidden (user is not admin)

---

### 3. Get Recent Users
**Endpoint:** `GET /recent-users`  
**Auth Required:** Yes (Admin)  
**Description:** Get the 10 most recently registered users

**Query Parameters:**
- `limit` (optional): Number of users to return (default: 10, max: 50)

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/admin/recent-users?limit=10" \
  -b admin-cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Recent users fetched successfully",
  "users": [
    {
      "id": "clxuser789",
      "email": "newuser@example.com",
      "name": "Jane Smith",
      "role": "USER",
      "isEmailVerified": true,
      "createdAt": "2025-01-17T10:00:00.000Z",
      "updatedAt": "2025-01-17T10:05:00.000Z"
    }
  ]
}
```

**Response Fields:**
- Users are sorted by `createdAt` descending (newest first)
- Each user includes: id, email, name, role, email verification status, timestamps
- Password and sensitive fields are excluded

**Error Responses:**
- `401` - Unauthorized (no auth cookie)
- `403` - Forbidden (user is not admin)

---

## Authentication Notes

- **Admin Role Required**: All endpoints check for ADMIN role
- **Cookie Authentication**: Uses httpOnly cookie set during admin login
- **Session Management**: Admin must login via `/api/user/signin` with admin credentials

## Usage Example

```bash
# 1. Login as admin (save cookies)
curl -X POST "http://localhost:8080/api/user/signin" \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{"email":"admin@example.com","password":"adminPassword123"}'

# 2. Get dashboard stats
curl -X GET "http://localhost:8080/api/admin/dashboard-stats" \
  -b admin-cookies.txt

# 3. Get recent orders
curl -X GET "http://localhost:8080/api/admin/recent-orders?limit=5" \
  -b admin-cookies.txt

# 4. Get recent users
curl -X GET "http://localhost:8080/api/admin/recent-users?limit=5" \
  -b admin-cookies.txt
```

---

## Data Aggregation Notes

- **Date-based stats**: Grouped by ISO date string (YYYY-MM-DD)
- **Null dates**: Records without dates are excluded from byDate aggregations
- **Revenue calculation**: Sum of order `total` field
- **Performance**: Large datasets may take longer to aggregate; consider implementing caching if needed

---

## Related Endpoints

For user management operations, see:
- `GET /api/user/get-all-users` - Paginated user list with search/filter (documented in user-api.md)
- `GET /api/user/get-user/:id` - Get specific user details (documented in user-api.md)
- `PUT /api/user/update-user-role/:id` - Change user role (documented in user-api.md)

For order management operations, see:
- `PUT /api/orders/:orderId/status` - Update order status (documented in order-api.md)
