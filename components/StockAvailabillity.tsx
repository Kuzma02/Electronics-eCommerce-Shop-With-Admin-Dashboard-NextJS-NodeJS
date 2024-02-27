import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import { FaXmark } from "react-icons/fa6";


const StockAvailabillity = ({ stock } : { stock: number }) => {
  return (
    <p className='text-xl flex gap-x-2 max-[500px]:justify-center'>Availability: 
    { stock > 0 ? <span className='text-success flex items-center gap-x-1'>In stock <FaCheck /></span> :  <span className='text-error flex items-center gap-x-1'>Out of stock <FaXmark /></span>}
    
    
    </p>
  )
}

export default StockAvailabillity