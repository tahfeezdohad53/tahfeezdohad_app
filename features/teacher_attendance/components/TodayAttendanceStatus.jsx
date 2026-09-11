'use client';

import { IoIosLogOut } from "react-icons/io";
import CheckInButton from "./CheckInButton";
import useStatus from "../hooks/useStatus";
import { useUser } from "@/app/_components/providers/UserProvider";
import { format } from "date-fns";
import CheckOutButton from "./CheckOutButton";
import { CiClock2 } from "react-icons/ci";
import { Activity, Clock3, Timer } from "lucide-react";
function TodayAttendanceStatus() {
  const {user} = useUser();
  // const {data} = useStatus();
    return (
      <div className="p-3 py-4 flex items-center justify-between w-full bg-(--card) border border-gray-300 shadow-(--shadow-md) rounded-md">
        {/* Last Status */}
        <div>
          <div className="flex items-center gap-1.5">
            <Activity size={13} className="text-gray-500" />
            <p className="text-xs text-gray-600">Last Status</p>
          </div>

          <div
            className={`text-[0.65rem] flex items-center gap-1 mt-2 ml-2 ${
              user?.teacherAttendanceStatus === "checkedIn"
                ? "bg-green-600/10"
                : "bg-red-600/10"
            } w-fit rounded-full p-1 px-2`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                user?.teacherAttendanceStatus === "checkedIn"
                  ? "bg-green-700"
                  : "bg-red-500"
              }`}
            />

            <p>
              {user?.teacherAttendanceStatus === "checkedIn" && "Checked in"}
              {user?.teacherAttendanceStatus === "checkedOut" && "Checked out"}
              {!user?.teacherAttendanceStatus && "Not checked in"}
            </p>
          </div>

          {/* Time */}
          {user?.lastStatusTime && (
            <div className="mt-5">
              <p className="text-xs text-gray-600">
                {user.teacherAttendanceStatus === "checkedIn" &&
                  "Checked in at"}
                {user.teacherAttendanceStatus === "checkedOut" &&
                  "Checked out at"}
              </p>

              <div className="flex items-center gap-1 mt-1 ml-3">
                <Clock3 size={11} className="text-gray-500" />

                <p className="font-semibold text-xs">
                  {format(new Date(user.lastStatusTime), "dd MMM, HH:mm")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Today Khidmat */}
        <div className="border-l border-gray-400 pl-5">
          <div className="flex items-center gap-1.5">
            <Timer size={13} className="text-gray-500" />

            <h1 className="text-xs text-gray-700">Today khidmat</h1>
          </div>

          <h1 className="font-bold ml-5 ">{user?.teacherTotalMin || "0"} min</h1>
        </div>

        {/* Action */}
        <div className="space-y-2 grid">
          {user?.teacherAttendanceStatus !== "checkedIn" && <CheckInButton />}

          {user?.teacherAttendanceStatus === "checkedIn" && <CheckOutButton />}
        </div>
      </div>
    );
}

export default TodayAttendanceStatus;
