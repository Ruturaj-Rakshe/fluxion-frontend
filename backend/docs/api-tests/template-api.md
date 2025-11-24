# Template API Documentation

Base URL: `http://localhost:3000/api/templates`

## Public Endpoints

### 1. List All Templates
**Endpoint:** `GET /get-all-templates`  
**Auth Required:** No  
**Description:** Returns all templates

**cURL Example (all templates):**
```bash
curl -X GET "http://localhost:3000/api/templates/get-all-templates"
```

**Success Response (200):**
```json
{
  "message": "All Templates retrieved successfully",
  "templates": [
    {
      "id": "clx123templateid",
      "title": "E-commerce Template",
      "description": "Complete e-commerce solution with cart and payment integration",
      "price": 99.0,
      "imageUrl": "https://cdn.example.com/image.jpg",
      "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
      "isActive": "ACTIVE",
      "createdAt": "2025-11-24T10:00:00.000Z",
      "updatedAt": "2025-11-24T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Template By ID
**Endpoint:** `GET /get-template/:id`  
**Auth Required:** No  
**Description:** Get a single template by its ID

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/templates/get-template/clx123templateid"
```

**Success Response (200):**
```json
{
  "message": "Template retrieved successfully",
  "template": {
    "id": "clx123templateid",
    "title": "E-commerce Template",
    "description": "Complete e-commerce solution with cart and payment integration",
    "price": 99.0,
    "imageUrl": "https://cdn.example.com/image.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
    "isActive": "ACTIVE",
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Template not found"
}
```

---

## Admin-Only Endpoints

### 3. Create Template
**Endpoint:** `POST /add-template`  
**Auth Required:** Yes (Admin)  
**Description:** Create a new template

**Request Body:**
```json
{
  "title": "E-commerce Template",
  "description": "Complete e-commerce solution with cart and payment integration",
  "price": 99.0,
  "imageUrl": "https://cdn.example.com/image.jpg",
  "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
  "isActive": "ACTIVE"
}
```

**Validation Rules:**
- `title`: 1-200 characters (required)
- `description`: 1-10,000 characters (required)
- `price`: $0.01 - $999,999.99 (required)
- `imageUrl`: Valid URL, max 500 characters (required)
- `thumbnailUrl`: Valid URL, max 500 characters (required)
- `isActive`: "ACTIVE" or "INACTIVE" (default: "ACTIVE")

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/templates/add-template" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_ADMIN_TOKEN>" \
  -d '{
    "title": "E-commerce Template",
    "description": "Complete solution for online stores",
    "price": 99.0,
    "imageUrl": "https://cdn.example.com/image.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
    "isActive": "ACTIVE"
  }'
```

**Success Response (201):**
```json
{
  "message": "Template created successfully",
  "template": {
    "id": "clx123templateid",
    "title": "E-commerce Template",
    "description": "Complete solution for online stores",
    "price": 99.0,
    "imageUrl": "https://cdn.example.com/image.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
    "isActive": "ACTIVE",
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `403` - Forbidden (not admin)
- `500` - Server error

---

### 4. Update Template
**Endpoint:** `PUT /update-template/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Update template fields (partial update allowed)

**Request Body (example - partial):**
```json
{
  "price": 79.0,
  "isActive": "INACTIVE"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/templates/update-template/clx123templateid" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<YOUR_ADMIN_TOKEN>" \
  -d '{"price":79.0,"isActive":"INACTIVE"}'
```

**Success Response (200):**
```json
{
  "message": "Template updated successfully",
  "template": {
    "id": "clx123templateid",
    "title": "E-commerce Template",
    "description": "Complete solution for online stores",
    "price": 79.0,
    "imageUrl": "https://cdn.example.com/image.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
    "isActive": "INACTIVE",
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:15:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `403` - Forbidden (not admin)
- `404` - Template not found
- `500` - Server error

---

### 5. Delete Template
**Endpoint:** `DELETE /delete-template/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete a template (cascade deletes related details and cart items)

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/templates/delete-template/clx123templateid" \
  -H "Cookie: auth_token=<YOUR_ADMIN_TOKEN>"
```

**Success Response (200):**
```json
{
  "message": "Template deleted successfully"
}
```

**Error Responses:**
- `403` - Forbidden (not admin)
- `404` - Template not found (Prisma P2025)
- `500` - Server error

---

## Notes

- **Admin Authentication**: All mutation endpoints (POST, PUT, DELETE) require admin role
- **Cascade Delete**: Deleting a template also removes its details and cart items
- **Field Limits**: Schema enforces VarChar limits on URLs (500) and title (200)
- **Active Status**: Use `isActive: "INACTIVE"` to soft-delete templates instead of hard delete
- **Price Validation**: Prices must be between $0.01 and $999,999.99
