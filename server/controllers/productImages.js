const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSingleProductImages
    (
        request,
        response
    ) {
    const { id } = request.params;
    const images = await prisma.image.findMany({
        where: { productID: id },
    });
    if (!images) {
        return response.json({ error: "Images not found" }, { status: 404 });
    }
    return response.json(images);
}


module.exports = { getSingleProductImages };

