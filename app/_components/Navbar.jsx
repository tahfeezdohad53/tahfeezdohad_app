'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci"
import { FaUser } from "react-icons/fa"
import { IoMdSettings } from "react-icons/io"
import { LuAudioWaveform } from "react-icons/lu"
import { PiStudentFill } from "react-icons/pi"
import { RxCross2 } from "react-icons/rx";

function Navbar() {
    const [isMenu,setIsMenu] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        setIsMenu(false);
    },[pathname]);
    return (
        <div className="z-999 relative bg-(--layer) h-[10%] shadow flex justify-between items-center px-5">
            {!isMenu && <CiMenuBurger className="text-xl" onClick={() => setIsMenu(true)}/>}
            {isMenu && <RxCross2 className="text-xl" onClick={() => setIsMenu(false)}/>}

            <h1 className="text-lg tracking-wider font-bold text-amber-900">Tahfeez Dohad</h1>
            <FaUser className="text-xl"/>
            <div className={`${!isMenu ? '-translate-y-5 pointer-events-none opacity-0':'opacity-100 pointer-events-auto translate-0'} duration-300 ease-in-out transition-all bg-(--layer) absolute p-5 border-t border-amber-200 shadow-lg h-50 w-full left-0 top-full flex flex-col gap-2`}>
            <Link href="/students" className={`${pathname.includes('students') && 'bg-(--background)'} tracking-wider flex items-center gap-3 py-2 px-5 rounded-md`}><PiStudentFill /> Students</Link>
            <Link href="/recordings" className={`${pathname.includes('recordings') && 'bg-(--background)'} tracking-wider flex items-center gap-3 py-2 px-5`}><LuAudioWaveform /> Recordings</Link>
            <Link href="/profile" className={`${pathname.includes('profile') && 'bg-(--background)'} tracking-wider flex items-center gap-3 py-2 px-5`}><IoMdSettings /> Profile</Link>
            </div>
        </div>
    )
}

export default Navbar
