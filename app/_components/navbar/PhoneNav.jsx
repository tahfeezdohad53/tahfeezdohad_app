'use client';
import Link from "next/link";
import { usePathname } from "next/navigation"
import { AiOutlineHome } from "react-icons/ai"
import { CiMicrophoneOn, CiUser } from "react-icons/ci"
import { FaMoneyCheck, FaUser } from "react-icons/fa"
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5"
import { useUser } from "../providers/UserProvider";
import { Cinzel } from "next/font/google";


function PhoneNav() {
    const pathname = usePathname();
    const {user,isFetching} = useUser();
    const role = user?.role;
    if(pathname.includes('auth') || pathname.includes('entry') || pathname.includes('onlineclass')) return null;
    if(isFetching) return null;
    if(!user.role) return null;
    return (
      <div className="overflow-x-auto lg:hidden fixed bottom-0 left-0 flex items-center gap-8 w-full px-3 h-15 border-t border-(--border) bg-(--card) shadow-(--shadow-lg)">
        {(role === 'admin'||role ==='teacher') && <Link href={'/students'}
          className={`p-2 flex flex-col items-center gap-1 ${pathname.includes("students") && " bg-(--card-hover) shadow-(--shadow-sm) rounded-md font-bold text-(--primary)"}`}
        >
          <CiUser className="" />
          <p className={`text-[0.60rem] ${!pathname.includes('students') && 'text-gray-500'}`}>Students</p>
        </Link>}
        {role === 'admin' && <Link href={'/recordings'} className={`p-2 flex flex-col items-center gap-1 ${pathname.includes("recordings") && " bg-(--card-hover) shadow-(--shadow-sm) rounded-md font-bold text-(--primary)"}`}>
          <CiMicrophoneOn />
          <p className={`text-[0.60rem] ${!pathname.includes('recordings') && 'text-gray-500'}`}>Recordings</p>
        </Link>}
        <Link href={'/gurfah'} className={`p-2 flex flex-col items-center gap-1 ${(pathname.includes("gurfah") || pathname.includes('onlineclass')) && " bg-(--card-hover) shadow-(--shadow-sm) rounded-md font-bold text-(--primary)"}`}>
          <AiOutlineHome />
          <p className={`text-[0.60rem] ${(!pathname.includes('gurfah') || pathname.includes('onlineclass')) && 'text-gray-500'}`}>Gurfah</p>
        </Link>
        <Link href={'/leave'} className={`p-2 flex flex-col items-center gap-1 ${pathname.includes("leave") && " bg-(--card-hover) shadow-(--shadow-sm) rounded-md font-bold text-(--primary)"}`}>
          <IoCalendarOutline />
          <p className={`text-[0.60rem] ${!pathname.includes('leave') && 'text-gray-500'}`}>leaves</p>
        </Link>
        <Link href={'/maqarat'} className={`p-2 flex flex-col items-center gap-1 ${pathname.includes("maqarat") && " bg-(--card-hover) shadow-(--shadow-sm) rounded-md font-bold text-(--primary)"}`}>
          <IoBookOutline />
          <p className={`text-[0.60rem] ${!pathname.includes('maqaraat') && 'text-gray-500'}`}>Maqaarat</p>
        </Link>
        <Link href={'/profile'} className={`p-2 flex flex-col items-center gap-1 ${pathname.includes("profile") && " bg-(--card-hover) shadow-(--shadow-sm) rounded-md font-bold text-(--primary)"}`}>
          <CiUser />
          <p className={`text-[0.60rem] ${!pathname.includes('profile') && 'text-gray-500'}`}>Profile</p>
        </Link>
        {/* {(role === 'admin'||role === 'students') && <Link href={'/fees'} className={`p-2 flex flex-col items-center gap-1 ${pathname.includes("fees") && " bg-(--card-hover) shadow-lg rounded-md font-bold text-(--primary)"}`}>
          <FaMoneyCheck />
          <p className={`text-[0.60rem] ${!pathname.includes('fees') && 'text-gray-500'}`}>Fees</p>
        </Link>} */}
      </div>
    );
}

export default PhoneNav
