const fs = require("fs");
const path = require("path");

async function testBulkUploadSimple() {
  console.log("🧪 Testing Bulk Upload with Simple Fetch\n");

  const csvPath = path.join(__dirname, "..", "..", "bulk-upload-example.csv");

  if (!fs.existsSync(csvPath)) {
    console.log("❌ CSV file not found:", csvPath);
    return;
  }

  console.log("✅ Found CSV file:", csvPath);
  console.log("📄 CSV Content:");
  console.log(fs.readFileSync(csvPath, "utf8"));
  console.log("\n" + "=".repeat(50) + "\n");

  // Read the file as buffer
  const fileBuffer = fs.readFileSync(csvPath);

  console.log("📊 File info:");
  console.log("- Size:", fileBuffer.length, "bytes");
  console.log(
    "- First 100 chars:",
    fileBuffer.toString("utf8").substring(0, 100) + "...\n"
  );

  // Test with curl command
  console.log("💡 To test manually, run this command in PowerShell:\n");
  const curlCmd = `curl -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"`;
  console.log(curlCmd);
  console.log("\n" + "=".repeat(50) + "\n");

  console.log("🔍 Checking server logs...");
  const logsDir = path.join(__dirname, "..", "logs");
  if (fs.existsSync(logsDir)) {
    const logFiles = fs.readdirSync(logsDir);
    console.log("📁 Log files found:", logFiles);

    // Read the most recent error log
    const errorLogs = logFiles.filter((f) => f.includes("error"));
    if (errorLogs.length > 0) {
      const latestErrorLog = errorLogs.sort().reverse()[0];
      const errorLogPath = path.join(logsDir, latestErrorLog);
      console.log("\n📋 Latest error log:", latestErrorLog);
      console.log(
        fs.readFileSync(errorLogPath, "utf8").split("\n").slice(-20).join("\n")
      );
    }
  } else {
    console.log("⚠️  No logs directory found");
  }
}

testBulkUploadSimple();
