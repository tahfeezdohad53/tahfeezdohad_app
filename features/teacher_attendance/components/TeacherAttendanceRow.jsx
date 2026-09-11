'use client';
import { format } from "date-fns";

function TeacherAttendanceRow({el}) {
    return (
      <div
        // key={el.Id}
        className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center border-b border-gray-100 px-2 py-3 last:border-b-0"
      >
        {/* Date */}
        <span className="text-[11px] max-w-3/4 font-medium text-gray-800">
          {format(new Date(el.checkedIn), "dd MMM, yyyy")}
        </span>

        {/* Check In */}
        <span className="text-[11px] text-center font-medium text-green-600">
          {format(new Date(el.checkedIn), "HH:mm")}
        </span>

        {/* Check Out */}
        <span className="text-[11px] text-center font-medium text-red-500">
          {el?.checkedOut ? format(new Date(el.checkedOut), "HH:mm") : "-"}
        </span>

        {/* Total */}
        <div>
          <p className="text-[11px] font-medium text-center text-gray-900">
            <span className="font-bold">
              {el?.checkedOut ? el.totalMin + " m" : "-"}
            </span>
          </p>
          {/* <p className="text-[9px] text-gray-500">({el.duration})</p> */}
        </div>

        {/* Actions */}
        <button
          className={`text-[0.65rem] text-center hover:text-gray-900 ${el.isVerified ? "text-green-500" : "text-red-500"}`}
        >
          {el.isVerified ? "Verified" : "pending"}
        </button>
      </div>
    );
}

export default TeacherAttendanceRow
