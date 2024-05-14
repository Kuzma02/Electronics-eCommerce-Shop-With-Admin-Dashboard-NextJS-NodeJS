const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrderProduct(request, response) {
    try {
        console.log("Creating order:", request.body);
        const { customerOrderId, productId, quantity } = request.body;
        const corder = await prisma.customer_order_product.create({
            data: {
                customerOrderId,
                productId,
                quantity
            }
        });
        console.log("Product order created:", corder);
        return response.status(201).json(corder);
    } catch (error) {
        console.error("Error creating prodcut order:", error);
        return response.status(500).json({ error: "Error creating product order" });
    }
}


async function updateProductOrder(request, response) {
    try {
        const { id } = request.params;
        console.log("Updating product order with id:", id);
        const { customerOrderId, productId, quantity } = request.body;


        const existingOrder = await prisma.customer_order_product.findUnique({
            where: {
                id: id
            }
        });

        if (!existingOrder) {
            return response.status(404).json({ error: "Order not found" });
        }


        const updatedOrder = await prisma.customer_order_product.update({
            where: {
                id: existingOrder.id
            },
            data: {
                customerOrderId,
                productId,
                quantity
            }
        });

        return response.json(updatedOrder);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Error updating order" });
    }
}

async function deleteProductOrder(request, response) {
    try {
        const { id } = request.params;
        console.log("Deleting product order with id:", id);
        await prisma.customer_order_product.delete({
            where: {
                id: id
            }
        });
        return response.status(204).send();
    } catch (error) {
        return response.status(500).json({ error: "Error deleting product order" });
    }
}

async function getProductOrder(request, response) {
    const { id } = request.params;
    const order = await prisma.customer_order_product.findMany({
        where: {
            customerOrderId: id // Koristi customerOrderId kao uslov pretrage
        },
        include: {
            product: true // Ukljucuje informacije o proizvodu u odgovor
        }
    });
    console.log(order);
    if (!order) {
        return response.status(404).json({ error: "Order not found" });
    }
    return response.status(200).json(order);
}


async function getAllProductOrders(request, response) {
    try {
        // Pronalaženje svih porudžbina iz customer_order_product tabele
        const productOrders = await prisma.customer_order_product.findMany({
            select: {
                productId: true, // Izdvajanje samo productId-ova
                quantity: true, // Izdvajanje samo quantity-ja
                customerOrder: { // Spajanje na customerOrder objekat iz tabele customer_order_product
                    select: {
                        id: true, // Izdvajanje samo id-jeva iz tabele customer_orders
                        name: true, // Dodajte ostale potrebne informacije o porudžbini
                        lastname: true,
                        phone: true,
                        email: true,
                        company: true,
                        adress: true,
                        apartment: true,
                        postalCode: true,
                        dateTime: true,
                        status: true,
                        total: true
                    }
                }
            }
        });

        // Kreiranje mape za čuvanje podataka o porudžbinama grupisanim po customerOrderId-u
        const ordersMap = new Map();

        // Iteracija kroz sve porudžbine
        for (const order of productOrders) {
            const { customerOrder, productId, quantity } = order;
            const { id, ...orderDetails } = customerOrder;

            // Pronalaženje proizvoda iz tabele Product na osnovu productId-ja
            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                },
                select: {
                    id: true,
                    // Dodajte ostale željene informacije o proizvodu
                    title: true,
                    mainImage: true,
                    price: true,
                    slug: true
                }
            });

            if (ordersMap.has(id)) {
                // Ako postoji unos za customerOrderId, dodajte novi proizvod u postojeći niz
                ordersMap.get(id).products.push({ ...product, quantity });
            } else {
                // Inače, kreirajte novi unos za customerOrderId i dodajte prvi proizvod
                ordersMap.set(id, {
                    customerOrderId: id,
                    customerOrder: orderDetails,
                    products: [{ ...product, quantity }]
                });
            }
        }

        // Konvertovanje mape u niz objekata
        const groupedOrders = Array.from(ordersMap.values());

        return response.json(groupedOrders);
    } catch (error) {
        console.error('Error fetching all product orders:', error);
        return response.status(500).json({ error: "Error fetching all product orders" });
    }
}



module.exports = { createOrderProduct, updateProductOrder, deleteProductOrder, getProductOrder,getAllProductOrders};