'use client';

import { IoIosLogOut } from "react-icons/io";
import CheckInButton from "./CheckInButton";
import useStatus from "../hooks/useStatus";
import { useUser } from "@/app/_components/providers/UserProvider";
import { format } from "date-fns";
import CheckOutButton from "./CheckOutButton";
import { CiCircleInfo, CiClock2 } from "react-icons/ci";
import { Activity, Clock3, Timer } from "lucide-react";
import { LuClipboardList } from "react-icons/lu";
import {
  ClipboardCheck,
  LogIn,
  LogOut,
  // Clock3,
  CalendarDays,
} from "lucide-react";
import { SlCalender } from "react-icons/sl";
function TodayAttendanceStatus() {
  const {user} = useUser(); 
  
  const {data} = useStatus();
    return (
      <div className="w-full overflow-hidden rounded-xl border border-amber-900/20 bg-(--card) shadow-(--shadow-md)">
        {/* Header */}
        <div className="relative bg-amber-900 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <LuClipboardList size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Attendance Status
              </p>
              <p className="mt-0.5 text-[0.65rem] text-amber-100/80">
                Your daily attendance status
              </p>
            </div>
          </div>
        </div>

        {/* Main Status */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Status */}
            <div>
              <div className="flex items-center gap-1.5">
                <Activity size={13} className="text-amber-800/60" />
                <p className="text-xs font-medium text-gray-600">Last Status</p>
              </div>

              <div
                className={`mt-2 flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-medium ${
                  user?.teacherAttendanceStatus === "checkedIn"
                    ? "bg-green-600/10 text-green-700"
                    : "bg-red-600/10 text-red-600"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    user?.teacherAttendanceStatus === "checkedIn"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                />

                <span>
                  {user?.teacherAttendanceStatus === "checkedIn"
                    ? "Checked in"
                    : user?.teacherAttendanceStatus === "checkedOut"
                      ? "Checked out"
                      : "Not checked in"}
                </span>
              </div>
            </div>

            {/* Action */}
            <div>
              {user?.teacherAttendanceStatus !== "checkedIn" ? (
                <CheckInButton />
              ) : (
                <CheckOutButton />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 border-y border-amber-900/10 py-4">
            <div className="grid grid-cols-2">
              {/* Last Status Time */}
              <div className="pr-4 pb-3">
                <div className="flex items-center gap-1.5">
                  <Clock3 size={13} className="text-amber-800/50" />

                  <p className="text-[0.65rem] text-gray-500">
                    {user?.teacherAttendanceStatus === "checkedIn"
                      ? "Checked in at"
                      : "Checked out at"}
                  </p>
                </div>

                <p className="mt-1 ml-5 text-xs font-semibold text-gray-800">
                  {user?.lastStatusTime
                    ? format(new Date(user.lastStatusTime), "dd MMM, HH:mm")
                    : "Not available"}
                </p>
              </div>

              {/* Total Khidmat */}
              <div className="border-l border-amber-900/10 pl-4 pb-3">
                <div className="flex items-center gap-1.5">
                  <Timer size={13} className="text-amber-800/50" />

                  <p className="text-[0.65rem] text-gray-500">Today Khidmat</p>
                </div>

                <p className="mt-1 ml-5 text-xs font-bold text-gray-800">
                  {user?.teacherTotalMin || 0} min
                </p>
              </div>

              <div className="pr-4 mt- border-t border-t-gray-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <SlCalender size={11} className="text-amber-800/50" />

                  <p className="text-[0.65rem] text-gray-500">Previous Month</p>
                </div>

                <p className="mt-1 ml-5 text-xs font-semibold text-gray-800">
                  {data?.previousMonthMin ? Math.ceil(data?.previousMonthMin / 60) : '0'} Hours
                </p>
              </div>

              {/* Total Khidmat */}
              <div className="border-l mt- border-amber-900/10 pl-4 border-t border-t-gray-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <SlCalender size={11} className="text-amber-800/50" />

                  <p className="text-[0.65rem] text-gray-500">This Month</p>
                </div>

                <p className="mt-1 ml-5 text-xs font-bold text-gray-800">
                  {data?.thisMonthMin ? Math.ceil(data?.thisMonthMin / 60) : '0'} Hours
                </p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-xs text-[0.65rem] text-gray-500 flex gap-2 px-3 mt- pb-2"><CiCircleInfo className="text-black"/>Previous Month Hours and This Month Hours are Rounded Up.</h1>
      </div>
    );
}

export default TodayAttendanceStatus;
