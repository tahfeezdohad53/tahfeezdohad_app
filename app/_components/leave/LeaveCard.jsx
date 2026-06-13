'use client';
import { format, formatDistanceToNow } from "date-fns";
import { CiCalendarDate, CiCircleQuestion, CiUser } from "react-icons/ci";
import { FaGraduationCap, FaUser } from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { TbNotes } from "react-icons/tb";
import CustomContextMenu from "../CustomContextMenu";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { useUser } from "../providers/UserProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";



function LeaveCard({id,status,name,createdAt,batch,days,type,reason,from,to}) {
  const {user} = useUser();
  const queryClient = useQueryClient();
  const [showMenu,setShowMenu] = useState(false);
  const statusStyles = {
    upcoming: "text-blue-600 bg-blue-100",
    pending: "text-amber-600 bg-amber-100",
    accepted: "text-green-600 bg-green-100",
    rejected: "text-red-600 bg-red-100",
  };
  const border = {
    upcoming: "border-l-blue-600",
    pending: "border-l-amber-600",
    accepted: "border-l-green-600",
    rejected: "border-l-red-600",
  };
  async function handleUpdate(status){
    try{
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/leave/update`,{leaveId:id,status},{withCredentials:true});
      queryClient.invalidateQueries({queryKey:['leaves']});
      toast.success('leave status updated');
    }catch(err){
      console.log(err);
      toast.success("failed to update leave status");
    }
  }
  const options = [{icon:<IoCheckmark />,text:'Accept',textColor:'text-green-500',handler:()=>handleUpdate('accepted')},{icon:<RxCross2 />,text:'reject',textColor:'text-red-500',handler:()=>handleUpdate('rejected')}]
    return (
      <div className="relative w-full border-l-4 border-l-amber-800 border-(--border) bg-(--card) p-3 rounded-md shadow-(--shadow-sm)">
        {user?.role === "admin" && (
          <div className="absolute right-1 top-2">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className=" p-2 rounded-md hover:bg-(--card-hover) hover:border hover:border-(--border) border border-transparent transition-all duration-300 ease-in-out hover:cursor-pointer"
            >
              <HiOutlineDotsVertical />
            </div>
            {showMenu && (
              <CustomContextMenu
                onClose={() => setShowMenu(false)}
                className="w-40 font-semibold"
                options={options}
              />
            )}
          </div>
        )}
        <div className="  gap-5">
          <div className="h-20 flex justify-center items-center mx-auto  w-20 rounded-full border border-(--border)">
            <CiUser className="text-5xl" />
          </div>

          <div className="text-xs text-gray-900 flex flex-col gap-2 ">
            <h1 className="text-lg text-center border-b pb-2 border-(--border) font-semibold text-black  wrap-break-word max-w-full">
              {name}
            </h1>
            <h1 className="flex items-center gap-1">
              <span className="p-1 rounded-md bg-(--bg-tertiary)/50">
                <FaGraduationCap className="text-orange-800" />
              </span>
              <span className="text-amber-800 font-bold mr-1">batch:</span>{" "}
              {batch}
            </h1>
            <h1 className="text-amber-800 font-bold flex items-center gap-1 ">
              <span className="p-1 bg-(--bg-tertiary)/50 rounded-md">
                <CiCalendarDate className="text-xs" />{" "}
              </span>
              <span className="text-amber-800 font-bold mr-1">Applied:</span>{" "}
              <span className="">{formatDistanceToNow(createdAt,{addSuffix:true})}</span>
            </h1>
            {/* <h1 className="flex items-center gap-1">
              <span className="p-1 rounded-md bg-(--bg-tertiary)/50">
                <TbNotes className="text-orange-800" />
              </span>
              <span className="text-amber-800 font-bold mr-1">Type:</span>{" "}
              {type}
            </h1> */}
            <h1 className="flex  items- gap-1">
              <div className="flex items-center gap-1">
                <span className="p-1 rounded-md bg-(--bg-tertiary)/50">
                  <CiCircleQuestion className="text-orange-800" />
                </span>
                <span className="text-amber-800 font-bold mr-1">
                  Reason:
                </span>{" "}
              </div>
              <span className="bg-(--bg-tertiary)/50 p-2 rounded-md w-full border border-(--border)">
                {reason}
              </span>
            </h1>
            <p className="flex items-center gap-1">
              <span className="p-1 rounded-md bg-(--bg-tertiary)/50">
                <GrStatusInfo className="text-orange-800" />
              </span>
              <span className="text-amber-800 font-bold mr-1">Status:</span>{" "}
              <span
                className={`p-1 px-3 rounded-full font-medium ${
                  statusStyles[status] || "text-gray-600 bg-gray-100"
                }`}
              >
                {status}
              </span>
            </p>
            <h1 className="text-amber-800 font-bold flex items-center gap-1 ">
              <span className="p-1 bg-(--bg-tertiary)/50 rounded-md">
                <CiCalendarDate className="text-xs" />{" "}
              </span>
              <span className="text-amber-800 font-bold mr-1">Days:</span>{" "}
              <span className="">{days} days</span>
            </h1>
            <h1 className="text-amber-800 font-bold flex items-center gap-1 text-[0.60rem]">
              <span className="p-1 bg-(--bg-tertiary)/50 rounded-md">
                <CiCalendarDate className="text-xs" />{" "}
              </span>
              <span className="">
                {format(from, "MMM dd, YYY")} - {format(to, "MMM dd, YYY")}
              </span>
            </h1>
          </div>
        </div>
      </div>
    );
}

export default LeaveCard
