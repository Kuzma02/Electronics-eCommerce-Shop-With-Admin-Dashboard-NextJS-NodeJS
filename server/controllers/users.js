const prisma = require("../utills/db"); // ✅ Fixed: removed .default
const bcrypt = require("bcryptjs");

// Helper function to exclude password from user object
function excludePassword(user) {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function getAllUsers(request, response) {
  try {
    const users = await prisma.user.findMany({});
    // Exclude password from all users
    const usersWithoutPasswords = users.map(user => excludePassword(user));
    return response.json(usersWithoutPasswords);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching users" });
  }
}

async function createUser(request, response) {
  try {
    const { email, password, role } = request.body;
    const hashedPassword = await bcrypt.hash(password, 14);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    // Exclude password from response
    return response.status(201).json(excludePassword(user));
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Error creating user" });
  }
}

async function updateUser(request, response) {
  try {
    const { id } = request.params;
    const { email, password, role } = request.body;
    const hashedPassword = await bcrypt.hash(password, 14);
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // Exclude password from response
    return response.status(200).json(excludePassword(updatedUser));
  } catch (error) {
    return response.status(500).json({ error: "Error updating user" });
  }
}

async function deleteUser(request, response) {
  try {
    const { id } = request.params;
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error deleting user" });
  }
}

async function getUser(request, response) {
  const { id } = request.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  // Exclude password from response
  return response.status(200).json(excludePassword(user));
}

async function getUserByEmail(request, response) {
  const { email } = request.params;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }
  // Exclude password from response
  return response.status(200).json(excludePassword(user));
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserByEmail,
};
