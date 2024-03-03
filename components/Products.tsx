export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import ProductItem from "./ProductItem";

const Products = async ({ slug }: any) => {
  
  const data = await fetch(
    `http://localhost:3000/api/products?filters[price][$lte]=${
      slug?.searchParams?.price || 3000
    }`
  );
  const products = await data.json();

  /*
    const req = await fetch(
    `http://localhost:1337/api/products?populate=*&filters[price][$lte]=${
      searchParams?.price || 1000
    }${searchParams.women === "true" ? "&filters[category][$eq]=women" : ""}${searchParams.womenNewEdition === "true" ? "&filters[category][$eq]=women%20new%20edition" : ""}&filters[rating][$gte]=${
      searchParams?.rating || 1
    }`
  );
  const products = await req.json();
  */
  return (
    <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.map((product: Product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
