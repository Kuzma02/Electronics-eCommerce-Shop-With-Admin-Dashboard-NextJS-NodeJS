// Test MySQL Connection Script
const mysql = require("mysql2");

// Baca dari .env file
require("dotenv").config();

console.log("🔍 Testing MySQL Connection...\n");

// Ambil DATABASE_URL dari .env
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL not found in .env file");
  process.exit(1);
}

// Parse DATABASE_URL
// Format: mysql://username:password@host:port/database
const urlPattern = /mysql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)\?/;
const match = dbUrl.match(urlPattern);

if (!match) {
  console.error("❌ Invalid DATABASE_URL format");
  console.log(
    "Expected format: mysql://username:password@host:port/database?..."
  );
  process.exit(1);
}

const [, user, password, host, port, database] = match;

console.log("📋 Connection Details:");
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   User: ${user}`);
console.log(`   Password: ${"*".repeat(password.length)}`);
console.log(`   Database: ${database}`);
console.log("");

// Buat koneksi
const connection = mysql.createConnection({
  host: host,
  port: parseInt(port),
  user: user,
  password: password,
  database: database,
});

// Test koneksi
connection.connect((err) => {
  if (err) {
    console.error("❌ Connection FAILED!");
    console.error("Error:", err.message);
    console.error("Error Code:", err.code);
    console.log("\n💡 Possible solutions:");
    console.log("   1. Check if MySQL server is running");
    console.log("   2. Verify username and password in .env file");
    console.log("   3. Make sure the database exists");
    console.log("   4. Check MySQL port (default: 3306)");
    process.exit(1);
  }

  console.log("✅ Connection SUCCESSFUL!");
  console.log(`   Connected to MySQL database: ${database}`);

  // Query untuk info lebih lanjut
  connection.query("SELECT VERSION() as version", (error, results) => {
    if (error) {
      console.error("Error getting version:", error.message);
    } else {
      console.log(`   MySQL Version: ${results[0].version}`);
    }

    // Cek apakah database memiliki tables
    connection.query("SHOW TABLES", (error, results) => {
      if (error) {
        console.error("Error showing tables:", error.message);
      } else {
        console.log(`   Number of tables: ${results.length}`);
        if (results.length > 0) {
          console.log(
            "   Tables:",
            results.map((r) => Object.values(r)[0]).join(", ")
          );
        }
      }

      connection.end();
      console.log("\n✨ Connection test completed!");
    });
  });
});
