"use client"
import React, { useState } from 'react'
import Basebar from "@/components/Basebar";
import Center from "@/components/Center";
import Right from "@/components/Right";
import Sidemenubar from "@/components/Sidemenubar";

const WholePage = ({ MovieInfoId }) => {
  const [guestMovies, setGuestMovies] = useState([]);

  return (
    <>
      <div className="max-w-[1536px] mx-auto">
        <div className="flex lg:justify-between relative">
          <Basebar />
          {/* Left Sidebar */}
          <div className="sm:block hidden w-[200px] h-[calc(100svh-65px)] sticky top-[65px] overflow-hidden group">
            <Sidemenubar />
            <div className="z-10 h-[20%] w-full sticky bottom-0 bg-gradient-to-t from-[#fff] group-hover:hidden"></div>
          </div>
          {/* Center Content */}
          <div className="flex-1 min-h-[100svh] pb-19 px-3 overflow-hidden">
            <Center guestMovies={guestMovies} setGuestMovies={setGuestMovies} MovieInfoId={MovieInfoId} />
          </div>
          {/* Right Sidebar */}
          <div className="w-[330px] h-[calc(100svh-65px)] sticky top-[65px] overflow-hidden px-2 lg:block hidden">
            <Right guestMovies={guestMovies} setGuestMovies={setGuestMovies} />
          </div>
        </div>
      </div>
    </>

  )
}

export default WholePage
