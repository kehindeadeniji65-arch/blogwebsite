"use client"
import React from 'react'
import Link from 'next/link'


export default function Main() {
  return (
    <div className='flex flex-col rlative justify-center items-center min-h-[40vh] rounded-bl-4xl rounded-br-4xl sm:min-h-90 px-4 py-8 bg-linear-to-r from-black via-cyan-350 to-cyan-300'>
      <p className='text-white text-4xl sm:text-3xl md:text-7xl font-bold'>STAY CURIOUS</p>
      <p className='flex text-center text-white p-2 font-bold text-[15px] sm:text-4xl md:text-[20px] w-full sm:w-[80%] md:w-[45%]'>Read the latest stories, insights, guides, and conversations covering topics worth exploring.</p>
      <Link
            href="/LatestPost"
            className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2.5 rounded-full mt-6 text-sm sm:text-base hover:bg-red-300"
          >
            Explore Posts <i className="fa-solid fa-arrow-right"></i>
          </Link>
    </div>
  )
}
