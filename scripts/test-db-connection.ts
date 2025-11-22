import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL:', databaseUrl ? 'SET' : 'NOT SET');
    
    if (!databaseUrl) {
      console.error('DATABASE_URL environment variable is not set');
      return;
    }
    
    // Try to create Prisma client
    const prisma = new PrismaClient();
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();