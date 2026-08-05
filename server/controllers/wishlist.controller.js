const prisma = require("../utills/db");

async function getWishlistById(req, res) {
  try {
    const { userId } = req.params;
    const id = userId ;

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: id
      },
      include: {
        product: true,
      },
    });


    if (wishlist.length === 0) {
      return res.status(404).json({
        message: "No Products Found",
      });
    }
    return res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch wishlist",
    });
  }
}

// Create Wishlist
 async function  createWishListItem (req, res)  {
  try {
    const { userId, productId } = req.body;

    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        message: "Product already exists in wishlist",
      });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    return res.status(201).json(wishlistItem);
  } catch (error) {
    console.error("Create Wishlist Error:", error);

    return res.status(500).json({
      message: "Failed to add item to wishlist",
    });
  }
};

//Remove Wishlist 

async function removeWishlist(req, res) {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and Product ID are required",
      });
    }

    const deletedItem = await prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    return res.status(200).json({
      message: "Product removed from wishlist",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to remove wishlist item",
    });
  }
}
// get all wishlist 
module.exports = { getWishlistById , createWishListItem , removeWishlist};
