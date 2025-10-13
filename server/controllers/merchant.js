const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllMerchants(request, response) {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        products: true,
      },
    });
    return response.json(merchants);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return response.status(500).json({ error: "Error fetching merchants" });
  }
}

async function getMerchantById(request, response) {
  try {
    const { id } = request.params;
    const merchant = await prisma.merchant.findUnique({
      where: {
        id: id,
      },
      include: {
        products: true,
      },
    });

    if (!merchant) {
      return response.status(404).json({ error: "Merchant not found" });
    }

    return response.json(merchant);
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return response.status(500).json({ error: "Error fetching merchant" });
  }
}

async function createMerchant(request, response) {
  try {
    const { name, email, phone, address, description, status } = request.body;

    const merchant = await prisma.merchant.create({
      data: {
        name,
        email,
        phone,
        address,
        description,
        status: status || "ACTIVE",
      },
    });

    return response.status(201).json(merchant);
  } catch (error) {
    console.error("Error creating merchant:", error);
    return response.status(500).json({ error: "Error creating merchant" });
  }
}

async function updateMerchant(request, response) {
  try {
    const { id } = request.params;
    const { name, email, phone, address, description, status } = request.body;

    const merchant = await prisma.merchant.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        phone,
        address,
        description,
        status,
      },
    });

    return response.json(merchant);
  } catch (error) {
    console.error("Error updating merchant:", error);
    return response.status(500).json({ error: "Error updating merchant" });
  }
}

async function deleteMerchant(request, response) {
  try {
    const { id } = request.params;
    
    // Check if merchant has products before deletion
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: { products: true },
    });

    if (merchant?.products.length > 0) {
      return response.status(400).json({
        error: "Cannot delete merchant with existing products",
      });
    }

    await prisma.merchant.delete({
      where: {
        id: id,
      },
    });

    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting merchant:", error);
    return response.status(500).json({ error: "Error deleting merchant" });
  }
}

module.exports = {
  getAllMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
};