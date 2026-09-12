import { formatName } from "@/helpers";
import { format } from "date-fns";
import { FaCheck } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

function TeacherAttendanceRowForAdmin({el}) {
    return (
      <div
        // key={index}
        className="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr] gap-1 items-center border-b border-gray-100 px-2 py-3 last:border-b-0"
      >
        {/* Teacher */}
        <span className=" font-bold text-gray-800 text-[0.60rem] hyphens-auto">
          {formatName(el.teacher.name)}
        </span>

        {/* Date */}
        {/* <span className="text-[0.60rem] text-left border  text-gray-700">{el.date} </span> */}

        {/* Check In */}
        <p className="text-[0.60rem] font-bold text-green-600 flex flex-col text-center">
          {format(new Date(el.checkedIn), "dd MMM,")}
          <span>{format(new Date(el.checkedIn), "HH:mm")}</span>
        </p>

        {/* Check Out */}
        <p className="text-[0.60rem] font-bold flex flex-col text-red-500 text-center">
          {el.checkedOut
            ? format(new Date(el.checkedOut), "dd MMM,")
            : "-"}
          <span>
            {el.checkedOut
              ? format(new Date(el.checkedOut), "HH:mm")
              : ""}
          </span>
        </p>

        {/* Total */}
        <div>
          <p className="text-[0.60rem] font-bold text-gray-900 text-center">
            {el?.totalMin ? el.totalMin + " m" : "-"}
          </p>
          {/* <p className="text-[9px] text-gray-500">({el.duration})</p> */}
        </div>

        {/* Actions */}
        <div className="gap-1 ">
          {/* Verify */}
          {!el.isVerified && el.checkedOut && (
            <button className="rounded-lg w-3/4 ml-auto flex items-center justify-center border border-green-200 bg-green-50 px-2 py-2 text-[10px] font-medium text-green-700 hover:bg-green-100">
              <FaCheck />
            </button>
          )}

          {/* Admin Check Out */}
          {!el.checkedOut && (
            <button className="rounded-lg w-3/4 ml-auto flex items-center justify-center border border-red-200 bg-red-50 px-2 py-2 text-[10px] font-medium text-red-600 hover:bg-red-100">
              <IoIosLogOut />
            </button>
          )}

          {/* More */}
          {/* <button className="px-1 text-lg leading-none text-gray-600 hover:text-gray-900">
            ⋮
          </button> */}
        </div>
      </div>
    );
}

export default TeacherAttendanceRowForAdmin;
