# API Testing Guide - Fluxion Backend

Base URL: `http://localhost:3000/api` (adjust port as needed)

## Documentation Structure

This folder contains API testing documentation organized by controller:

- **[user-api.md](./user-api.md)** - User authentication, profile management, and admin operations
- **[template-api.md](./template-api.md)** - Template CRUD operations (basic)
- **[template-details-api.md](./template-details-api.md)** - Template details management (extended info)
- **[cart-api.md](./cart-api.md)** - Shopping cart operations and checkout
- **[setup.md](./setup.md)** - Environment setup and prerequisites

## Quick Start

1. Check [setup.md](./setup.md) for environment configuration
2. Start with user registration/login in [user-api.md](./user-api.md) to get auth tokens
3. Use the auth token to test protected endpoints in other API docs

## API Categories

### Public Endpoints (No Auth Required)
- User registration/login
- Template listing and details
- Template details listing

### User-Protected Endpoints (JWT Required)
- User profile operations
- User account management
- **Cart operations (add, update, remove, checkout)**

### Admin-Only Endpoints (Admin JWT Required)
- Template CRUD (create, update, delete)
- Template Details CRUD
- User role management
- User listing

## Testing Tools

Use any of these tools:
- **cURL** (command line - examples provided in docs)
- **Postman** (import curl commands)
- **Thunder Client** (VS Code extension)
- **Insomnia**

## Response Formats

All responses follow this structure:

**Success:**
```json
{
  "message": "Operation description",
  "data": { /* result object */ }
}
```

**Error:**
```json
{
  "message": "Error description",
  "errors": [ /* validation errors if applicable */ ]
}
```
