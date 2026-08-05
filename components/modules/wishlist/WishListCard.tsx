import AddToCartSingleProductBtn from "@/components/AddToCartSingleProductBtn";
import Image from "next/image";
import Link from "next/link";

interface WishlistCardProps {
  id: string;
  title: string;
  price: number;
  product: Product;
  image: string;
  quantityCount: number;
  slug: string;
  onRemove?: (id: string) => void | Promise<void>;
  stockAvailabillity: number;
}

export default function WishlistCard({
  title,
  id,
  onRemove,
  product,
  price,
  image,
  slug,
  stockAvailabillity,
}: WishlistCardProps) {
  return (
    <div className="
      group relative overflow-hidden
      rounded-2xl 
      border border-gray-200
      bg-white
      shadow-sm
      hover:shadow-2xl
      transition-all duration-300
      hover:-translate-y-1
    ">

      {/* Stock Badge */}
      <div className="absolute top-4 left-4 z-10">
        {stockAvailabillity > 0 ? (
          <span className="
            bg-green-100 text-green-700
            px-3 py-1 rounded-full
            text-xs font-semibold
          ">
            In Stock
          </span>
        ) : (
          <span className="
            bg-red-100 text-red-600
            px-3 py-1 rounded-full
            text-xs font-semibold
          ">
            Out of Stock
          </span>
        )}
      </div>


      {/* Image */}
      <Link href={`/product/${slug}`}>
        <div className="
          relative 
          h-64 
          overflow-hidden
          bg-gray-50
        ">
          <Image
            src={image ? `/${image}` : "/product_placeholder.jpg"}
            fill
            sizes="100vw"
            className="
              object-contain
              p-6
              group-hover:scale-110
              transition-transform duration-500
            "
            alt={title || "Product image"}
          />
        </div>
      </Link>


      {/* Content */}
      <div className="p-5">

        <Link href={`/product/${slug}`}>
          <h3
            className="
              text-lg
              font-semibold
              text-gray-900
              line-clamp-2
              group-hover:text-blue-600
              transition
            "
          >
            {title}
          </h3>
        </Link>


        <div className="flex items-center justify-between mt-3">

          <p className="
            text-2xl
            font-bold
            text-blue-600
          ">
            ${price}
          </p>

          <span className="
            text-xs
            text-gray-400
            font-medium
          ">
            Wishlist
          </span>

        </div>


        {/* Buttons */}
        <div className="mt-6  space-y-3">
          <AddToCartSingleProductBtn
            quantityCount={1}
            product={product}
          />
          <button
            onClick={() => onRemove?.(id)}
            className="
               w-[200px]
              py-3
              rounded-xl
              border
              border-red-500
              text-red-500
              font-semibold

              hover:bg-red-500
              hover:text-white

              active:scale-95
              transition-all
            "
          >
            Remove from Wishlist
          </button>

        </div>

      </div>

    </div>
  );
}