"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CustomContextMenu from "../CustomContextMenu";
import { CiUser } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { useState } from "react";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useUser } from "../providers/UserProvider";

function MaqaratFilter({ query }) {
  const {user} = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  function handleChangeParam(value,type) {
    const url = new URLSearchParams(params);
    if(type === 'reset') {
      url.delete('batch');
      url.delete('status');
      router.replace(`${pathname}`, { scroll: false });
      return;
    }
    if(type === 'batch')url.set("batch", value);
    else url.set("status",value);
    router.replace(`${pathname}?${url}`, { scroll: false });
  }
  let options;

  if(user?.role === 'admin') {
    options = [{
      text: "Baneen",
      name:'batch',
      value:'baneen',
      icon: <CiUser />,
      handler: () => handleChangeParam("baneen", "batch"),
    },
    {
      text: "Banaat",
      name:'batch',
      value:'banaat',
      icon: <CiUser />,
      handler: () => handleChangeParam("banaat", "batch"),
    },
    {
      text: "upcoming",
      name:'status',
      value:'upcoming',
      icon: <CiUser />,
      handler: () => handleChangeParam("upcoming","status"),
    },
    {
      text: "ended",
      name:'status',
      value:'ended',
      icon: <CiUser />,
      handler: () => handleChangeParam("ended","status"),
    },
    {
      text: "today",
      name:'status',
      value:'today',
      icon: <CiUser />,
      handler: () => handleChangeParam("today","status"),
    },
    {
      text: "reset",
      name:'',
      value:'',
      icon: <IoIosRemoveCircleOutline />,
      handler: () => handleChangeParam("","reset"),
    },]
  }
  if(user?.role === 'teacher' || user?.role === 'student') {
    options = [
    {
      text: "upcoming",
      name:'status',
      value:'upcoming',
      icon: <CiUser />,
      handler: () => handleChangeParam("upcoming","status"),
    },
    {
      text: "ended",
      name:'status',
      value:'ended',
      icon: <CiUser />,
      handler: () => handleChangeParam("ended","status"),
    },
    {
      text: "today",
      name:'status',
      value:'today',
      icon: <CiUser />,
      handler: () => handleChangeParam("today","status"),
    },
    {
      text: "reset",
      name:'',
      value:'',
      icon: <IoIosRemoveCircleOutline />,
      handler: () => handleChangeParam("","reset"),
    },]
  }
 
  return (
    <div className="flex mb-1 ">
      <div className="relative ml-auto space-x-3">
        {showFilter && <CustomContextMenu onClose={()=>setShowFilter(false)} className="w-40" options={options} />}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-(--card) p-2 shadow rounded-md"
        >
          <IoFilterOutline />
        </button>
      </div>
    </div>
  );
}

export default MaqaratFilter;
