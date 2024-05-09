interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  rating: number;
  description: string;
  mainImage: string;
  manufacturer: string;
  categoryId: string;
  inStock: number;
}

interface SingleProductPageProps {
  params: {
    productSlug: string;
  };
}

type ProductInWishlist = {
  id: number;
  title: string;
  price: number;
  image: string;
  slug: string;
};

interface OtherImages {
  imageID: number;
  productID: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  password: string | null;
  role: string;
}