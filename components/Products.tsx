import React from "react";
import ProductItem from "./ProductItem";

const Products = async () => {
  const data = await fetch("http://localhost:3000/api/products", {
    next: { revalidate: 10 },
  });
  const products = await data.json();
  return (
    <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.map((product: Product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
