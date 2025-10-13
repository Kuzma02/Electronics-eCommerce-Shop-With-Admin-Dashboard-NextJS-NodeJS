// Security Test Runner
const { runUserSecurityTests } = require('./user-security.test');

async function runAllSecurityTests() {
  console.log("🚀 Starting Security Test Suite...\n");
  
  try {
    await runUserSecurityTests();
    console.log("\n🎉 All security tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Security tests failed:", error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllSecurityTests();
}

module.exports = { runAllSecurityTests };
