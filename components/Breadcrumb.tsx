import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";

const Breadcrumb = () => {
  return (
    <div className="text-lg breadcrumbs pb-10">
      <ul>
        <li>
          <Link href="/">
            <FaHouse className="mr-2" />
            Home
          </Link>
        </li>
        <li>
          <Link href="/shop">Shop</Link>
        </li>
        <li>
          <Link href="/shop">All products</Link>
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
