import React from 'react'
import HeaderTop from './HeaderTop'
import Image from 'next/image'
import SearchInput from './SearchInput'
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { FaCodeCompare } from "react-icons/fa6";


const Header = () => {
  return (
    <header>
        <HeaderTop />
        <div className='h-32 flex items-center justify-between px-16 max-[1320px]:px-10 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-52 max-w-screen-2xl mx-auto'>
          <Image src="/logo v1.png" width={200} height={200} alt="singitronic logo" />
          <SearchInput />
          <div className='flex gap-x-10'>
          <div className='relative'>
            <FaCodeCompare className='text-2xl text-black' />
            <span className='block w-5 h-5 bg-custom-yellow text-black rounded-full flex justify-center items-center absolute  top-[-10px] right-[-20px]'>21</span>
            </div>
            <div className='relative'>
            <FaHeart className='text-2xl text-black' />
            <span className='block w-5 h-5 bg-custom-yellow text-black rounded-full flex justify-center items-center absolute  top-[-10px] right-[-20px]'>2</span>
            </div>
            <div className='relative'>
            <FaCartShopping className='text-2xl text-black' />
            <span className='block w-5 h-5 bg-custom-yellow text-black rounded-full flex justify-center items-center absolute  top-[-10px] right-[-20px]'>2</span>
            </div>
          </div>
        </div>
    </header>
  )
}

export default Header