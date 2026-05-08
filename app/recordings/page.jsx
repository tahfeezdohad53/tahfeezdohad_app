import { IoIosArrowDown, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import RecordingEntry from "../_components/RecordingEntry";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuAudioLines } from "react-icons/lu";
import CustomSelect from "../_components/Select";
import Filter from "../_components/Filter";
import { FaClock } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";

async function Page() {
    let data;
    
    try{
        console.log('fetchng');
        console.log(process.env.NEXT_PUBLIC_URL);
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/recording/get`,{method:'GET',cache:'no-store'});
        const resJson = await res.json();
        data = resJson.recordings;
        console.log(data);
    }catch(err){
        console.log('failed');
        console.log(err);
        data = [];
    }
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mt-10 flex items-center justify-center w-full ">
        <h1 className="flex items-center gap-3 w-fit bg-amber-800 px-10 py-2 rounded-tl-full rounded-br-full shadow border border-(--border) font-semibold text-xl text-white tracking-wide">
          <LuAudioLines /> Recordings
        </h1>
      </div>

      <div className="rounded-md px-2 w-full bg-(--layer)  mt-10">
        <div className="w-full shadow border border-(--border) rounded overflow-hidden">
          <div className="py-2 px-3 w-full grid grid-cols-8 bg-(--background) font-semibold">
            <div className=" col-span-2 text-xs text-left">Date</div>
            <div className="text-left"><CiClock2 /></div>
            <div className=" col-span-2 text-xs text-left">Student</div>
            <div className=" col-span-2 text-xs text-left">Muhaffiz</div>
            <div className="flex justify-end">
              <Filter />
            </div>
          </div>

          <div className="space-y-2">
            {data.map((el, i) => (
              <RecordingEntry key={el._id} el={el} i={i} />
            ))}
            {Array.from({ length: 10 - data.length }).map((el, i) => (
              <RecordingEntry key={i} isDummy />
            ))}
            <div className="text-sm flex justify-between items-center gap-x-3 pl-3 pr-1 bg-(--highlight) shadow-sm">
              <p>1 out of 10 pages</p>

              <div className="space-x-1">
                <button className=" px-3 py-[0.4rem] rounded-md">
                  <IoIosArrowDropleftCircle className="text-2xl text-amber-800" />
                </button>

                <button className=" px-3 py-[0.4rem] rounded-md">
                  <IoIosArrowDroprightCircle className="text-2xl text-amber-800" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
