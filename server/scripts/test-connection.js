require("../utills/register-ts"); // load ts-node so ../utills/db (db.ts) resolves
const prisma = require("../utills/db");

async function testConnection() {
    try {
        console.log("🧪 Testing database connection...");
        
        // Test basic connection
        await prisma.$connect();
        console.log("✅ Database connection successful");
        
        // Test SSL configuration
        const databaseUrl = process.env.DATABASE_URL;
        if (databaseUrl) {
            const url = new URL(databaseUrl);
            console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
        }
        
        // Test a simple query
        const userCount = await prisma.user.count();
        console.log(`📊 Users in database: ${userCount}`);
        
        // Test shared connection (should be the same instance)
        const prisma2 = require("../utills/db");
        console.log(`🔗 Shared connection working: ${prisma === prisma2}`);
        
        await prisma.$disconnect();
        console.log("✅ Test completed successfully");
        
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

testConnection();
