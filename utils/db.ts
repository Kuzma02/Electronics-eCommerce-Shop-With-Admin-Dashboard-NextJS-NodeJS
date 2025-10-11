import { PrismaClient } from "@prisma/client"; 

const prismaClientSingleton = () => {
    // Validate that DATABASE_URL is present
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    // Parse DATABASE_URL to check SSL configuration
    const databaseUrl = process.env.DATABASE_URL;
    const url = new URL(databaseUrl);
    
    // Log SSL configuration for debugging
    if (process.env.NODE_ENV === "development") {
        console.log(` Database connection: ${url.protocol}//${url.hostname}:${url.port || '3306'}`);
        console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
    }

    return new PrismaClient({
        // Add logging for debugging
        log: process.env.NODE_ENV === "development" 
            ? ['query', 'info', 'warn', 'error']
            : ['error', 'warn'],
    });
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;