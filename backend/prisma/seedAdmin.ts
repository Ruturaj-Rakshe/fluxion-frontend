import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "dotenv/config";

async function seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'securepassword';

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    }); 
    if (existingAdmin) {
        console.log('Admin user already exists. Skipping seeding.');
        return;
    }
    
    // Hash password with 12 rounds (same as registration)
    const hashedPassword = await bcrypt.hash(adminPassword, 12);    
    
    // Create admin user
    const adminUser = await prisma.user.create({
        data: {
            email: adminEmail,
            name: 'Admin User',
            role: 'ADMIN',
            password: hashedPassword,
            isEmailVerified: true  // Admin doesn't need email verification
        }
    });
    console.log('Admin user created:', adminUser.email);
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(
        { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    console.log('Admin JWT Token:', token);
}
seedAdmin()
    .then(() => {
        console.log('Seeding completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    });

