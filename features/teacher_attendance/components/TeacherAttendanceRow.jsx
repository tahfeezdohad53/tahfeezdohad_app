'use client';
import { format } from "date-fns";

function TeacherAttendanceRow({el}) {
    return (
      <div
        className="
    grid grid-cols-[1fr_1fr_1fr_1fr_1fr]
    items-center
    border-b border-amber-900/10
    px-2 py-3
    transition-colors
    hover:bg-amber-900/[0.03]
    last:border-b-0
  "
      >
        {/* Date */}
        <span className="max-w-3/4 text-[11px] font-medium text-amber-950">
          {format(new Date(el.checkedIn), "dd MMM, yyyy")}
        </span>

        {/* Check In */}
        <span className="text-center text-[11px] font-semibold text-green-600">
          {format(new Date(el.checkedIn), "HH:mm")}
        </span>

        {/* Check Out */}
        <span className="text-center text-[11px] font-semibold text-red-500">
          {el?.checkedOut ? format(new Date(el.checkedOut), "HH:mm") : "-"}
        </span>

        {/* Total */}
        <div className="text-center">
          <p className="text-[11px] font-semibold text-amber-950">
            {el?.checkedOut ? `${el.totalMin} m` : "-"}
          </p>
        </div>

        {/* Verification */}
        <div className="flex justify-center">
          <span
            className={`rounded-full px-2.5 py-1 text-[0.6rem] font-semibold ${
              el.isVerified
                ? "bg-green-600/10 text-green-700"
                : "bg-red-600/10 text-red-600"
            }`}
          >
            {el.isVerified ? "Verified" : "Pending"}
          </span>
        </div>
      </div>
    );
}

export default TeacherAttendanceRow
