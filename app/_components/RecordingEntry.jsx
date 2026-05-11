'use client';
import { format } from "date-fns";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function RecordingEntry({el,i,isDummy=false}) {
    const [isExpand,setIsExpand] = useState(false);
    if(!isDummy)return (
      <div className="w-full">
        <div className="w-full grid grid-cols-8 px-3 py-2 border-b border-(--border)">
          {/* <p>{(page - 1) * 10 + index + 1}</p> */}
          <p className="text-[0.60rem] text-xs tracking-wider col-span-2">
            {format(el.createdAt, "d MMM, yyyy")}
          </p>
          <p className=" text-[0.60rem]">{Math.round(el?.duration) || ''} min</p>
          <p className=" col-span-2 text-[0.60rem] text-left truncate">{el.studentName}</p>
          <p className=" col-span-2 text-[0.60rem] text-left truncate">{el.teacherName}</p>
          <button
            onClick={() => setIsExpand(!isExpand)}
            className="text-xs flex justify-center"
          >
            <IoIosArrowDown
              className={`${isExpand && "rotate-180"} duration-300 ease-in-out`}
            />
          </button>
        </div>
        {isExpand && (
          <div className=" w-full">
            <audio
              src={el.audio}
              className=" scale-70 w-full rounded-lg p-2 bg-blue-50"
              controls
            ></audio>
          </div>
        )}
      </div>
    );
    if(isDummy)return (
      <div className="w-full">
        <div className="w-full grid grid-cols-11 px-3 py-2 border-(--border)">
          {/* <p>{(page - 1) * 10 + index + 1}</p> */}
          <p className=" text-xs opacity-0">1</p>
          <p className="text-xs tracking-wider col-span-3">
            
          </p>
          <p className=" col-span-3 text-xs text-left"></p>
          <p className=" col-span-3 text-xs text-left"></p>
          <button
            // onClick={() => setIsExpand(!isExpand)}
            className="text-xs flex justify-center"
          >
            
          </button>
        </div>
      </div>
    );
}

export default RecordingEntry
{/* <div className="w-full grid grid-cols-11 text-center border-t-amber-800 border-t">
          <div className="p-2 text-xs">{i + 1}</div>
          <div className="p-2 text-xs col-span-3">
            {new Date(el.createdAt).getDate()}-
            {new Date(el.createdAt).getMonth() + 1}-
            {new Date(el.createdAt).getFullYear()}
          </div>
          <div className="p-2 text-xs col-span-3">{el.student}</div>
          <div className="p-2 text-xs col-span-3">{el.muhaffiz}</div>
          <button
            onClick={() => setIsExpand(!isExpand)}
            className="p-2 text-xs flex justify-center"
          >
            <IoIosArrowDown
              className={`${isExpand && "rotate-180"} duration-300 ease-in-out`}
            />
          </button>
        </div>
        {isExpand && (
          <div className=" w-full">
            <audio
              src={el.audio}
              className=" scale-70 w-full rounded-lg p-2 bg-blue-50"
              controls
            ></audio>
          </div>
        )} */}