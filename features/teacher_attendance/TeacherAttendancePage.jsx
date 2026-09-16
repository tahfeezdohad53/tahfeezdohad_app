"use client";

import TodayAttendanceStatus from "./components/TodayAttendanceStatus";
import TeacherAttendanceTable from "./components/TeacherAttendanceTable";
import { useUser } from "@/app/_components/providers/UserProvider";



function TeacherAttendancePage() {
  const {user} = useUser();

  if(!user?._id) return null;
  return (
    <div className="p-5 px-2 flex flex-col gap-5">
      <TodayAttendanceStatus />

      <TeacherAttendanceTable />
    </div>
  );
}

export default TeacherAttendancePage;
