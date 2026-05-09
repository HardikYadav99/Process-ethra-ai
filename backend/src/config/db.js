import { PrismaClient } from '@prisma/client';

// Create a single instance of the Prisma Client
const prisma = new PrismaClient();

// Test the connection logic
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully via Prisma');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1); // Kill the server if the DB is unreachable
  }
}

export { prisma, connectDB };