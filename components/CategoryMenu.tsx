import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import IntroducingSection from "./IntroducingSection";

const CategoryMenu = () => {
  return (
    <div className="py-10 bg-blue-600">
      <h2 className="text-white text-7xl font-extrabold text-center mt-20">CATEGORIES</h2>
      <div className="max-w-screen-2xl mx-auto py-10 gap-x-5 px-16 max-md:px-10 gap-y-5 grid grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-2">
        {categoryMenuList.map((item) => (
          <CategoryItem title={item.title} key={item.id} href={item.href}>
            <Image src={item.src} width={48} height={48} alt={item.title} />
          </CategoryItem>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
