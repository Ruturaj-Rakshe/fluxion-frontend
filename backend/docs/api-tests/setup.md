# Environment Setup

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Neon)
- npm or pnpm package manager

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3001"

# Node Environment
NODE_ENV="development"
```

## Database Setup

Run Prisma migrations and generate client:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# (Optional) Seed admin user
npx tsx prisma/seedAdmin.ts
```

## Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8080` (or the port specified in your .env file).

## Testing the API

Once the server is running, you can test endpoints using:

1. **cURL** (command line)
2. **Postman** (GUI client)
3. **Thunder Client** (VS Code extension)
4. **Your frontend application**

## Common Issues

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Check if PostgreSQL is running
- Ensure database exists

### JWT Secret Missing
- Server will exit if `JWT_SECRET` is not set
- Generate a secure random string (at least 32 characters)

### CORS Errors
- Ensure `FRONTEND_URL` matches your frontend's origin
- Check if frontend is running on the specified URL

### Port Already in Use
- Change the port in your server configuration
- Kill the process using the port: `npx kill-port 3000`
