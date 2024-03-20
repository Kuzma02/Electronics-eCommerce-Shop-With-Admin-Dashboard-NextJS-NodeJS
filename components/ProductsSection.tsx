import React from "react";
import ProductItem from "./ProductItem";

const ProductsSection = async () => {
  const data = await fetch("http://localhost:3001/api/products", {
    cache: "no-store",
  });
  const products = await data.json();
  return (
    <div className="bg-blue-500 py-10 border-t-4 border-white">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <h2 className="text-white text-7xl font-extrabold text-center">
          FEATURED PRODUCTS
        </h2>
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-lg:grid-cols-3 max-sm:grid-cols-2 max-[400px]:grid-cols-1">
          {products.map((product: Product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
