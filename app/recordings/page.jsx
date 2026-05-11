import { IoIosArrowDown, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import RecordingEntry from "../_components/RecordingEntry";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuAudioLines } from "react-icons/lu";
import CustomSelect from "../_components/Select";
import Filter from "../_components/Filter";
import { FaClock } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import ProtectRoutes from "../_components/auth/ProtectRoutes";
// import { useSession } from "next-auth/react";
import { auth } from "@/auth";
import RecordingsTableController from "../_components/recordings/RecordingsTableController";

async function Page({searchParams}) {
    let recordings;
    let totalRes;
    const session = await auth();
    const params = await searchParams;
    // console.log(params);
    try{
        console.log(process.env.NEXT_PUBLIC_URL);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/recording/getRecordings?page=${params.page || 1}&student=${params.student || ""}&teacher=${params.teacher || ""}&startDate=${params.startDate || ""}&endDate=${params.endDate || ""}`,
          {
            method: "GET",
            cache: "no-store",
            headers: { Authorization: `Bearer ${session.jwt}` },
          },
        );
        const resJson = await res.json();
        recordings = resJson.recordings;
        totalRes = resJson.totalResults;
        // console.log(data);
    }catch(err){
        console.log('failed');
        console.log(err);
        recordings = [];
    }
  return (
    <ProtectRoutes>
      <div className="w-full h-full flex flex-col">
        <div className="mt-10 flex items-center justify-center w-full ">
          <h1 className="flex items-center gap-3 w-fit bg-amber-800 px-10 py-2 rounded-tl-full rounded-br-full shadow border border-(--border) font-semibold text-xl text-white tracking-wide">
            <LuAudioLines /> Recordings
          </h1>
        </div>

        {recordings.length < 1 && (
          <h1 className="absolute top-1/2 left-1/2 -translate-1/2 text-center font-bold tracking-wider w-3/4">
            you don&apos;t have any recordings yet!
          </h1>
        )}

        
          <div className="relative rounded-md px-2 w-full bg-(--layer)  mt-10">
            <div className="w-full shadow border border-(--border) rounded overflow-hidden">
              {(params.startDate || params.student || params.teacher) &&
                recordings.length < 1 && (
                  <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-lg tracking-wider">
                    no results found!
                  </h1>
                )}
              <div className="py-2 px-3 w-full grid grid-cols-8 bg-(--background) font-semibold">
                <div className=" col-span-2 text-xs text-left">Date</div>
                <div className="text-left">
                  <CiClock2 />
                </div>
                <div className=" col-span-2 text-xs text-left">Student</div>
                <div className=" col-span-2 text-xs text-left">Muhaffiz</div>
                <div className="flex justify-end">
                  <Filter role={session.currentUser.role} />
                </div>
              </div>

              <div className="space-y-2">
                {recordings.map((el, i) => (
                  <RecordingEntry key={el._id} el={el} i={i} />
                ))}
                {Array.from({ length: 10 - recordings.length }).map((el, i) => (
                  <RecordingEntry key={i} isDummy />
                ))}
                <RecordingsTableController totalRes={totalRes} />
              </div>
            </div>
          </div>
        
      </div>
    </ProtectRoutes>
  );
}

export default Page;
