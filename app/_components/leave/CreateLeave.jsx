'use client';
import { useState } from "react";
import Modal from "../Modal"
import { CiCalendar } from "react-icons/ci";
import { GrNotes } from "react-icons/gr";
import { LuSend } from "react-icons/lu";
import { LiaStickyNoteSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { useQueryClient } from "@tanstack/react-query";
import CustomDateRangePicker from "../CustomDateRangePicker";
import { IoIosArrowDown } from "react-icons/io";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { differenceInDays } from "date-fns";
function CreateLeave() {
    const [showForm,setShowForm] = useState(false);
    return (
        <div className="ml-auto">
            <button onClick={()=>setShowForm(!showForm)} className="bg-(--primary-light) hover:cursor-pointer duration-300 ease-in-out transition-all hover:bg-(--primary) text-white/90 px-4 h-10 rounded-md">+ New Leave</button>
            {showForm && <LeaveForm onClose={()=>setShowForm(false)} />}
        </div>
    )
}

export default CreateLeave

function LeaveForm({onClose}){

  const {register,handleSubmit,} = useForm();
    const [date, setDate] = useState([
      { startDate: new Date(), endDate: new Date(), key: "range1" },
    ]);
  const queryClient = useQueryClient();
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [showDateSelect,setShowDateSelect] = useState(false);
  async function handleCreateLeave(e){
    setIsSubmitting(true);
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/leave/create`,{...e,from:date[0].startDate,to:date[0].endDate},{withCredentials:true})
      if(res.data.ok){
        queryClient.invalidateQueries(['leaves']);
        onClose();
        return toast.success('leave request submitted'); 
      }
    }catch(err){
      console.log(err);
        return toast.error("failed to submit leave request"); 
    }finally{
      setIsSubmitting(false);
    }
  }
  const handleError = (errors) => {
    console.log(errors);
  };
  function handleDateSelection(el){
    setDate([{ startDate: el.range1.startDate, endDate: el.range1.endDate }]);
  }
    return (
      <Modal onClose={onClose} className="h-fit w-[90%]">
        <form
          onSubmit={handleSubmit(handleCreateLeave, handleError)}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="p-4 rounded-md bg-(--bg-tertiary)/50 shadow-(--shadow-sm)">
              <CiCalendar />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Create Leave</h1>
              <h1 className="text-[0.60rem] text-gray-800">
                Fill in the details below to submit a leave request
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold text-sm">Leave Type</p>
            <div className="relative">
              <select
                required
                {...register("type", { required: true })}
                // placeholder="sick leave, out of station, family function etc"
                type="text"
                className="placeholder:text-xs p-2 pl-3 rounded-md focus:outline-none w-full border border-(--border)"
              >
                <option value="casual">casual leave</option>
                <option value="sick">sick leave</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold text-sm">Reason</p>
            <div className="relative">
              <textarea
                required
                {...register("reason", { required: true })}
                type="text"
                rows={3}
                className="p-2 resize-none pl-3 rounded-md focus:outline-none w-full border border-(--border)"
              />
              {/* <div className="p-2 absolute top-2  left-2 rounded-md bg-(--bg-tertiary)/50 shadow-(--shadow-sm)">
                <LiaStickyNoteSolid />
              </div> */}
            </div>
          </div>

          <div className="relative">
            <div
              onClick={() => setShowDateSelect(!showDateSelect)}
              className="relative flex items-center gap-2 border-(--border) rounded-md py-2 px-3 border"
            >
              <CiCalendar />
              {/* <p>Select Date</p> */}
              <p className="text-xs">
                {date[0].startDate
                  .toDateString()
                  .split(" ")
                  .map((el, i) => (i < 3 ? el : ""))
                  .join(" ")}{" "}
                -{" "}
                {date[0].endDate
                  .toDateString()
                  .split(" ")
                  .map((el, i) => (i < 3 ? el : ""))
                  .join(" ")}
              </p>
              <IoIosArrowDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${showDateSelect && "rotate-180"}`}
              />
            </div>
            {showDateSelect && (
              <div className="absolute bottom-[110%] border border-gray-300 left-1/2 -translate-x-1/2 z-999 shadow-2xl w-fit">
                <DateRangePicker
                  className={`w-3/4`}
                  editableDateInputs
                  startDatePlaceholder="start date"
                  endDatePlaceholder="end date"
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  inputRanges={[]}
                  staticRanges={[]}
                  months={1}
                  ranges={date}
                  onChange={handleDateSelection}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold text-sm">No of days</p>
            <div className="relative">
              <input
              value={differenceInDays(date[0].endDate,date[0].startDate) + 1}
                required
                {...register("days", { required: true })}
                type="Number"
                className="p-2  rounded-md focus:outline-none w-full border border-(--border)"
              />
              {/* <div className="p-2 absolute top-1/2 -translate-y-1/2  left-1 rounded-md bg-(--bg-tertiary)/50 shadow-(--shadow-sm)">
                <CiCalendar />
              </div> */}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="relative hover:cursor-pointer duration-300 ease-in-out transition-all hover:scale-102 flex items-center gap-2 text-white bg-(image:--gradient-primary) py-3 justify-center rounded-md shadow-(--shadow-md)"
          >
            <span
              className={`${isSubmitting && "opacity-0"} flex items-center gap-2`}
            >
              <LuSend /> Submit Leave Request
            </span>
            <span className="absolute left-1/2 top-1/2 -translate-1/2">
              {isSubmitting && <ImSpinner2 className="animate-spin" />}
            </span>
          </button>
        </form>
      </Modal>
    );
}