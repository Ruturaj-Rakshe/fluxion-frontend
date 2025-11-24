import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.ts'

async function getConnectionString(): Promise<string> {
    const dbUrl = process.env.DATABASE_URL;
    console.log("Database Connected");
    if (!dbUrl) {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }
    return dbUrl;
}
const connectionString = await getConnectionString();

const adapter = new PrismaPg({ connectionString })

const prisma = new PrismaClient({ adapter })

export { prisma }
