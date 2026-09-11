"use client";

import TodayAttendanceStatus from "./components/TodayAttendanceStatus";
import TeacherAttendanceTable from "./components/TeacherAttendanceTable";



function TeacherAttendancePage() {
  return (
    <div className="p-5 px-2 flex flex-col gap-5">
      <TodayAttendanceStatus />

      <TeacherAttendanceTable />
    </div>
  );
}

export default TeacherAttendancePage;
