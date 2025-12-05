# Template Details API Documentation

Base URL: `http://localhost:5000/api/template-details`

**Note:** Template Details is a one-to-one extension of the Template model. Each template can have only ONE detail record.

## Public Endpoints

### 1. Get Template Details by Template ID

**Endpoint:** `GET /get-by-template/:tempelateId`  
**Auth Required:** No  
**Description:** Get detailed information for a specific template

**cURL Example:**

```bash
curl -X GET "http://localhost:8080/api/template-details/get-by-template/clx123templateid"
```

**Success Response (200):**

```json
{
  "message": "Template details fetched successfully",
  "templateDetails": {
    "id": "clxdetail123",
    "tempelateId": "clx123templateid",
    "header": "Complete E-commerce Solution",
    "headerSubtitle": "Build your dream online store with our professional template",
    "features": [
      "Responsive design",
      "Payment integration",
      "Admin dashboard",
      "Product management"
    ],
    "benefits": [
      "Save 100+ hours of development",
      "Mobile-optimized out of the box",
      "SEO-friendly architecture",
      "Free updates for 1 year"
    ],
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:00:00.000Z",
    "tempelate": {
      "id": "clx123templateid",
      "title": "E-commerce Template",
      "price": 99.0
    }
  }
}
```

**Error Response (404):**

```json
{
  "message": "Template details not found"
}
```

---

### 2. List All Template Details

**Endpoint:** `GET /list-all`  
**Auth Required:** No  
**Description:** List all template details with pagination

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**cURL Example:**

```bash
curl -X GET "http://localhost:8080/api/template-details/list-all?page=1&limit=10"
```
<!-- cmid8g90s0003vwcc0ok4pobo -->
<!-- cmid8g90s0003vwcc0ok4pobo -->
**Success Response (200):**

```json
{
  "message": "Template details fetched successfully",
  "templateDetails": [
    {
      "id": "clxdetail123",
      "tempelateId": "clx123templateid",
      "header": "Complete E-commerce Solution",
      "headerSubtitle": "Build your dream online store",
      "features": ["Responsive design", "Payment integration"],
      "benefits": ["Save 100+ hours", "Mobile-optimized"],
      "createdAt": "2025-11-24T10:00:00.000Z",
      "updatedAt": "2025-11-24T10:00:00.000Z",
      "tempelate": {
        "id": "clx123templateid",
        "title": "E-commerce Template",
        "price": 99.0,
        "isActive": "ACTIVE"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

## Admin-Only Endpoints

### 3. Add Template Details

**Endpoint:** `POST /add/:tempelateId`  
**Auth Required:** Yes (Admin)  
**Description:** Add detailed information to a template (one-time operation, use update for changes)

**Request Body:**

```json
{
  "header": "Complete E-commerce Solution",
  "headerSubtitle": "Build your dream online store with our professional template",
  "features": [
    "Responsive design",
    "Payment integration ready",
    "Admin dashboard included",
    "Product management system"
  ],
  "benefits": [
    "Save 100+ hours of development time",
    "Mobile-optimized out of the box",
    "SEO-friendly architecture",
    "Free updates for 1 year"
  ]
}
```

**Validation Rules:**

- `header`: 1-300 characters (required)
- `headerSubtitle`: 1-500 characters (required)
- `features`: Array of 1-20 strings, each 1-200 characters (required)
- `benefits`: Array of 1-20 strings, each 1-200 characters (required)

**cURL Example:**

```bash
curl -X POST "http://localhost:8080/api/template-details/add/clx123templateid" \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "header": "Complete E-commerce Solution",
    "headerSubtitle": "Build your dream online store",
    "features": ["Responsive design", "Payment integration", "Admin dashboard"],
    "benefits": ["Save 100+ hours", "SEO-friendly", "Mobile-optimized"]
  }'
```

**Success Response (201):**

```json
{
  "message": "Template detail added successfully",
  "templateDetail": {
    "id": "clxdetail123",
    "tempelateId": "clx123templateid",
    "header": "Complete E-commerce Solution",
    "headerSubtitle": "Build your dream online store",
    "features": ["Responsive design", "Payment integration", "Admin dashboard"],
    "benefits": ["Save 100+ hours", "SEO-friendly", "Mobile-optimized"],
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Template details already exist (use update instead)
- `400` - Validation errors
- `403` - Forbidden (not admin)
- `404` - Template not found
- `500` - Server error

---



### 4. Update Template Details

**Endpoint:** `PUT /update/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Update template details (partial update allowed)

**Request Body (example - partial):**

```json
{
  "header": "Updated E-commerce Solution",
  "benefits": ["Saves time", "Easy to use", "Professional design"]
}
```

**cURL Example:**

```bash
curl -X PUT "http://localhost:8080/api/template-details/update/clxdetail123" \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "header": "Updated E-commerce Solution",
    "benefits": ["Saves time", "Easy to use", "Professional design"]
  }'
```

**Success Response (200):**

```json
{
  "message": "Template detail updated successfully",
  "templateDetail": {
    "id": "clxdetail123",
    "tempelateId": "clx123templateid",
    "header": "Updated E-commerce Solution",
    "headerSubtitle": "Build your dream online store",
    "features": ["Responsive design", "Payment integration"],
    "benefits": ["Saves time", "Easy to use", "Professional design"],
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400` - No valid fields to update
- `400` - Validation errors
- `403` - Forbidden (not admin)
- `404` - Template details not found
- `500` - Server error

---

### 5. Delete Template Details

**Endpoint:** `DELETE /delete/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete template details

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8080/api/template-details/delete/clxdetail123" \
  -b admin-cookies.txt
```

**Success Response (200):**

```json
{
  "message": "Template detail deleted successfully"
}
```

**Error Responses:**

- `403` - Forbidden (not admin)
- `404` - Template details not found
- `500` - Server error

---

## Notes

- **One-to-One Relation**: Each template can only have ONE detail record. Attempting to add a second will return 400 error.
- **Cascade Delete**: Template details are automatically deleted when the parent template is deleted (via schema `onDelete: Cascade`).
- **XSS Protection**: All string inputs (header, subtitle, features, benefits) are sanitized to prevent XSS attacks.
- **Array Limits**: Features and benefits arrays are limited to 20 items each, with each string max 200 characters.
- **Partial Updates**: You can update individual fields without sending the entire object.
- **Admin Only Mutations**: All create/update/delete operations require admin role.
