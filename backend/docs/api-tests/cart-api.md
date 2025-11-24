# Cart API Documentation

Base URL: `http://localhost:3000/api/cart`

**Note:** All cart endpoints require authentication (JWT token in cookie or Authorization header).

## Cart Endpoints

### 1. Get Cart
**Endpoint:** `GET /`  
**Auth Required:** Yes (User)  
**Description:** Get all items in the current user's cart with summary

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/cart" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Cart fetched successfully",
  "cart": [
    {
      "id": "clxcart123",
      "userId": "clxuser123",
      "tempelateId": "clxtemplate123",
      "quantity": 2,
      "createdAt": "2025-11-24T10:00:00.000Z",
      "updatedAt": "2025-11-24T10:00:00.000Z",
      "tempelate": {
        "id": "clxtemplate123",
        "title": "E-commerce Template",
        "description": "Complete solution",
        "price": 99.0,
        "imageUrl": "https://cdn.example.com/image.jpg",
        "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
        "isActive": "ACTIVE"
      }
    }
  ],
  "summary": {
    "totalItems": 2,
    "totalPrice": 198.0,
    "itemCount": 1
  }
}
```

**Error Responses:**
- `401` - Unauthorized (no token)

---

### 2. Add to Cart
**Endpoint:** `POST /add`  
**Auth Required:** Yes (User)  
**Description:** Add a template to cart or increment quantity if already exists

**Request Body:**
```json
{
  "tempelateId": "clxtemplate123",
  "quantity": 1
}
```

**Validation Rules:**
- `tempelateId`: Valid CUID (required)
- `quantity`: Integer 1-100 (required)

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/cart/add" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_TOKEN>" \
  -d '{"tempelateId":"clxtemplate123","quantity":1}'
```

**Success Response (201 - new item):**
```json
{
  "message": "Template added to cart",
  "cartItem": {
    "id": "clxcart123",
    "userId": "clxuser123",
    "tempelateId": "clxtemplate123",
    "quantity": 1,
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:00:00.000Z",
    "tempelate": {
      "id": "clxtemplate123",
      "title": "E-commerce Template",
      "price": 99.0,
      "thumbnailUrl": "https://cdn.example.com/thumb.jpg"
    }
  }
}
```

**Success Response (200 - quantity updated):**
```json
{
  "message": "Cart item updated",
  "cartItem": {
    "id": "clxcart123",
    "userId": "clxuser123",
    "tempelateId": "clxtemplate123",
    "quantity": 3,
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:05:00.000Z",
    "tempelate": {
      "id": "clxtemplate123",
      "title": "E-commerce Template",
      "price": 99.0,
      "thumbnailUrl": "https://cdn.example.com/thumb.jpg"
    }
  }
}
```

**Error Responses:**
- `400` - Validation error (invalid quantity or template ID)
- `400` - Template is not available (inactive)
- `401` - Unauthorized
- `404` - Template not found

---

### 3. Update Cart Item Quantity
**Endpoint:** `PUT /update/:tempelateId`  
**Auth Required:** Yes (User)  
**Description:** Update the quantity of a specific cart item

**Request Body:**
```json
{
  "quantity": 5
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/cart/update/clxtemplate123" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_TOKEN>" \
  -d '{"quantity":5}'
```

**Success Response (200):**
```json
{
  "message": "Cart item updated successfully",
  "cartItem": {
    "id": "clxcart123",
    "userId": "clxuser123",
    "tempelateId": "clxtemplate123",
    "quantity": 5,
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:10:00.000Z",
    "tempelate": {
      "id": "clxtemplate123",
      "title": "E-commerce Template",
      "price": 99.0
    }
  }
}
```

**Error Responses:**
- `400` - Validation error or quantity missing
- `401` - Unauthorized
- `404` - Cart item not found

---

### 4. Remove Item from Cart
**Endpoint:** `DELETE /remove/:tempelateId`  
**Auth Required:** Yes (User)  
**Description:** Remove a specific template from cart

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/cart/remove/clxtemplate123" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Item removed from cart"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Cart item not found

---

### 5. Clear Cart
**Endpoint:** `DELETE /clear`  
**Auth Required:** Yes (User)  
**Description:** Remove all items from the user's cart

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/cart/clear" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Cart cleared successfully",
  "deletedItems": 3
}
```

**Error Responses:**
- `401` - Unauthorized

---

### 6. Checkout
**Endpoint:** `POST /checkout`  
**Auth Required:** Yes (User)  
**Description:** Process cart checkout (currently returns summary; order creation not implemented)

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/cart/checkout" \
  -H "Cookie: auth_token=<YOUR_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Checkout summary (order creation not implemented)",
  "items": [
    {
      "templateId": "clxtemplate123",
      "title": "E-commerce Template",
      "quantity": 2,
      "unitPrice": 99.0,
      "subtotal": 198.0
    }
  ],
  "totalPrice": 198.0,
  "totalItems": 2,
  "note": "Payment processing and order creation to be implemented"
}
```

**Error Responses:**
- `400` - Cart is empty
- `400` - Some items are no longer available (inactive templates)
- `401` - Unauthorized

---

## Notes

### Cart Schema
- **One item per template**: Each user can have one cart record per template (enforced by `@@unique([userId, tempelateId])`)
- **Quantity tracking**: The `quantity` field stores how many of each template the user wants
- **Template validation**: Only active templates can be added to cart

### Behavior
- **Add to cart**: If template already in cart, quantity is incremented
- **Update quantity**: Set exact quantity (must be 1-100)
- **Remove**: Deletes the specific cart item
- **Clear**: Removes all cart items for the user
- **Checkout**: Validates all items are still active before processing

### Production Improvements Needed
- [ ] Implement Order model and creation
- [ ] Add payment gateway integration (Stripe/PayPal)
- [ ] Add stock/inventory tracking
- [ ] Implement cart expiration (auto-clear old carts)
- [ ] Add webhook for payment confirmation
- [ ] Send order confirmation emails
