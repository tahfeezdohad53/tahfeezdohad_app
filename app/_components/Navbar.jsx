'use client';
import { Cinzel, Playfair_Display, Sora } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci"
import { FaUser } from "react-icons/fa"
import { FaHouse } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io"
import { LuAudioWaveform } from "react-icons/lu"
import { PiStudentFill } from "react-icons/pi"
import { RxCross2 } from "react-icons/rx";
import { useUser } from "./providers/UserProvider";
const font = Cinzel({
    subsets:['latin'],
    weight:['500','600','700']
})
function Navbar() {
    const {user} = useUser();
    const [isMenu,setIsMenu] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        setIsMenu(false);
    },[pathname]);
    return (
        <div className={`z-999 relative min-h-[10%] borde border-(--border)/60 shadow-(--shadow-sm)  flex justify-between items-center px-5 ${pathname.includes('/auth') && 'hidden'}`}>
            {!isMenu && <CiMenuBurger className="text-xl" onClick={() => setIsMenu(true)}/>}
            {isMenu && <RxCross2 className="text-xl" onClick={() => setIsMenu(false)}/>}

            <h1 className={`text-lg tracking-wider font-extrabold text-(--text) ${font.className}`}>Tahfeez Dohad</h1>
            <FaUser className="text-xl"/>
            <div className={`${!isMenu ? '-translate-y-5 pointer-events-none opacity-0':'opacity-100 pointer-events-auto translate-0'} duration-300 ease-in-out transition-all bg-(--bg-main) absolute p-5 border-t border-(--border) shadow-lg  w-full left-0 top-full flex flex-col gap-2`}>
            {user?.role !== 'student' && <Link href="/students" className={`${(pathname.includes('students') || pathname.includes('entry')) && 'bg-(--bg-secondary)'} tracking-wider flex items-center gap-3 py-2 px-5 rounded-md`}><PiStudentFill /> Students</Link>}
            {user?.role === 'admin' && <Link href="/recordings" className={`${pathname.includes('recordings') && 'bg-(--bg-secondary)'} tracking-wider flex items-center gap-3 py-2 px-5`}><LuAudioWaveform /> Recordings</Link>}
            <Link href="/gurfah" className={`${pathname.includes('gurfah') && 'bg-(--bg-secondary)'} tracking-wider flex items-center gap-3 py-2 px-5`}><FaHouse /> Gurfah</Link>
            <Link href="/profile" className={`${pathname.includes('profile') && 'bg-(--bg-secondary)'} tracking-wider flex items-center gap-3 py-2 px-5`}><IoMdSettings /> Profile</Link>
            </div>
        </div>
    )
}

export default Navbar
