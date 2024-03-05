import Image from 'next/image'
import React from 'react'
import { FaHeartCrack } from 'react-icons/fa6'

const WishItem = () => {
  return (
    <tr className="hover cursor-pointer">
    <th className="text-black text-sm text-center">1</th>
    <th><div className='w-12 h-12 mx-auto'><Image src="/product1.webp" width={200} height={200} className='w-auto h-auto' alt="product image" /></div></th>
    <td className="text-black text-sm text-center">Product 1</td>
    <td className="text-black text-sm text-center">xs</td>
    <td>
      <button className="btn btn-xs bg-custom-yellow text-black border border-black hover:bg-black hover:text-custom-yellow text-sm">
        <FaHeartCrack />
        <span className='max-sm:hidden'>remove from the wishlist</span>
      </button>
    </td>
  </tr>
  )
}

export default WishItem