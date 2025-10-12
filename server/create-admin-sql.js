// Script untuk generate SQL query membuat admin user
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function generateAdminSQL() {
  const email = "kingashura0987@gmail.com";
  const password = "Fadilah!123";
  const name = "Admin";
  const role = "admin";

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate UUID
  const userId = uuidv4();

  // Generate SQL query
  const sqlQuery = `INSERT INTO User (id, email, password, name, role) 
VALUES ('${userId}', '${email}', '${hashedPassword}', '${name}', '${role}');`;

  console.log("\n✅ SQL Query untuk membuat Admin User:\n");
  console.log("━".repeat(80));
  console.log(sqlQuery);
  console.log("━".repeat(80));
  console.log("\n📋 Detail Admin User:");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Name: ${name}`);
  console.log(`   Role: ${role}`);
  console.log(`   UUID: ${userId}`);
  console.log(`   Hashed Password: ${hashedPassword}`);
  console.log("\n💡 Cara menggunakan:");
  console.log("   1. Buka phpMyAdmin di XAMPP (http://localhost/phpmyadmin)");
  console.log('   2. Pilih database "singitronic_nextjs"');
  console.log('   3. Klik tab "SQL"');
  console.log("   4. Paste query di atas");
  console.log('   5. Klik "Go" atau "Kirim"\n');
}

generateAdminSQL().catch(console.error);
