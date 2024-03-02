interface Product {
    id: number;
    slug: string;
    title: string;
    price: number;
    rating: number;
    description: string;
    mainImage: string;
    manufacturer: string;
    category: string;
}

interface SingleProductPageProps {
    params: {
        productSlug: string;
    }
}