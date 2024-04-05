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

async function createImage(request, response) {
    try {
        console.log("Creating image:", request.body);
        const { productID, image } = request.body;
        const createImage = await prisma.image.create({
            data: {
                productID,
                image
            }
        });
        console.log("Image created:", createImage); // Dodajemo log za proveru
        return response.status(201).json(createImage);
    } catch (error) {
        console.error("Error creating image:", error); // Dodajemo log za proveru
        return response.status(500).json({ error: "Error creating image" });
    }
}

async function updateImage(request, response) {
    try {
        const { id } = request.params; // Dobijamo productID iz params
        console.log("Updating image with productID:", id); // Dodajemo log za proveru
        const { productID, image } = request.body;

        // Proveravamo da li slika postoji za dati productID
        const existingImage = await prisma.image.findFirst({
            where: {
                productID: id // Tražimo sliku na osnovu productID
            }
        });

        // Ako slika ne postoji, vraćamo odgovarajući status koda
        if (!existingImage) {
            return response.status(404).json({ error: "Image not found for the provided productID" });
        }

        // Ažuriramo sliku koristeći pronađeni imageID
        const updatedImage = await prisma.image.update({
            where: {
                imageID: existingImage.imageID // Koristimo imageID pronađene slike
            },
            data: {
                productID: productID,
                image: image
            }
        });

        return response.json(updatedImage);
    } catch (error) {
        console.error("Error updating image:", error); // Dodajemo log za proveru
        return response.status(500).json({ error: "Error updating image" });
    }
}



async function deleteImage(request, response) {
    try {
        const { id } = request.params;
        console.log("Deleting image with productID:", id); // Dodajemo log za proveru
        await prisma.image.deleteMany({
            where: {
                productID: String(id) // Konvertujemo id u string
            }
        });
        return response.status(204).send();
    } catch (error) {
        console.error("Error deleting image:", error); // Dodajemo log za proveru
        return response.status(500).json({ error: "Error deleting image" });
    }
}





module.exports = { getSingleProductImages, createImage, updateImage, deleteImage };

