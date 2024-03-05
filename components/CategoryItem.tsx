import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center gap-y-2 cursor-pointer hover:bg-gray-100 py-2 rounded-lg">
        {children}

        <h3>{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
