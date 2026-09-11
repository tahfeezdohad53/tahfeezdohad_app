'use client';

import { IoIosLogOut } from "react-icons/io";

function TodayAttendanceStatus() {
    return (
      <div className="p-3 py-5 flex items-center justify-between w-full bg-(--car) border border-gray-300 shadow-(--shadow-md) rounded-md">
        <div>
          <p className="text-xs text-gray-600">Today&apos;s Status</p>
          <div className="text-xs flex items-center gap-2 mt-2 ml-2 bg-green-600/10 w-fit rounded-full p-1 px-2">
            <div className="h-2 w-2 rounded-full bg-green-700"></div>
            <p className="">Checked In</p>
          </div>

          <div className="mt-5">
            <p className="text-xs text-gray-600">Checked In</p>
            <h1 className="font-bold">08:32 AM</h1>
          </div>
        </div>

        <div className="border-l border-gray-400 pl-10">
            <h1 className="text-xs text-gray-700">Current Session</h1>
            <h1 className="font-bold">283 min</h1>
            <p className="text-xs text-gray-700">(4h 34m)</p>
        </div>

        <div className="space-y-2 grid">
            <button className="flex items-center gap-2 text-xs py-3 px-3 shadow-(--shadow-sm) bg-(--primary) rounded-md  text-white"><IoIosLogOut /> Check In</button>
            <button className="flex items-center gap-2 text-xs py-3 px-3 shadow-(--shadow-sm)  rounded-md border border-(--primary)"><IoIosLogOut className="text-red-500"/> Check Out</button>
            
        </div>
      </div>
    );
}

export default TodayAttendanceStatus;
