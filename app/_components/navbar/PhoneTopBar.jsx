"use client";
import { Cinzel, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { LuAudioLines } from "react-icons/lu";
import { useUser } from "../providers/UserProvider";

const font = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const font2 = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
function PhoneTopBar() {
  const {user} = useUser();
  const pathname = usePathname();
  let heading;
  let subHeading;
  if (pathname.includes("recordings")) {
    heading = "Recordings";
    subHeading = "View all of your student recordings";
  }
  if (pathname.includes("gurfah")) {
    heading = "Gurfah";
    subHeading = "a room for online classes";
  }
  if (pathname.includes("onlineclass")) {
    heading = "Gurfah";
    subHeading = "a room for online classes";
  }
  if (pathname.includes("maqarat")) {
    heading = "Maqarat Sessions";
    if(user?.role === 'admin')subHeading = "Create & Manage Maqarat Sessions";
    if(user?.role !== 'admin')subHeading = "View Your Maqarat Sessions";
  }
  if (pathname.includes("auth")) return null;
  if (pathname.includes("students"))
    return (
      <div
        className={`flex lg:hidden justify-between items-center p-3 text-lg border-b border-gray-200`}
      >
        <div>
          <h1 className={`text-xl ${font.className} font-semibold`}>
            Tahfeez Dohad
          </h1>
          <p className="text-xs text-gray-500">
            Learn. Memorize. Grow With Us.
          </p>
        </div>
        <Link
          href={"/profile"}
          className="p-3 rounded-full bg-(--bg-tertiary)/50"
        >
          <FaUser className="text-amber-900" />
        </Link>
      </div>
    );
  return (
    <div className="flex items-center justify-between py-5 px-2 border-b border-(--border) mb-5">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-md bg-(--bg-tertiary)/50 w-fit">
          {pathname.includes("recordings") && (
            <LuAudioLines className="text-xl text-(--primary)" />
          )}
          {pathname.includes("gurfah") && (
            <FaHouse className="text-xl text-(--primary)" />
          )}
          {pathname.includes("onlineclass") && (
            <FaHouse className="text-xl text-(--primary)" />
          )}
          {pathname.includes("maqarat") && (
            <FaUserFriends className="text-xl text-(--primary)" />
          )}
        </div>
        <div>
          <h1 className="font-bold">{heading}</h1>
          <p className="text-xs text-gray-500">{subHeading}</p>
        </div>
      </div>
      <Link
        href={"/profile"}
        className="p-3 rounded-full bg-(--bg-tertiary)/50"
      >
        <FaUser className="text-amber-900" />
      </Link>
    </div>
  );
}

export default PhoneTopBar;
