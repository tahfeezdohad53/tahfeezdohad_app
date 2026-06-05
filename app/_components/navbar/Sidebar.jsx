'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsCalendar2X } from "react-icons/bs";
import { CiMicrophoneOn, CiUser } from "react-icons/ci"
import { FaBookOpen, FaMoneyBillWave } from "react-icons/fa";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { MdMeetingRoom } from "react-icons/md";

function Sidebar() {
    const pathname = usePathname();

    const linkStyle = (href) =>
      `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
        pathname === href
          ? "bg-(--bg-main) text-amber-800 font-medium"
          : "hover:bg-(--bg-main)/50"
      }`;
    return (
      <div className="fixed top-0 w-40 py-10 px-2 h-full bg-(--card) border border-(--border) lg:flex flex-col justify-between hidden">
        <div className="space-y-2">
          <Link href="/students" className={linkStyle("/students")}>
            <CiUser size={20} />
            <span>Students</span>
          </Link>

          <Link href="/recordings" className={linkStyle("/recordings")}>
            <CiMicrophoneOn size={20} />
            <span>Recordings</span>
          </Link>

          <Link href="/gurfah" className={linkStyle("/gurfah")}>
            <MdMeetingRoom size={20} />
            <span>Gurfah</span>
          </Link>

          <Link href="/maqarat" className={linkStyle("/maqarat")}>
            <FaBookOpen size={18} />
            <span>Maqarat</span>
          </Link>

          <Link href="/fees" className={linkStyle("/fees")}>
            <FaMoneyBillWave size={18} />
            <span>Fees</span>
          </Link>

          <Link href="/leaves" className={linkStyle("/leaves")}>
            <BsCalendar2X size={18} />
            <span>Leave</span>
          </Link>
        </div>
        <button className="h-fit py-2 text-white rounded-md justify-center bg-(image:--gradient-danger) flex items-center gap-2">
          <IoReturnUpBackOutline /> Logout
        </button>
      </div>
    );
}

export default Sidebar
