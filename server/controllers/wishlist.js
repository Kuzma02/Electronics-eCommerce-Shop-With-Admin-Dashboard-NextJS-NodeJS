const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { asyncHandler, AppError } = require("../utills/errorHandler");

const getAllWishlist = asyncHandler(async (request, response) => {
  const wishlist = await prisma.wishlist.findMany({
    include: {
      product: true, // Include product details
    },
  });
  return response.json(wishlist);
});

const getAllWishlistByUserId = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

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
});

const createWishItem = asyncHandler(async (request, response) => {
  const { userId, productId } = request.body;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if wishlist item already exists
  const existingWishItem = await prisma.wishlist.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingWishItem) {
    throw new AppError("Product is already in wishlist", 409);
  }

  const wishItem = await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });
  return response.status(201).json(wishItem);
});

const deleteWishItem = asyncHandler(async (request, response) => {
  const { userId, productId } = request.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  const deletedItems = await prisma.wishlist.deleteMany({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (deletedItems.count === 0) {
    throw new AppError("Wishlist item not found", 404);
  }
  
  return response.status(204).send();
});

const getSingleProductFromWishlist = asyncHandler(async (request, response) => {
  const { userId, productId } = request.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }
  
  const wishItem = await prisma.wishlist.findMany({
    where: {
      userId: userId,
      productId: productId,
    },
  });
  
  return response.status(200).json(wishItem);
});

const deleteAllWishItemByUserId = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }
  
  await prisma.wishlist.deleteMany({
    where: {
      userId: userId,
    },
  });
  
  return response.status(204).send();
});

module.exports = {
  getAllWishlistByUserId,
  getAllWishlist,
  createWishItem,
  deleteWishItem,
  getSingleProductFromWishlist,
  deleteAllWishItemByUserId
};
