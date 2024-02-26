import React from 'react'

const UrgencyText = ({stock} : { stock: number }) => {
  return (
    <p className='text-success text-xl'>Hurry up! only <span className='badge badge-success text-white text-xl'>{stock}</span> products left in stock!</p>
  )
}

export default UrgencyText