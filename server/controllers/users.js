const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllUsers(request, response) {
  try {
    const users = await prisma.user.findMany({});
    return response.json(users);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching users" });
  }
}

module.exports = {
  getAllUsers,
};
