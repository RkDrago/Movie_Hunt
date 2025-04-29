'use client';
import React, { useEffect, useState, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getGuestWatchlist, saveToGuestWatchlist, isMovieInGuestWatchlist } from '../utils/localStorage';
import { genreContext } from '@/context/context';
import LikeButton from './LikeButton';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Center = ({ guestMovies, setGuestMovies, MovieInfoId }) => {
    const router = useRouter()
    const pathname = usePathname();
    const [newMovies, setNewMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [randomMovies, setRandomMovies] = useState([]);
    const [infoMovie, setInfoMovie] = useState([]);

    const { filteredMovies } = useContext(genreContext)
    const { allMovies } = useContext(genreContext)


    useEffect(() => {

        window.scrollTo(0, 0);

        const fetchAllMovieData = async () => {
            try {
                const [newRes, popularRes, randomRes] = await Promise.all([
                    fetch('/api/movies'),
                    fetch('/api/movies/Popular'),
                    fetch('/api/movies/random')
                ]);

                const [newData, popularData, randomData] = await Promise.all([
                    newRes.json(),
                    popularRes.json(),
                    randomRes.json()
                ]);

                setNewMovies(newData.response);
                setPopularMovies(popularData.response);
                setRandomMovies(randomData.response);
            } catch (err) {
                console.error("Error fetching movies:", err);
            }
        };

        fetchAllMovieData();

        // Get guest watchlist from localStorage
        const movies = getGuestWatchlist();
        setGuestMovies(movies);

    }, [setGuestMovies]);

    const handleAddAndRemove = (movie) => {
        const currentList = getGuestWatchlist();
        const isInWatchlist = isMovieInGuestWatchlist(movie._id);

        let updatedList;

        if (isInWatchlist) {
            updatedList = currentList.filter((m) => m._id !== movie._id);
        } else {
            updatedList = [...currentList, movie];
        }

        saveToGuestWatchlist(updatedList);
        setGuestMovies(updatedList); // ✅ Update state to trigger re-render
    };

    useEffect(() => {
        if (MovieInfoId && Array.isArray(allMovies) && allMovies.length > 0) {
            const findMovieById = (id, allMovies) => {
                const found = allMovies.find(movie => movie._id === id)
                setInfoMovie(found)
            }

            findMovieById(MovieInfoId, allMovies)
        }

    }, [MovieInfoId, allMovies])


    return (
        <>
            <div className="min-h-[clamp(100vh, 200svh, 250vh)] px-2">
                <div className={`xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 ${pathname === '/' ? "grid" : "hidden"}`}>
                    {Array.isArray(newMovies) && newMovies.map((movie, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            key={idx}
                            className="h-[clamp(180px, 12vw, 280px)] w-[clamp(140px, 9vw, 220px)] mx-auto rounded-xl my-2 relative overflow-hidden"
                        >
                            <Image src={movie.image} alt="" className="w-full h-full object-cover" loading="lazy" width="300" height="450" />
                            <div className="h-full w-full hover:bg-[#0000005f] absolute top-0 text-white text-sm group">
                                <div className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5 absolute left-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="ipc-icon ipc-icon--star sc-d541859f-4 LNYqq" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                                    <h3>{movie.rating}</h3>
                                </div>
                                <div className="flex flex-col gap-1 p-2 w-[clamp(15%, 25%, 30%)] absolute transition-transform duration-200 ease-in-out transform lg:-translate-y-full group-hover:translate-y-0 top-0 right-0">
                                    <button title='Movie info' onClick={() => router.push(`/search-palette/${movie._id}`)} className="infobtn flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ffffff39] cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="20" height="20" data-icon="ChevronDownStandard" aria-hidden="true">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <button title={guestMovies.some((m) => m._id === movie._id) ? "Remove from collection" : "Add to collection"} onClick={(e) => { handleAddAndRemove(movie) }} className="cursor-pointer flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ff000041]">
                                        <Image width={20} height={18} src={guestMovies.some((m) => m._id === movie._id) ? "/icons/collection3.png" : "/icons/collection2.png"} alt='' />
                                    </button>
                                </div>
                                <div className="h-[clamp(15%, 22%, 30%)] absolute bottom-0 w-full flex flex-col items-center bg-gradient-to-t from-black to-transparent">
                                    <span className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" color="white" fill="none">
                                            <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 8H21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                    </span>
                                    <h3 className="max-h-[clamp(40%, 62%, 70%)] py-1 px-2.5 text-center text-[clamp(10px, 13px, 16px)] leading-[1.1rem] line-clamp-2 !font-bold">
                                        {movie.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className={`${pathname === '/search-palette' ? "block" : "hidden"}`}>
                    <div className="w-full h-[120px] bg-yellow-100"></div>
                </div>
                {filteredMovies.length === 0
                    ? <p className={`text-gray-500 text-sm p-5 ${pathname === '/search-palette' ? "block" : "hidden"}`}>Sorry, We don&apos;t have any match for your search!</p>
                    : (<div className={`xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 pt-2 ${pathname === '/search-palette' ? "grid" : "hidden"}`}>
                        {filteredMovies.map((movie, idx) => (
                            <div
                                key={idx}
                                className="h-[clamp(180px, 12vw, 280px)] w-[clamp(140px, 9vw, 220px)] mx-auto rounded-xl my-2 relative overflow-hidden"
                            >
                                <Image src={movie.image} alt="" className="w-full h-full object-cover" loading="lazy" width="300" height="450" />
                                <div className="h-full w-full hover:bg-[#0000005f] absolute top-0 text-white text-sm group">
                                    <div className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5 absolute left-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="ipc-icon ipc-icon--star sc-d541859f-4 LNYqq" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                                        <h3>{movie.rating}</h3>
                                    </div>
                                    <div className="flex flex-col gap-1 p-2 w-[clamp(15%, 25%, 30%)] absolute transition-transform duration-200 ease-in-out transform lg:-translate-y-full group-hover:translate-y-0 top-0 right-0">
                                        <button title='Movie info' onClick={() => router.push(`/search-palette/${movie._id}`)} className="flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ffffff39] cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="20" height="20" data-icon="ChevronDownStandard" aria-hidden="true">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path>
                                            </svg>
                                        </button>
                                        <button title={guestMovies.some((m) => m._id === movie._id) ? "Remove from collection" : "Add to collection"} onClick={(e) => { handleAddAndRemove(movie) }} className="cursor-pointer flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ff000041]">
                                            <Image width={20} height={18} src={guestMovies.some((m) => m._id === movie._id) ? "/icons/collection3.png" : "/icons/collection2.png"} alt='' />
                                        </button>
                                    </div>
                                    <div className="h-[clamp(15%, 22%, 30%)] absolute bottom-0 w-full flex flex-col items-center bg-gradient-to-t from-black to-transparent">
                                        <span className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" color="white" fill="none">
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                        </span>
                                        <h3 className="max-h-[clamp(40%, 62%, 70%)] py-1 px-2.5 text-center text-[clamp(10px, 13px, 16px)] leading-[1.1rem] line-clamp-2 !font-bold">
                                            {movie.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)
                }

                <div className={`xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 ${pathname === '/popular' ? "grid" : "hidden"}`}>
                    {Array.isArray(popularMovies) && popularMovies.map((movie, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            key={idx}
                            className="h-[clamp(180px, 12vw, 280px)] w-[clamp(140px, 9vw, 220px)] mx-auto rounded-xl my-2 relative overflow-hidden"
                        >
                            <Image src={movie.image} alt="" className="w-full h-full object-cover" loading="lazy" width="300" height="450" />
                            <div className="h-full w-full hover:bg-[#0000005f] absolute top-0 text-white text-sm group">
                                <div className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5 absolute left-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="ipc-icon ipc-icon--star sc-d541859f-4 LNYqq" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                                    <h3>{movie.rating}</h3>
                                </div>
                                <div className="flex flex-col gap-1 p-2 w-[clamp(15%, 25%, 30%)] absolute transition-transform duration-200 ease-in-out transform lg:-translate-y-full group-hover:translate-y-0 top-0 right-0">
                                    <button title='Movie info' onClick={() => router.push(`/search-palette/${movie._id}`)} className="flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ffffff39] cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="20" height="20" data-icon="ChevronDownStandard" aria-hidden="true">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <button title={guestMovies.some((m) => m._id === movie._id) ? "Remove from collection" : "Add to collection"} onClick={(e) => { handleAddAndRemove(movie) }} className="cursor-pointer flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ff000041]">
                                        <Image width={20} height={18} src={guestMovies.some((m) => m._id === movie._id) ? "/icons/collection3.png" : "/icons/collection2.png"} alt='' />
                                    </button>
                                </div>
                                <div className="h-[clamp(15%, 22%, 30%)] absolute bottom-0 w-full flex flex-col items-center bg-gradient-to-t from-black to-transparent">
                                    <span className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" color="white" fill="none">
                                            <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 8H21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                    </span>
                                    <h3 className="max-h-[clamp(40%, 62%, 70%)] py-1 px-2.5 text-center text-[clamp(10px, 13px, 16px)] leading-[1.1rem] line-clamp-2 !font-bold">
                                        {movie.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className={`${pathname === '/random' ? "block" : "hidden"}`}>
                    <div className="w-full h-[120px] bg-yellow-100"></div>
                    <div className="w-full flex py-2 items-center">
                        <h3 className='text-xl'>Here come 10 random flicks for your watchlist!</h3>
                    </div>
                    <div className='h-[1px] w-full bg-gradient-to-r from-transparent via-[#3a3a3aae] to-transparent opacity-40'></div>
                </div>
                <div className={`xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 ${pathname === '/random' ? "grid" : "hidden"}`}>
                    {Array.isArray(randomMovies) && randomMovies.map((movie, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            key={idx}
                            className="h-[clamp(180px, 12vw, 280px)] w-[clamp(140px, 9vw, 220px)] mx-auto rounded-xl my-2 relative overflow-hidden"
                        >
                            <Image src={movie.image} alt="" className="w-full h-full object-cover" loading="lazy" width="300" height="450" />
                            <div className="h-full w-full hover:bg-[#0000005f] absolute top-0 text-white text-sm group">
                                <div className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5 absolute left-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="ipc-icon ipc-icon--star sc-d541859f-4 LNYqq" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                                    <h3>{movie.rating}</h3>
                                </div>
                                <div className="flex flex-col gap-1 p-2 w-[clamp(15%, 25%, 30%)] absolute transition-transform duration-200 ease-in-out transform lg:-translate-y-full group-hover:translate-y-0 top-0 right-0">
                                    <button title='Movie info' onClick={() => router.push(`/search-palette/${movie._id}`)} className="flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ffffff39] cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="20" height="20" data-icon="ChevronDownStandard" aria-hidden="true">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <button title={guestMovies.some((m) => m._id === movie._id) ? "Remove from collection" : "Add to collection"} onClick={(e) => { handleAddAndRemove(movie) }} className="cursor-pointer flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ff000041]">
                                        <Image width={20} height={18} src={guestMovies.some((m) => m._id === movie._id) ? "/icons/collection3.png" : "/icons/collection2.png"} alt='' />
                                    </button>
                                </div>
                                <div className="h-[clamp(15%, 22%, 30%)] absolute bottom-0 w-full flex flex-col items-center bg-gradient-to-t from-black to-transparent">
                                    <span className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" color="white" fill="none">
                                            <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 8H21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                    </span>
                                    <h3 className="max-h-[clamp(40%, 62%, 70%)] py-1 px-2.5 text-center text-[clamp(10px, 13px, 16px)] leading-[1.1rem] line-clamp-2 !font-bold">
                                        {movie.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className={`${pathname === '/collection' ? "block" : "hidden"}`}>
                    <div className="w-full h-[120px] bg-yellow-100"></div>
                    <div className="w-full flex justify-between py-2 items-center">
                        <h3 className='text-xl'>My collection</h3>
                        <h4 className='text-[13px] text-gray-500'>{guestMovies.length} Tile</h4>
                    </div>
                    <div className='h-[1px] w-full bg-gradient-to-r from-transparent via-[#3a3a3aae] to-transparent opacity-40'></div>
                </div>
                {guestMovies.length === 0
                    ? <p className={`text-gray-500 text-sm p-5 ${pathname === '/collection' ? "block" : "hidden"}`}>You don&apos;t have any collections yet..</p>
                    : (<div className={`xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 ${pathname === '/collection' ? "grid" : "hidden"}`}>
                        {guestMovies.map((movie, idx) => (
                            <div
                                key={idx}
                                className="h-[clamp(180px, 12vw, 280px)] w-[clamp(140px, 9vw, 220px)] mx-auto rounded-xl my-2 relative overflow-hidden"
                            >
                                <Image src={movie.image} alt="" className="w-full h-full object-cover" loading="lazy" width="300" height="450" />
                                <div className="h-full w-full hover:bg-[#0000005f] absolute top-0 text-white text-sm group">
                                    <div className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5 absolute left-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="ipc-icon ipc-icon--star sc-d541859f-4 LNYqq" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                                        <h3>{movie.rating}</h3>
                                    </div>
                                    <div className="flex flex-col gap-1 p-2 w-[clamp(15%, 25%, 30%)] absolute transition-transform duration-200 ease-in-out transform lg:-translate-y-full group-hover:translate-y-0 top-0 right-0">
                                        <button title='Movie info' onClick={() => router.push(`/search-palette/${movie._id}`)} className="flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ffffff39] cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="20" height="20" data-icon="ChevronDownStandard" aria-hidden="true">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path>
                                            </svg>
                                        </button>
                                        <button title={guestMovies.some((m) => m._id === movie._id) ? "Remove from collection" : "Add to collection"} onClick={(e) => { handleAddAndRemove(movie) }} className="cursor-pointer flex justify-center items-center h-7 w-7 rounded-full bg-[#05050566] hover:bg-[#ff000041]">
                                            <Image width={20} height={18} src={guestMovies.some((m) => m._id === movie._id) ? "/icons/collection3.png" : "/icons/collection2.png"} alt='' />
                                        </button>
                                    </div>
                                    <div className="h-[clamp(15%, 22%, 30%)] absolute bottom-0 w-full flex flex-col items-center bg-gradient-to-t from-black to-transparent">
                                        <span className="flex gap-1 items-center bg-[#111111b5] text-xs !font-bold rounded px-1.5 py-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" color="white" fill="none">
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                        </span>
                                        <h3 className="max-h-[clamp(40%, 62%, 70%)] py-1 px-2.5 text-center text-[clamp(10px, 13px, 16px)] leading-[1.1rem] line-clamp-2 !font-bold">
                                            {movie.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)
                }
                <div className={`${pathname === `/search-palette/${infoMovie._id}` ? "block" : "hidden"}`}>
                    <div className="w-full h-[120px] bg-yellow-100"></div>
                </div>
                {infoMovie.length === 0
                    ? <p className={`text-gray-500 text-sm p-5 ${pathname === `/search-palette/${infoMovie._id}` ? "block" : "hidden"}`}>Sorry, We don&apos;t have any data for this!</p>
                    : (<div className={`p-2 mt-12 items-center ${pathname === `/search-palette/${infoMovie._id}` ? "flex flex-col" : "hidden"}`}>
                        <div
                            className="my-3 p-2 rounded-3xl bg bg-[#58585824] border-8 border-[#5858583d]"
                        >
                            <div className="mx-auto rounded-xl relative overflow-hidden">
                                <Image src={infoMovie.image} alt={infoMovie.title} className="h-auto object-cover" loading="lazy" width="300" height="450" />
                                <div className="h-full w-full hover:bg-[#0000005f] absolute top-0 text-white text-sm group">
                                </div>
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="my-1 pt-1.5 min-w-[300px] h-[40px] relative"
                        >
                            <div className='h-px w-full bg-[#3a3a3ac8] opacity-40 absolute top-0'></div>
                            <div className="flex px-3 h-full w-full justify-between">
                                <div className="flex gap-4">
                                    <button title={guestMovies.some((m) => m._id === infoMovie._id) ? "Remove from collection" : "Add to collection"} onClick={(e) => { handleAddAndRemove(infoMovie) }} className="border border-[#58585878] bg-[#bebebe20] cursor-pointer flex justify-center items-center h-full px-2.5 rounded-full hover:bg-[#bebebe62]">
                                        <Image width={20} height={18} src={guestMovies.some((m) => m._id === infoMovie._id) ? "/icons/collection3.png" : "/icons/collection0.png"} alt='' />
                                    </button>
                                    <LikeButton movieId={infoMovie._id} />
                                </div>
                                <span className="flex gap-1 items-center text-xs !font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" color="black" fill="none">
                                        <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 8H21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {new Date(infoMovie.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </motion.div>
                        <div className="my-4 px-10 min-w-[300px] flex flex-col items-center">
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="py-5 px-2.5 text-center text-[clamp(24px,5vw,50px)] underline underline-offset-4 styled-font"
                            >
                                {infoMovie.title}
                            </motion.h3>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="ipc-icon ipc-icon--star sc-d541859f-4 LNYqq" viewBox="0 0 24 24" fill="#111" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                                <h3 className='text-center styled-font text-gray-500'>
                                    IMDb Rating: <span className="text-[#111]">{infoMovie.rating}</span>
                                </h3>
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className='text-center styled-font flex gap-1 text-gray-500 text-nowrap'>
                                Directed By :
                                <p className='text-[#111] styled-font text-balance'>{infoMovie.director}</p>
                            </motion.h3>
                            <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className='text-center styled-font flex gap-1 text-gray-500 text-nowrap'>
                                Cast :
                                <p className="text-[#111] styled-font text-wrap">
                                    {infoMovie.cast?.slice(0, 6).join(', ')}
                                </p>
                            </motion.h3>
                            <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className='text-center styled-font flex gap-1 text-gray-500 text-nowrap'>
                                Genres :
                                <p className='text-[#111] styled-font text-wrap'>
                                    {infoMovie.genre?.slice(0, 4).join(', ')}
                                </p>
                            </motion.h3>
                            <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className='text-center max-w-[600px] text-xl styled-font py-14'>{infoMovie.description}</motion.p>
                        </div>
                    </div>)
                }
            </div>

        </>
    )
}

export default Center
