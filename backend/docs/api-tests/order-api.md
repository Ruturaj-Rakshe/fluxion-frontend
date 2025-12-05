# Order API Documentation

Base URL: `http://localhost:8080/api/orders`

**Note:** All order endpoints require authentication (JWT token in httpOnly cookie).

## Order Endpoints

### 1. Create Order (Checkout)

**Endpoint:** `POST /checkout`  
**Auth Required:** Yes (User)  
**Description:** Creates an order from the current user's cart items

**Request Body:**
```json
{
  "paymentId": "pay_abc123xyz",
  "paymentRef": "ref_xyz789abc"
}
```

**Validation Rules:**
- `paymentId`: String (required) - Payment processor transaction ID
- `paymentRef`: String (required) - Payment reference number

**Process:**
1. Validates cart is not empty
2. Checks all templates are still active
3. Validates template details still exist (if specified)
4. Calculates total from current cart items
5. Creates order with PENDING status
6. Creates order items from cart
7. Clears user's cart

**cURL Example:**
```bash
curl -X POST "http://localhost:8080/api/orders/checkout" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "paymentId": "pay_abc123xyz",
    "paymentRef": "ref_xyz789abc"
  }'
```

**Success Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "clxorder123",
    "total": 297.0,
    "status": "PENDING",
    "createdAt": "2025-11-25T10:30:00.000Z",
    "note": "Payment processing to be implemented"
  }
}
```

**Error Responses:**

**400 - Cart is empty:**
```json
{
  "message": "Cart is empty"
}
```

**400 - Invalid cart configuration:**
```json
{
  "message": "Some cart items have invalid configurations",
  "details": "Please remove and re-add these items to your cart"
}
```

**400 - Inactive templates:**
```json
{
  "message": "Some items are no longer available",
  "inactiveItems": ["Premium Template", "Basic Template"]
}
```

**400 - Missing payment info:**
```json
{
  "message": "Payment information is required"
}
```

**400 - Validation error:**
```json
{
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["paymentId"],
      "message": "Required"
    }
  ]
}
```

---

### 2. Get User Orders
**Endpoint:** `GET /`  
**Auth Required:** Yes (User)  
**Description:** Get all orders for the current user

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/orders" \
  -b cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Orders fetched successfully",
  "orders": [
    {
      "id": "clxorder123",
      "total": 297.0,
      "status": "COMPLETED",
      "itemCount": 3,
      "items": [
        {
          "template": "E-commerce Template",
          "model": "Premium Model",
          "quantity": 2,
          "price": 99.0
        },
        {
          "template": "Blog Template",
          "model": null,
          "quantity": 1,
          "price": 99.0
        }
      ],
      "createdAt": "2025-11-24T10:00:00.000Z"
    },
    {
      "id": "clxorder456",
      "total": 149.0,
      "status": "PENDING",
      "itemCount": 1,
      "items": [
        {
          "template": "Portfolio Template",
          "model": "Standard Model",
          "quantity": 1,
          "price": 149.0
        }
      ],
      "createdAt": "2025-11-25T09:00:00.000Z"
    }
  ]
}
```

**Response Details:**
- Orders are sorted by creation date (newest first)
- `model` is null for templates without specific model selection
- Each order shows summary info and items list

**Error Responses:**
- `401` - Unauthorized (no token)

---

### 3. Get Order by ID
**Endpoint:** `GET /:orderId`  
**Auth Required:** Yes (User - own orders only)  
**Description:** Get detailed information about a specific order

**URL Parameters:**
- `orderId`: Order CUID (required)

**cURL Example:**
```bash
curl -X GET "http://localhost:8080/api/orders/clxorder123" \
  -b cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Order fetched successfully",
  "order": {
    "id": "clxorder123",
    "userId": "clxuser123",
    "total": 297.0,
    "status": "COMPLETED",
    "paymentId": "pay_abc123xyz",
    "paymentRef": "ref_xyz789abc",
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:05:00.000Z",
    "orderItems": [
      {
        "id": "clxitem123",
        "orderId": "clxorder123",
        "tempelateId": "clxtemplate123",
        "tempelateDetailId": "clxdetail456",
        "quantity": 2,
        "price": 99.0,
        "createdAt": "2025-11-24T10:00:00.000Z",
        "updatedAt": "2025-11-24T10:00:00.000Z",
        "tempelate": {
          "id": "clxtemplate123",
          "title": "E-commerce Template",
          "description": "Complete e-commerce solution",
          "price": 99.0,
          "imageUrl": "https://cdn.example.com/image.jpg",
          "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
          "isActive": "ACTIVE"
        },
        "tempelateDetail": {
          "id": "clxdetail456",
          "tempelateId": "clxtemplate123",
          "header": "Premium Model",
          "headerSubtitle": "Advanced features included",
          "features": ["Feature 1", "Feature 2"],
          "benefits": ["Benefit 1", "Benefit 2"]
        }
      }
    ]
  }
}
```

**Error Responses:**

**400 - Missing order ID:**
```json
{
  "message": "Order ID is required"
}
```

**403 - Access denied:**
```json
{
  "message": "Access denied"
}
```
*Note: Users can only view their own orders*

**404 - Order not found:**
```json
{
  "message": "Order not found"
}
```

---

### 4. Cancel Order
**Endpoint:** `PUT /:orderId/cancel`  
**Auth Required:** Yes (User - own orders only)  
**Description:** Cancel a pending order

**URL Parameters:**
- `orderId`: Order CUID (required)

**Business Rules:**
- Can only cancel PENDING orders
- Cannot cancel COMPLETED orders
- Cannot cancel already CANCELLED orders
- Users can only cancel their own orders

**cURL Example:**
```bash
curl -X PUT "http://localhost:8080/api/orders/clxorder123/cancel" \
  -b cookies.txt
```

**Success Response (200):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "id": "clxorder123",
    "status": "CANCELLED"
  }
}
```

**Error Responses:**

**400 - Order already completed:**
```json
{
  "message": "Cannot cancel completed order"
}
```

**400 - Order already cancelled:**
```json
{
  "message": "Order already cancelled"
}
```

**403 - Access denied:**
```json
{
  "message": "Access denied"
}
```

**404 - Order not found:**
```json
{
  "message": "Order not found"
}
```

---

### 5. Update Order Status (Admin Only)
**Endpoint:** `PUT /:orderId/status`  
**Auth Required:** Yes (Admin only)  
**Description:** Update order status (for admin panel or payment webhooks)

**URL Parameters:**
- `orderId`: Order CUID (required)

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Validation Rules:**
- `status`: Must be one of: "PENDING", "COMPLETED", "CANCELLED" (required)

**Use Cases:**
- Admin manually marks order as completed
- Payment webhook confirms payment and updates status
- Admin cancels fraudulent orders

**cURL Example:**
```bash
curl -X PUT "http://localhost:8080/api/orders/clxorder123/status" \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{"status":"COMPLETED"}'
```

**Success Response (200):**
```json
{
  "message": "Order status updated",
  "order": {
    "id": "clxorder123",
    "userId": "clxuser123",
    "total": 297.0,
    "status": "COMPLETED",
    "paymentId": "pay_abc123xyz",
    "paymentRef": "ref_xyz789abc",
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-25T11:00:00.000Z"
  }
}
```

**Error Responses:**

**400 - Validation error:**
```json
{
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_enum_value",
      "path": ["status"],
      "message": "Invalid enum value. Expected 'PENDING' | 'COMPLETED' | 'CANCELLED'"
    }
  ]
}
```

**401 - Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

**403 - Admin only:**
```json
{
  "message": "Forbidden: Admin access required"
}
```

**404 - Order not found:**
```json
{
  "message": "Order not found"
}
```

---

## Order Status Flow

```
PENDING → COMPLETED (via admin/webhook)
PENDING → CANCELLED (via user or admin)
```

**Status Definitions:**
- `PENDING`: Order created, awaiting payment confirmation
- `COMPLETED`: Payment confirmed, order fulfilled
- `CANCELLED`: Order cancelled by user or admin

**Important:**
- Once COMPLETED, order cannot be cancelled
- Once CANCELLED, order cannot be reactivated
- Only PENDING orders can change status

---

## Complete Order Flow Example

### Step 1: Add items to cart
```bash
# Add template to cart
curl -X POST "http://localhost:8080/api/cart/add" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"tempelateId":"clxtemplate123","tempelateDetailId":"clxdetail456","quantity":2}'
```

### Step 2: View cart
```bash
# Check cart before checkout
curl -X GET "http://localhost:8080/api/cart" \
  -b cookies.txt
```

### Step 3: Process payment (external)
```
# This happens in your frontend with payment gateway
# Get paymentId and paymentRef from payment processor
```

### Step 4: Create order (checkout)
```bash
# Checkout with payment info
curl -X POST "http://localhost:8080/api/orders/checkout" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "paymentId": "pay_abc123xyz",
    "paymentRef": "ref_xyz789abc"
  }'
```

### Step 5: View orders
```bash
# Get all user orders
curl -X GET "http://localhost:8080/api/orders" \
  -b cookies.txt
```

### Step 6: View order details
```bash
# Get specific order
curl -X GET "http://localhost:8080/api/orders/clxorder123" \
  -b cookies.txt
```

### Step 7 (Optional): Cancel order
```bash
# Cancel if payment failed or user requested
curl -X PUT "http://localhost:8080/api/orders/clxorder123/cancel" \
  -b cookies.txt
```

### Step 8 (Admin): Update status
```bash
# Admin marks as completed after payment confirmation
curl -X PUT "http://localhost:8080/api/orders/clxorder123/status" \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{"status":"COMPLETED"}'
```

---

## Security Notes

### Authentication
- All endpoints require valid JWT token
- Token can be in cookie (`auth_token`) or Authorization header
- Tokens expire after 1 hour

### Authorization
- Users can only view/cancel their own orders
- Only admins can update order status
- Order ownership validated on all operations

### Validation
- Cart validation happens at checkout time (prevents race conditions)
- Template availability checked before order creation
- Template details existence verified
- Payment information required for checkout

### Cart Security
- Cart is cleared atomically with order creation (transaction)
- If order creation fails, cart remains unchanged
- Template prices are snapshot at order time (not recalculated later)

---

## Error Handling

### Common Error Codes
- `400` - Bad request (validation error, business rule violation)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Order not found
- `500` - Internal server error

### Error Response Format
All errors follow consistent format:
```json
{
  "message": "Human-readable error description",
  "errors": [] // Optional validation details
}
```

---

## Testing Checklist

### User Flows
- [ ] Create order from empty cart (should fail)
- [ ] Create order from cart with inactive templates (should fail)
- [ ] Create order with valid cart items (should succeed)
- [ ] View all orders for user
- [ ] View specific order details
- [ ] Cancel pending order (should succeed)
- [ ] Cancel completed order (should fail)
- [ ] Cancel already cancelled order (should fail)
- [ ] Try to view another user's order (should fail)
- [ ] Try to cancel another user's order (should fail)

### Admin Flows
- [ ] Update order status to COMPLETED (should succeed)
- [ ] Update order status to CANCELLED (should succeed)
- [ ] Update order with invalid status (should fail)
- [ ] Try as non-admin user (should fail)

### Edge Cases
- [ ] Checkout while template becomes inactive (should fail)
- [ ] Checkout with deleted template detail (should fail)
- [ ] Multiple concurrent checkouts (transaction safety)
- [ ] Order creation with missing payment info (should fail)

---

## Related Documentation

- **[cart-api.md](./cart-api.md)** - Cart operations (add items before checkout)
- **[template-api.md](./template-api.md)** - Browse templates to add to cart
- **[template-details-api.md](./template-details-api.md)** - View template models/variants
- **[user-api.md](./user-api.md)** - User authentication required for orders

---

## Notes

### Payment Integration (TODO)
Currently payment processing is mocked:
- `paymentId` and `paymentRef` are accepted but not validated
- No actual payment gateway integration
- Orders created with PENDING status
- Admin must manually update to COMPLETED

**Future Implementation:**
- Integrate with Stripe/PayPal/Razorpay
- Webhook endpoints for payment confirmation
- Automatic status update on successful payment
- Refund handling for cancelled orders

### Order History
- Orders are never deleted (audit trail)
- Users can view all historical orders
- Cancelled orders remain in history

### Pagination (TODO)
- Currently returns all user orders
- Should implement pagination for users with many orders
- Recommended: 20 orders per page
