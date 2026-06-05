import { IoIosArrowDown, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import RecordingEntry from "../_components/RecordingEntry";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuAudioLines } from "react-icons/lu";
import CustomSelect from "../_components/Select";
import Filter from "../_components/Filter";
import { FaClock } from "react-icons/fa";
import { CiCalendar, CiClock2, CiUser } from "react-icons/ci";
import ProtectRoutes from "../_components/auth/ProtectRoutes";
// import { useSession } from "next-auth/react";
import { auth } from "@/auth";
import RecordingsTableController from "../_components/recordings/RecordingsTableController";
import RecordingsContainer from "../_components/recordings/RecordingsContainer";
import { Playfair_Display } from "next/font/google";
import { PiStudent, PiStudentBold } from "react-icons/pi";
import { redirect } from "next/navigation";
import Redirect from "../_components/auth/Redirect";

const font = Playfair_Display({
    subsets:['latin'],
    weight:['500','600','700']
})
async function Page({searchParams}) {
  const params = await searchParams;
  
  return (
    // <ProtectRoutes>
    <div className="w-full h-full flex flex-col px-2 py-2 gap-3">
      {/* <Redirect unauthorizedRole={["student", "teacher"]} /> */}
      <div className="self-end">
        <Filter />
      </div>

      <div>
        <div className="relative rounded-2xl w-full lg:pb-2">
          <div className="w-full rounded-lg overflow-hidden">
              <RecordingsContainer params={params} />
          </div>
        </div>
      </div>
    </div>
    // </ProtectRoutes>
  );
}

export default Page;
