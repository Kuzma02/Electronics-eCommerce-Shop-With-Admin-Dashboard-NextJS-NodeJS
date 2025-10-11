// *********************
// Role of the component: Stock availability component for displaying current stock status of the product
// Name of the component: StockAvailabillity.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <StockAvailabillity stock={stock} inStock={inStock} />
// Input parameters: { stock: number, inStock: number }
// Output: styled text that displays current stock status on the single product page
// *********************

import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import { FaXmark } from "react-icons/fa6";


const StockAvailabillity = ({ stock, inStock } : { stock: number, inStock: number }) => {
  return (
    <p className='text-xl flex gap-x-2 max-[500px]:justify-center'>Availability: 
    { inStock === 1 ? <span className='text-success flex items-center gap-x-1'>In stock <FaCheck /></span> :  <span className='text-error flex items-center gap-x-1'>Out of stock <FaXmark /></span>}
    
    
    </p>
  )
}

export default StockAvailabillity