const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllProducts(request, response) {
    const dividerLocation = request.url.indexOf("?");
    let filterObj = {};
    let sortObj = {};
    let sortByValue = "defaultSort";
    if (dividerLocation !== -1) {
        // queryArray sada sadrzi ceo query deo sto ukljucuje filter i sort queryije
        const queryArray = request.url
            .substring(dividerLocation + 1, request.url.length)
            .split("&");

        let filterType;
        let filterArray = [];

        for (let i = 0; i < queryArray.length; i++) {
            // proveravam da li je u pitanju filter mod i price filter
            if (
                queryArray[i].indexOf("filters") !== -1 &&
                queryArray[i].indexOf("price") !== -1
            ) {
                // uzimam "price" deo. Naravno mogao sam samo da napisem filterType="price"
                filterType = queryArray[i].substring(
                    queryArray[i].indexOf("price"),
                    queryArray[i].indexOf("price") + "price".length
                );
            }
            // proveravam da li je u pitanju filter mod i rating filter
            if (
                queryArray[i].indexOf("filters") !== -1 &&
                queryArray[i].indexOf("rating") !== -1
            ) {
                // uzimam "rating" deo. Naravno mogao sam samo da napisem filterType="rating"
                filterType = queryArray[i].substring(
                    queryArray[i].indexOf("rating"),
                    queryArray[i].indexOf("rating") + "rating".length
                );
            }

            // proveravam da li je u pitanju filter mod i category filter
            if (
                queryArray[i].indexOf("filters") !== -1 &&
                queryArray[i].indexOf("category") !== -1
            ) {
                // uzimam "category" deo. Naravno mogao sam samo da napisem filterType="rating"
                filterType = queryArray[i].substring(
                    queryArray[i].indexOf("category"),
                    queryArray[i].indexOf("category") + "category".length
                );
            }

            if (
                queryArray[i].indexOf("filters") !== -1 &&
                queryArray[i].indexOf("inStock") !== -1
            ) {
                // uzimam "rating" deo. Naravno mogao sam samo da napisem filterType="rating"
                filterType = queryArray[i].substring(
                    queryArray[i].indexOf("inStock"),
                    queryArray[i].indexOf("inStock") + "inStock".length
                );
            }

            if (
                queryArray[i].indexOf("filters") !== -1 &&
                queryArray[i].indexOf("outOfStock") !== -1
            ) {
                // uzimam "rating" deo. Naravno mogao sam samo da napisem filterType="rating"
                filterType = queryArray[i].substring(
                    queryArray[i].indexOf("outOfStock"),
                    queryArray[i].indexOf("outOfStock") + "outOfStock".length
                );
            }

            if (queryArray[i].indexOf("sort") !== -1) {
                // uzimamo vrednost sorta iz querija
                sortByValue = queryArray[i].substring(queryArray[i].indexOf("=") + 1);
            }

            // proveravam da li je u datom queriju filters mod
            if (queryArray[i].indexOf("filters") !== -1) {
                let filterValue;
                //  proveravam da nije filter po categoriji. To radim kako bih izbegao pretvaranje Stringa u Int
                if (queryArray[i].indexOf("category") === -1) {
                    // uzimam value deo. To je deo gde se nalazi int vrednost querija i konvertujem je u broj jer je po defaultu string
                    filterValue = parseInt(
                        queryArray[i].substring(
                            queryArray[i].indexOf("=") + 1,
                            queryArray[i].length
                        )
                    );
                } else {
                    // ako je filter po kategorije
                    filterValue = queryArray[i].substring(
                        queryArray[i].indexOf("=") + 1,
                        queryArray[i].length
                    );
                }

                // uzimam operator npr. lte, gte, gt, lt...
                const filterOperator = queryArray[i].substring(
                    queryArray[i].indexOf("$") + 1,
                    queryArray[i].indexOf("=") - 1
                );

                // sve to dodajemo u filterArray
                // primer izgleda filterArray:
                /*
                [
                { filterType: 'price', filterOperator: 'lte', filterValue: 3000 },
                { filterType: 'rating', filterOperator: 'gte', filterValue: 0 }
                ]
                */
                filterArray.push({ filterType, filterOperator, filterValue });
            }
        }

        for (let item in filterArray) {
            filterObj = {
                ...filterObj,
                [filterArray[item].filterType + ""]: {
                    [filterArray[item].filterOperator]: filterArray[item].filterValue,
                },
            };
        }
    }

    if (sortByValue === "defaultSort") {
        sortObj = [];
    } else if (sortByValue === "titleAsc") {
        sortObj = [
            {
                title: "asc",
            },
        ];
    } else if (sortByValue === "titleDesc") {
        sortObj = [
            {
                title: "desc",
            },
        ];
    } else if (sortByValue === "lowPrice") {
        sortObj = [
            {
                price: "asc",
            },
        ];
    } else if (sortByValue === "highPrice") {
        sortObj = [
            {
                price: "desc",
            },
        ];
    }

    let users;
    if (Object.keys(filterObj).length === 0) {
        users = await prisma.product.findMany({});
    } else {
        users = await prisma.product.findMany < object > ({
            where: filterObj,
            orderBy: sortObj,
        });
    }
    return response.json(users);
}

async function createProduct(request, response) {
    try {
        console.log("Creating product:", request.body);
        const { slug, title, mainImage, price, rating, description, manufacturer, category, inStock } = request.body;
        const product = await prisma.product.create({
            data: {
                
                slug,
                title,
                mainImage,
                price,
                rating,
                description,
                manufacturer,
                category,
                inStock
                
            }
        });
        console.log("Product created:", product); // Dodajemo log za proveru
        return response.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error); // Dodajemo log za proveru
        return response.status(500).json({ error: "Error creating product" });
    }
}

// Metoda za ažuriranje postojećeg proizvoda
async function updateProduct(request, response) {
    try {
        const { slug } = request.params; // Dobijamo slug iz params
        console.log("Updating product with slug:", slug); // Dodajemo log za proveru
        const { title, mainImage, price, rating, description, manufacturer, category, inStock } = request.body;
        
        // Pronalazimo proizvod prema slug-u
        const existingProduct = await prisma.product.findUnique({
            where: {
                slug: slug
            }
        });

        if (!existingProduct) {
            return response.status(404).json({ error: "Product not found" });
        }

        // Ažuriramo pronađeni proizvod
        const updatedProduct = await prisma.product.update({
            where: {
                id: existingProduct.id // Koristimo ID pronađenog proizvoda
            },
            data: {
                title,
                mainImage,
                price,
                rating,
                description,
                manufacturer,
                category,
                inStock
            }
        });

        return response.json(updatedProduct);
    } catch (error) {
        return response.status(500).json({ error: "Error updating product" });
    }
}

// Metoda za brisanje proizvoda
async function deleteProduct(request, response) {
    try {
        const { slug } = request.params;
        console.log("Deleting product with slug:", slug); // Dodajemo log za proveru
        await prisma.product.delete({
            where: {
                slug: slug // Koristimo slug umesto id
            }
        });
        return response.status(204).send();
    } catch (error) {
        return response.status(500).json({ error: "Error deleting product" });
    }
}

async function searchProducts(request, response) {
    try {
        const { query } = request.query;
        if (!query) {
            return response.status(400).json({ error: "Query parameter is required" });
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query
                        }
                    },
                    {
                        description: {
                            contains: query
                        }
                    },
                    {
                        manufacturer: {
                            contains: query
                        }
                    },
                    {
                        category: {
                            contains: query
                        }
                    }
                ]
            }
        });

        return response.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        return response.status(500).json({ error: "Error searching products" });
    }
}

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

module.exports = { getAllProducts, getProductCategory, createProduct, updateProduct, deleteProduct, searchProducts };


