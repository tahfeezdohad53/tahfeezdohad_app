'use client';

import { IoIosLogOut } from "react-icons/io";
import CheckInButton from "./CheckInButton";
import useStatus from "../hooks/useStatus";
import { useUser } from "@/app/_components/providers/UserProvider";
import { format } from "date-fns";
import CheckOutButton from "./CheckOutButton";
import { CiClock2 } from "react-icons/ci";
import { Activity, Clock3, Timer } from "lucide-react";
import { LuClipboardList } from "react-icons/lu";
import {
  ClipboardCheck,
  LogIn,
  LogOut,
  // Clock3,
  CalendarDays,
} from "lucide-react";
function TodayAttendanceStatus() {
  const {user} = useUser();
  // const {data} = useStatus();
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-(--card) p-4 shadow-(--shadow-md)">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <LuClipboardList size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Attendance Status
            </p>

            <p className="mt-0.5 text-[0.65rem] text-gray-500">
              Your daily attendance status
            </p>
          </div>
        </div>

        {/* Main Status */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Activity size={13} className="text-gray-400" />
              <p className="text-xs text-gray-500">Last Status</p>
            </div>

            <div
              className={`mt-2 flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] ${
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
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
          {/* Last Status Time */}
          <div>
            <div className="flex items-center gap-1.5">
              <Clock3 size={13} className="text-gray-400" />
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
          <div className="border-l border-gray-200 pl-4">
            <div className="flex items-center gap-1.5">
              <Timer size={13} className="text-gray-400" />
              <p className="text-[0.65rem] text-gray-500">Today Khidmat</p>
            </div>

            <p className="mt-1 ml-5 text-xs font-bold text-gray-800">
              {user?.teacherTotalMin || 0} min
            </p>
          </div>
        </div>
      </div>
    );
}

export default TodayAttendanceStatus;
