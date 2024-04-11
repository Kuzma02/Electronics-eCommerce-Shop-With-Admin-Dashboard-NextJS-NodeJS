const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getProductCategory(request, response) {
    const { slug } = request.params;
    const product = await prisma.product.findUnique({
        where: {
          slug: slug
        }
      });
    console.log(product);
    if (!product) {
        return response.status(404).json({ error: "Product not found" });
    }
    return response.status(200).json(product)
}

module.exports = { getProductCategory };
