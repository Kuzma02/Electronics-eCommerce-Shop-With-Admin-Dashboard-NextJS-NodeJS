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
    inStock: boolean;
}

interface SingleProductPageProps {
    params: {
        productSlug: string;
    }
}

type ProductInWishlist = {
    id: number;
    title: string;
    price: number;
    image: string;
    slug: string;
  };