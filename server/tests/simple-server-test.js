// Simple test to check server connection
const API_BASE_URL = "http://localhost:3001";

async function testServer() {
  console.log("Testing server at:", API_BASE_URL);

  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    const data = await res.json();
    console.log("✅ Server is running!");
    console.log("Status:", res.status);
    console.log("Response:", data);
    return true;
  } catch (error) {
    console.error("❌ Server connection failed:", error.message);
    return false;
  }
}

testServer().then((success) => {
  process.exit(success ? 0 : 1);
});
