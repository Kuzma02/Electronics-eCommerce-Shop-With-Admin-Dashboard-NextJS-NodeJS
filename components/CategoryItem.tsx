import React, { type ReactNode } from 'react'

interface CategoryItemProps {
    children: ReactNode,
    title: string
}

const CategoryItem = ({ title, children } : CategoryItemProps) => {
  return (
    <div className='flex flex-col items-center gap-y-2 cursor-pointer'>
        { children }
        <h3>{ title }</h3>
    </div>
  )
}

export default CategoryItem