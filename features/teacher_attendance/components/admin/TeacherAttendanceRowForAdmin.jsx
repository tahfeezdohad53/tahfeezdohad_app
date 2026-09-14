"use client";

import { formatName } from "@/helpers";
import { format } from "date-fns";
import { useState } from "react";

import { IoIosLogOut } from "react-icons/io";


import VerifyAttendanceButton from "./VerifyAttendanceButton";
import ManualCheckOutForm from "./ManualCheckOutForm";
import { MdVerifiedUser } from "react-icons/md";

function TeacherAttendanceRowForAdmin({ el }) {
    const [isShowCheckOutForm, setIsShowCheckOutForm] = useState(false);

  return (
    <div
      className="
        grid grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_0.9fr_0.8fr]
        items-center
        gap-1
        border-b border-amber-900/10
        px-2 py-3
        transition-colors
        hover:bg-amber-900/3
        last:border-b-0
      "
    >
      {/* Teacher */}
      <span className="borde pr-2 wrap-break-word text-[0.65rem] lg:text-sm font-bold leading-tight text-amber-950">
        {formatName(el.teacher.name)}
      </span>

      {/* Check In */}
      <p className="borde flex flex-col lg:flex-row text-center text-[0.65rem] lg:text-sm font-bold leading-tight text-green-600">
        <span>{format(new Date(el.checkedIn), "dd MMM , ")}</span>
        <span>{format(new Date(el.checkedIn), "HH:mm")}</span>
      </p>

      {/* Check Out */}
      <p className="borde flex flex-col text-center text-[0.65rem] lg:text-sm font-bold leading-tight text-red-500">
        {el.checkedOut ? (
          <span>{format(new Date(el.checkedOut), "HH:mm")}</span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </p>

      {/* Total */}
      <p className="borde text-center text-[0.65rem] lg:text-sm font-semibold text-amber-950">
        {el?.totalMin ? `${el.totalMin} m` : "-"}
      </p>

      {/* Recording */}
      <p className="borde text-center text-[0.65rem] lg:text-sm font-semibold text-amber-950">
        {el?.recordingMin ? `${el.recordingMin} m` : "0 m"}
      </p>

      {/* Actions / Verification */}
      <div className="borde flex flex-col lg:flex-row gap-1 items-center justify-center">
        {/* Needs verification */}
        <div className="ml-aut hidden lg:block "></div>
        {!el.isVerified && el.checkedOut && (
          <VerifyAttendanceButton attendanceId={el._id} />
        )}

        {/* Verified */}
        {el.isVerified && el.checkedOut && (
          <span className="borde ml-aut rounded-md b-green-600/10 px-2.5 py-2 text- font-semibold text-green-700">
            <MdVerifiedUser />
          </span> 
        )}

        {/* Admin Check Out */}
        {/* {!el.checkedOut && ( */}
        {/* )} */}

        {/* Manual Check-Out Modal */}
        {isShowCheckOutForm && <ManualCheckOutForm onClose={() => setIsShowCheckOutForm(false)} el={el}/>}
      </div>
          <button
            type="button"
            onClick={() => setIsShowCheckOutForm(true)}
            className=" 
              flex ml-auto w-3/4 lg:w-fit
              items-center justify-center
              rounded-lg
              border border-red-200
              bg-red-50
              px-2 py-1.5
              text-red-500
              transition-colors
              hover:bg-red-100
            "
          >
            <IoIosLogOut size={15} />
          </button>
    </div>
  );
}

export default TeacherAttendanceRowForAdmin;


