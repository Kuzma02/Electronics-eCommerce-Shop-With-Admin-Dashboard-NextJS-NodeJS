// Script to create admin user
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = "kingashura0987@gmail.com";
    const password = "Fadilah!123";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log("❌ User with this email already exists!");
      console.log("   Email:", email);
      console.log("   Current Role:", existingUser.role);

      // Update to admin if not already
      if (existingUser.role !== "admin") {
        const updated = await prisma.user.update({
          where: { email: email },
          data: { role: "admin" },
        });
        console.log("✅ User role updated to admin!");
      } else {
        console.log("✅ User is already an admin!");
      }
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID for user ID
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

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminUser.email);
    console.log("🔑 Role:", adminUser.role);
    console.log("🆔 ID:", adminUser.id);
    console.log("\n🔐 Login credentials:");
    console.log("   Email:", email);
    console.log("   Password:", password);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
