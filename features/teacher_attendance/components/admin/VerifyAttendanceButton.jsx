import { FaCheck } from "react-icons/fa";
import useVerifyAttendance from "../../hooks/useVerifyAttendance";
import toast from "react-hot-toast";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

function VerifyAttendanceButton({attendanceId}) {
    const mutate = useVerifyAttendance();
    const [isUpdating,setIsUpdating] = useState();
    async function handleClick(){
        setIsUpdating(true);
        await mutate.mutateAsync({attendanceId});
        setIsUpdating(false);
    }
  return (
    <button onClick={handleClick} className="relative rounded-lg w-3/4 ml-auto flex items-center justify-center border border-green-200 bg-green-50 px-2 py-2 text-[10px] font-medium text-green-700 hover:bg-green-100">
      <span className={`flex items-center gap-2 ${isUpdating ? "opacity-0" : "opacity-100"}`}>
              <FaCheck />
            </span>
            <span
              className={`${isUpdating ? "opacity-100" : "opacity-0"} animate-spin absolute top-1/2 left-1/2 -translate-1/2`}
            >
              <ImSpinner2 />
            </span>
    </button>
  );
}

export default VerifyAttendanceButton;