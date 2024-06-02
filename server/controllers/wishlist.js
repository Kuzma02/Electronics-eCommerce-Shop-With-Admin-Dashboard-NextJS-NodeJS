const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function getAllWishlistByUserId(request, response) {
  try {
    const wishlist = await prisma.wishlist.findMany({});
    return response.json(wishlist);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching wishlist" });
  }
}

module.exports = {
    getAllWishlistByUserId,
};
