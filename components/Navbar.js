"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { genreContext } from "@/context/context";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");

    const { allMovies } = useContext(genreContext)
    const { selectedGenres, setSelectedGenres } = useContext(genreContext)
    const { setFilteredMovies } = useContext(genreContext)

    const navdropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const tarnRef = useRef(null);

    const router = useRouter()


    const categories = [
        "action", "adventure", "animation", "biography", "comedy", "crime",
        "documentary", "drama", "fantasy", "family", "history", "horror",
        "kids", "music", "mystery", "news", "reality", "romance",
        "sci-fi", "soap", "talk show", "thriller", "tv movie", "war",
        "war & politics", "western"
    ]

    const years = Array.from({ length: 26 }, (_, i) => 2000 + i); // Generates years from 2000 to 2025

    // Handles closing both dropdowns when clicking outside
    useEffect(() => {

        function handleClickOutside(event) {
            // Close search dropdown only if clicked outside both input & option_tab
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsFocused(false);
            }

            // Close nav dropdown only if clicked outside both button & menu
            if (
                navdropdownRef.current &&
                !navdropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleWheelScroll = (event) => {
            if (tarnRef.current) {
                event.preventDefault(); // Prevent vertical scroll interference
                tarnRef.current.scrollLeft += event.deltaY; // Move horizontally based on wheel scroll
            }
        };

        const tarnElement = tarnRef.current;
        if (tarnElement) {
            tarnElement.addEventListener("wheel", handleWheelScroll);
        }

        return () => {
            if (tarnElement) {
                tarnElement.removeEventListener("wheel", handleWheelScroll);
            }
        };
    }, []);

    const toggleGenre = (genre) => {
        setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    };


    useEffect(() => {
        if (!Array.isArray(allMovies)) return;

        const filtered = allMovies.filter((movie) => {
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesGenre =
                selectedGenres.length === 0 ||
                selectedGenres.every((genre) =>
                    Array.isArray(movie.genre) && movie.genre.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
                );

            const matchesYear =
                !selectedYear || new Date(movie.releaseDate).getFullYear().toString() === selectedYear.toString();

            return matchesSearch && matchesGenre && matchesYear;
        });

        setFilteredMovies(filtered);

    }, [allMovies, selectedGenres, selectedYear, searchQuery, setFilteredMovies]);

    return (

        <>
            <nav className="sticky top-0 z-10 bg-white">
                <div className="flex justify-between items-center max-w-[1536px] mx-auto">
                    {/* Logo */}
                    <div className="flex h-[65px] sm:w-[200px] pl-3">
                        <Link href={"/"} className="flex items-center">
                            <Image priority width={48} height={48} className="size-12 font-serif" src="/imgs/logo.png" alt="" />
                            <span className="font-serif text-[20px] inter sm:block hidden">
                                Movie Hunt
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="h-[65px] flex items-center md:w-[62%] w-[75%] px-3" ref={dropdownRef}>
                        <div className={`flex w-full h-[36px] rounded-full border-[0.5px] border-[#7f7f7f92] items-center relative`}>
                            <div ref={tarnRef} className="flex items-center h-full max-w-[50%] mr-2 rounded-l-full whitespace-nowrap overflow-x-auto scrollbar-hide smooth-scroll">
                                {selectedYear && (
                                    <div onClick={() => setSelectedYear("")} className="capitalize h-7 mx-1 bg-[#97979722] items-center rounded-full text-xs text-nowrap shadow-xs cursor-pointer inline-flex">
                                        <div className="rounded-l-full border-r border-[#97979760] px-3 no-select">{selectedYear}</div>
                                        <div className="rounded-r-full px-2 no-select">✕</div>
                                    </div>
                                )}
                                {selectedGenres.map((genre, index) => (
                                    <div key={index} onClick={() => toggleGenre(genre)} className="capitalize h-7 mx-1 bg-[#97979722] items-center rounded-full text-xs text-nowrap shadow-xs cursor-pointer inline-flex">
                                        <div className="rounded-l-full border-r border-[#97979760] px-3 no-select">{genre}</div>
                                        <div className="rounded-r-full px-2 no-select">✕</div>
                                    </div>
                                ))}
                            </div>
                            <input className="focus:outline-none z-10 rounded-full px-3 h-full w-full sm:text-sm text-[13px]" placeholder="Search movies" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => { setIsFocused(true); router.push('/search-palette') }} />
                            <svg className={`size-5 m-3 absolute right-0 transition-all duration-200 ${isFocused ? "opacity-10" : "opacity-80"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#333333" fill="none">
                                <path d="M17 17L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            {/* Option Tab - Only hidden if clicked outside */}
                            <div className={`option_tab w-[110%] sm:w-full min-h-[40svh] bg-[#ffffffe3] backdrop-blur-2xl shadow-md absolute left-0 top-[145%] z-10 rounded-b-2xl flex flex-col border border-[#9797975a] border-t-0 transition-all duration-200 ${isFocused ? "block" : "hidden"}`}>
                                <div className="h-[45%] w-[98%] mx-auto rounded-2xl p-4 overflow-hidden">
                                    <h3 className="text-sm font-medium tracking-wide mb-1.5">
                                        Genre
                                    </h3>
                                    <ul className="w-full">
                                        {categories.map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => toggleGenre(category)}
                                                className={`capitalize px-3 h-7 m-0.5 items-center rounded-full text-xs text-nowrap inline-flex shadow-xs border border-[#97979736] no-select ${selectedGenres.includes(category) ? "bg-[#717171cf] text-white" : "bg-white text-black"}`}>
                                                {category}
                                            </button>
                                        ))}
                                    </ul>
                                </div>
                                <div className='h-[1px] w-full bg-gradient-to-r from-transparent via-[#01010189] to-transparent opacity-30'></div>
                                <div className="h-[45%] w-[98%] mx-auto rounded-2xl p-4 overflow-hidden">
                                    <h3 className="text-sm font-medium tracking-wide mb-1.5">
                                        By Year
                                    </h3>
                                    <ul className="w-full">
                                        {years.map((year, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedYear(year)}
                                                className={`px-3 h-7 m-0.5 items-center rounded-full text-xs text-nowrap inline-flex shadow-xs border border-[#97979736] no-select ${selectedYear === year ? "bg-[#717171cf] text-white" : "bg-white text-black"}`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* More Options Dropdown */}
                    <div className="flex items-center md:px-4 px-2 justify-end lg:w-[330px] relative" ref={navdropdownRef}>
                        <div className={`flex p-3 rounded-full hover:bg-[#bebebe39] ${isOpen && "bg-[#bebebe5e] opacity-100"} opacity-70 cursor-pointer`}
                            onClick={() => setIsOpen(!isOpen)}
                            ref={buttonRef}
                        >
                            <Image priority width={20} height={20} src={isOpen ? "/icons/more1.png" : "/icons/more0.png"} alt="More" />
                        </div>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute right-3.5 top-[55px] border-[1px] border-[#7272726a] mt-2 w-36 bg-white shadow-md rounded-lg p-2 z-50">
                                <Link href={"/search-palette"} className="block w-full text-left capitalize px-3 py-2 text-xs hover:bg-[#bebebe39] opacity-70 rounded-xl" onClick={() => { setIsOpen(false); setIsFocused(true) }}>
                                    Search palette
                                </Link>
                                <Link href={"/about"} className="block w-full text-left capitalize px-3 py-2 text-xs hover:bg-[#bebebe39] opacity-70 rounded-xl" onClick={() => setIsOpen(false)}>
                                    About
                                </Link>
                                <a href="https://www.instagram.com/" className="block w-full text-left capitalize px-3 py-2 text-xs hover:bg-[#bebebe39] opacity-70 rounded-xl" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                                    Instagram
                                </a>
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3a3a3aae] to-transparent opacity-40"></div>
                                <Link href={"/terms"} className="block w-full text-left capitalize px-3 py-2 text-xs hover:bg-[#bebebe39] opacity-70 rounded-xl" onClick={() => setIsOpen(false)}>
                                    Terms of Service
                                </Link>
                                <Link href={"/privacy"} className="block w-full text-left capitalize px-3 py-2 text-xs hover:bg-[#bebebe39] opacity-70 rounded-xl" onClick={() => setIsOpen(false)}>
                                    Privacy Policy
                                </Link>
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3a3a3aae] to-transparent opacity-40"></div>
                                <a href='https://www.monkeytype.com' className='block w-full text-left px-3 py-2 text-xs hover:bg-[#bebebe39] text-[#6060609d] rounded-xl' onClick={() => setIsOpen(false)}>
                                    Made by Rudra
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3a3a3aae] to-transparent opacity-40 absolute bottom-0"></div>
            </nav>
        </>

    );
};

export default Navbar;

