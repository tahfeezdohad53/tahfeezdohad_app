'use client';

import useAttendance from "../hooks/useAttendance";
import TeacherAttendanceTablePaginationController from "./TeacherAttendanceTablePaginationController";
import TeacherAttendanceRow from "./TeacherAttendanceRow";
import { LuCalendarDays } from "react-icons/lu";

function TeacherAttendanceTable() {

  const {data} = useAttendance();
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <p className="text-amber-800 bg-amber-50 p-2 rounded-md">
            <LuCalendarDays />
          </p>
          <div>
            <p className="font-semibold">Attendance Records</p>
            <p className="text-[0.65rem] mt-1 text-gray-500">Your daily check in and check out history</p>
          </div>
        </h2>
      </div>

      {/* Table */}
      <div className="px-3">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center rounded-md bg-[#f6f3f0] px-2 py-2 text-[10px] font-medium text-gray-600">
          <span>Date</span>
          <span className="text-center">Check In</span>
          <span className="text-center">Check Out</span>
          <span className="text-center">Total Min</span>
          <span className="text-center">Verification</span>
        </div>

        {/* Rows / Empty State */}
        {data?.attendance?.length > 0 ? (
          data.attendance.map((el) => (
            <TeacherAttendanceRow key={el._id} el={el} />
          ))
        ) : (
          <div className="flex min-h-35 flex-col items-center justify-center text-center">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3f0] text-gray-500">
              📋
            </div>

            <p className="text-xs font-semibold text-gray-800">
              No attendance records yet
            </p>

            <p className="mt-1 text-[10px] text-gray-500">
              Check in to start recording your attendance.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.attendance?.length > 0 && (
        <TeacherAttendanceTablePaginationController count={data?.count} />
      )}
    </div>
  );
};

export default TeacherAttendanceTable;


const attendanceRecordsForAdmin = [
  {
    teacher: "Ahmed Khan",
    date: "Sep 03, 2026",
    checkIn: "08:32 AM",
    checkOut: "11:45 AM",
    totalMin: 193,
    duration: "3h 13m",
    verified: true,
  },
  {
    teacher: "Sana Ali",
    date: "Sep 03, 2026",
    checkIn: "01:05 PM",
    checkOut: "04:15 PM",
    totalMin: 190,
    duration: "3h 10m",
    verified: true,
  },
  {
    teacher: "Faizan Patel",
    date: "Sep 02, 2026",
    checkIn: "08:30 AM",
    checkOut: "12:30 PM",
    totalMin: 240,
    duration: "4h 00m",
    verified: true,
  },
  {
    teacher: "Nida Sheikh",
    date: "Sep 02, 2026",
    checkIn: "02:00 PM",
    checkOut: "03:00 PM",
    totalMin: 60,
    duration: "1h 00m",
    verified: true,
  },
  {
    teacher: "Ahmed Khan",
    date: "Sep 01, 2026",
    checkIn: "09:00 AM",
    checkOut: "01:20 PM",
    totalMin: 260,
    duration: "4h 20m",
    verified: true,
  },
  {
    teacher: "Sana Ali",
    date: "Aug 31, 2026",
    checkIn: "08:35 AM",
    checkOut: "11:30 AM",
    totalMin: 175,
    duration: "2h 55m",
    verified: false,
  },
  {
    teacher: "Faizan Patel",
    date: "Aug 31, 2026",
    checkIn: "12:00 PM",
    checkOut: "01:05 PM",
    totalMin: 65,
    duration: "1h 05m",
    verified: false,
  },
  {
    teacher: "Nida Sheikh",
    date: "Aug 30, 2026",
    checkIn: "08:45 AM",
    checkOut: "12:30 PM",
    totalMin: 225,
    duration: "3h 45m",
    verified: true,
  },
];





function TeacherAttendanceTableForAdmin(){
  return(<div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Attendance Records
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-3">
        {/* Table Header */}
        <div className="grid min-w-[650px] grid-cols-[1.3fr_1fr_1fr_1fr_0.8fr_100px] items-center rounded-md bg-[#f6f3f0] px-2 py-2 text-[10px] font-medium text-gray-600">
          <span>Teacher</span>
          <span>Date</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Total Min</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {attendanceRecordsForAdmin.map((record, index) => (
          <div
            key={index}
            className="grid min-w-[650px] grid-cols-[1.3fr_1fr_1fr_1fr_0.8fr_100px] items-center border-b border-gray-100 px-2 py-3 last:border-b-0"
          >
            {/* Teacher */}
            <span className="text-[11px] font-medium text-gray-800">
              {record.teacher}
            </span>

            {/* Date */}
            <span className="text-[11px] text-gray-700">{record.date}</span>

            {/* Check In */}
            <span className="text-[11px] font-medium text-green-600">
              {record.checkIn}
            </span>

            {/* Check Out */}
            <span className="text-[11px] font-medium text-red-500">
              {record.checkOut || "--"}
            </span>

            {/* Total */}
            <div>
              <p className="text-[11px] font-medium text-gray-900">
                {record.totalMin} min
              </p>
              <p className="text-[9px] text-gray-500">({record.duration})</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Verify */}
              {!record.verified && (
                <button className="rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 hover:bg-green-100">
                  Verify
                </button>
              )}

              {/* Admin Check Out */}
              {!record.checkOut && (
                <button className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100">
                  Check Out
                </button>
              )}

              {/* More */}
              <button className="px-1 text-lg leading-none text-gray-600 hover:text-gray-900">
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-3">
        <p className="text-[10px] text-gray-500">Showing 1–8 of 128 entries</p>

        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
            ←
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6b3f20] text-xs font-semibold text-white">
            1
          </div>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-600 transition hover:bg-gray-100">
            →
          </button>
        </div>
      </div>
    </div>)
}