interface Product {
    id: number;
    slug: string;
    title: string;
    price: number;
    rating: number;
    description: string;
    mainImage: string;
}

interface SingleProductPageProps {
    params: {
        productSlug: string;
    }
}