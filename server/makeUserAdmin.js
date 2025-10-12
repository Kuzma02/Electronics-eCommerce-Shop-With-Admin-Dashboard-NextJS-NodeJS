// Make a user admin by email
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function makeUserAdmin() {
  try {
    // Get email from command line argument
    const email = process.argv[2];

    if (!email) {
      console.log("❌ Please provide an email address.");
      console.log("Usage: node makeUserAdmin.js <email>\n");
      console.log("Example: node makeUserAdmin.js user@example.com\n");
      process.exit(1);
    }

    console.log(`🔍 Looking for user: ${email}...\n`);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found.`);
      console.log('💡 Run "node listUsers.js" to see all available users.\n');
      process.exit(1);
    }

    // Check if already admin
    if (user.role === "admin") {
      console.log(`ℹ️  User "${email}" is already an admin! 👑\n`);
      process.exit(0);
    }

    // Update user role to admin
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { role: "admin" },
    });

    console.log("✅ SUCCESS! User has been promoted to admin! 👑\n");
    console.log("User Details:");
    console.log("─".repeat(50));
    console.log(`  Email: ${updatedUser.email}`);
    console.log(`  Role:  ${updatedUser.role}`);
    console.log(`  ID:    ${updatedUser.id}`);
    console.log("─".repeat(50));
    console.log("\n🎉 You can now login as admin!\n");
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeUserAdmin();
