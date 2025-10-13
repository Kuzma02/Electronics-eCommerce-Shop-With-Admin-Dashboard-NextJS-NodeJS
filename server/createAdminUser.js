// Create an admin user directly
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Get credentials from command line
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.log("❌ Please provide email and password as command line arguments.");
      console.log("Usage: node createAdminUser.js <email> <password>");
      process.exit(1);
    }

    console.log("🔐 Creating admin user...\n");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log(`⚠️  User with email "${email}" already exists!`);

      if (existingUser.role === "admin") {
        console.log("ℹ️  This user is already an admin. 👑\n");
      } else {
        console.log("💡 Use makeUserAdmin.js to promote this user to admin.\n");
      }

      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID
    const userId = crypto.randomUUID();

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ SUCCESS! Admin user created! 👑\n");
    console.log("Admin Credentials:");
    console.log("─".repeat(50));
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     ${adminUser.role}`);
    console.log(`  User ID:  ${adminUser.id}`);
    console.log("─".repeat(50));
    console.log("\n🎉 You can now login with these credentials!\n");
    console.log("⚠️  IMPORTANT: Please save these credentials securely!\n");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
