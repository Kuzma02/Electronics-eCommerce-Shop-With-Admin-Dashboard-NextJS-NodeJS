"use client";
import React from 'react'
import NavbarSidebarLayout from '../../components/navbar-sidebar'

const AdminProductsPage = () => {
  return (
    <>
    <NavbarSidebarLayout>
        <div className='flex flex-col'>
            <div className='flex justify-between'>
                <h3>Product name</h3>
                <p>10$</p>
                <button>Delete product</button>
            </div>
        </div>
    </NavbarSidebarLayout>
    </>
  )
}

export default AdminProductsPage