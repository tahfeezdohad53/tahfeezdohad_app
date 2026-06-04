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
      <Redirect unauthorizedRole={["student", "teacher"]} />
      {/* <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-(--card) shadow-(--shadow-md) rounded-md">
              <LuAudioLines className="text-xl text-(--primary)" />
            </div>
            <h1
              className={`${font.className} tracking-wide text-2xl font-bold text-(--text)`}
            >
              Recordings
            </h1>
          </div>
          <p className="text-xs text-(--text-secondary)">
            View all of your student recordings
          </p>
        </div> */}

      {/* {recordings.length < 1 && (
          <h1 className="absolute top-1/2 left-1/2 -translate-1/2 text-center font-bold tracking-wider w-3/4">
            you don&apos;t have any recordings yet!
          </h1>
        )} */}

      <div className="self-end">
        <Filter />
      </div>

      <div>
        <div className="relative rounded-2xl w-full bg-(--card)">
          <div className="w-full shadow border border-(--border) rounded-lg overflow-hidden">
            {/* {(params.startDate || params.student || params.teacher) &&
                recordings.length < 1 && (
                  <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-lg tracking-wider">
                    no results found!
                  </h1>
                )} */}
            <div className="py-4 px-3 w-full grid grid-cols-9 bg-(--bg-tertiary)/40 font-semibold">
              <div className="flex items-center gap-1 col-span-3 text-xs text-left">
                <CiCalendar className="text-sm" />
                Date
              </div>
              <div className="text-left">
                <CiClock2 />
              </div>
              <div className="flex items-center gap-1 col-span-2 text-[0.50rem] text-left">
                <CiUser className="text-sm" /> Student
              </div>
              <div className="flex items-center gap-1 col-span-2 text-[0.50rem] text-left">
                <PiStudent className="text-sm" /> Muhaffiz
              </div>
              <div className="text-[0.50rem] flex justify-center">Actions</div>
            </div>

            <div className="">
              <RecordingsContainer params={params} />
            </div>

            {/* <div className="space-y-2">
                {recordings.map((el, i) => (
                  <RecordingEntry key={el._id} el={el} i={i} />
                ))}
                {Array.from({ length: 10 - recordings.length }).map((el, i) => (
                  <RecordingEntry key={i} isDummy />
                ))}
                <RecordingsTableController totalRes={totalRes} />
              </div> */}
          </div>
        </div>
      </div>
    </div>
    // </ProtectRoutes>
  );
}

export default Page;
