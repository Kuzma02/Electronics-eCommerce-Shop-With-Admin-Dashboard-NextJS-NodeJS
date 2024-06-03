const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function getAllWishlist(request, response) {
  try {
    const wishlist = await prisma.wishlist.findMany({
      include: {
        product: true, // Include product details
      },
    });
    return response.json(wishlist);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching wishlist" });
  }
}

async function getAllWishlistByUserId(request, response) {
  const { userId } = request.params;
  try {
    // getting all products by userId
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true, // Include product details
      },
    });
    return response.json(wishlist);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching wishlist" });
  }
}

async function createWishItem(request, response) {
  try {
    const { userId, productId } = request.body;
    const wishItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
    return response.status(201).json(wishItem);
  } catch (error) {
    console.error("Error creating wish item:", error);
    return response.status(500).json({ error: "Error creating wish item" });
  }
}

async function deleteWishItem(request, response) {
  try {
    const { id } = request.params;
    console.log("Deleting wish item "+id);
    await prisma.wishlist.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();

  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error deleting wish item" });
  }
}


module.exports = {
  getAllWishlistByUserId,
  getAllWishlist,
  createWishItem,
  deleteWishItem
};
