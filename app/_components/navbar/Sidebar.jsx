'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsCalendar2X } from "react-icons/bs";
import { CiMicrophoneOn, CiUser } from "react-icons/ci"
import { FaBookOpen, FaMoneyBillWave } from "react-icons/fa";
import { IoBookOutline, IoReturnUpBackOutline } from "react-icons/io5";
import { MdMeetingRoom } from "react-icons/md";
import LogoutButton from "../auth/LogoutButton";
import { useUser } from "../providers/UserProvider";
import { PiDoorOpenLight } from "react-icons/pi";

function Sidebar() {
  const {user,isFetching} = useUser();
  const role = user?.role;
    const pathname = usePathname();
    const linkStyle = (href) =>
      `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
        pathname === href
        ? "bg-(--bg-main) text-amber-800 font-medium"
        : "hover:bg-(--bg-main)/50"
      }`;
      if(pathname.includes('auth')) return null;
      if(isFetching) return null;
    return (
      <div className="fixed top-0 w-40 p-5 px-2 h-full bg-(--card) border border-(--border) lg:flex flex-col hidden">
        <img src="/Dohad.png" alt="" className="w-full mx-auto"/>
       {user?._id && <div className="lg:flex flex-col justify-between mt-10 flex-1">
          <div className="space-y-2">
            {(user?.role === 'teacher' || user?.role === 'admin') && <Link href="/students" className={linkStyle("/students")}>
              <CiUser size={20} />
              <span>Students</span>
            </Link>}

            {user?.role === 'admin' && <Link href="/recordings" className={linkStyle("/recordings")}>
              <CiMicrophoneOn size={20} />
              <span>Recordings</span>
            </Link>}

            <Link href="/gurfah" className={linkStyle("/gurfah")}>
              <PiDoorOpenLight size={20} />
              <span>Gurfah</span>
            </Link>

            <Link href="/maqarat" className={linkStyle("/maqarat")}>
              <IoBookOutline size={18} />
              <span>Maqarat</span>
            </Link>

            {/* <Link href="/fees" className={linkStyle("/fees")}>
            <FaMoneyBillWave size={18} />
            <span>Fees</span>
          </Link> */}

            <Link href="/leave" className={linkStyle("/leave")}>
              <BsCalendar2X size={18} />
              <span>Leave</span>
            </Link>
          </div>
          <LogoutButton />
        </div>}
      </div>
    );
}

export default Sidebar
