import { incentives } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const Incentives = () => {
  return (
    <div>
      <h2 className='text-3xl text-center py-5'>Best Customer Benefits</h2>
    <div className="mx-auto max-w-screen-2xl py-10 sm:px-2 lg:px-4">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 px-4 lg:max-w-none lg:grid-cols-3">
        {incentives.map((incentive) => (
          <div key={incentive.name} className="text-center sm:flex sm:text-left lg:block lg:text-center">
            <div className="sm:flex-shrink-0">
              <div className="flow-root">
                <Image width={48} height={48} className="mx-auto" src={incentive.imageSrc} alt={incentive.name} />
              </div>
            </div>
            <div className="mt-3 sm:ml-3 sm:mt-0 lg:ml-0 lg:mt-3">
              <h3 className="text-sm font-medium text-gray-900">{incentive.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Incentives