'use client';
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { BiDotsVertical } from "react-icons/bi";
import CustomContextMenu from "./CustomContextMenu";
import { BsDownload } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { MdForward5 } from "react-icons/md";
import { TbRewindBackward5, TbRewindForward5 } from "react-icons/tb";
import { LuInfo, LuCheck } from "react-icons/lu";
import { formatName } from "@/helpers";
import { useQueryClient } from "@tanstack/react-query";
function RecordingEntry({el,i,isDummy=false,role}) {
    const [isExpand,setIsExpand] = useState(false);
    const audioRef = useRef(null);
    if(!isDummy)return (
      <div
        className=" w-full hover:bg-(--card-hover) duration-300 ease-in-out transition-all hover:cursor-pointer"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="w-full grid grid-cols-12 lg:grid-cols-12 px-3 py-3 border-b border-(--border) gap-1">
          <div className="flex gap-2 items-center text-[0.55rem] tracking-wider lg:col-span-2 col-span-3">
            <span className="lg:block hidden p-2 rounded-md bg-orange-100">
              <CiCalendar className="text-orange-600" />
            </span>

            <div className="flex flex-col text-amber-900 font-bold">
              <span className="truncate">
                {format(el.createdAt, "d MMM, yyyy")}
              </span>
              <span>{format(el.createdAt, "hh:mm aa")}</span>
            </div>
          </div>

          <p className="col-span-2 lg:col-span-1 text-[0.60rem] lg:text-sm flex items-center">
            {Math.round(el?.duration) || ""} min
          </p>

          <p className="col-span-3 lg:col-span-4 text-[0.60rem] lg:text-sm text-left hyphens-auto">
            {formatName(el?.studentName)}
          </p>

          <p className="col-span-3 lg:col-span-4 text-[0.60rem] lg:text-sm text-left hyphens-auto">
            {formatName(el?.teacherName)}
          </p>
          <p
            className={`lg:block hidden text-[0.60rem] lg:text-sm text-left font-bold ${el.evaluationStatus === "pending" ? "text-blue-500" : "text-green-500"}`}
          >
            {el?.evaluationStatus}
          </p>
          

          <button className="flex items-center text-xs justify-end lg:hidden">
            <IoIosArrowDown
              className={`${isExpand && "rotate-180"} duration-300 ease-in-out`}
            />
          </button>
        </div>

        {isExpand && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex flex-col items-center py-3 px-3 gap-4"
          >
            {/* AUDIO */}
            <div className="w-full">
              {/* Desktop */}
              <div className="lg:flex hidden w-full items-center gap-2">
                <audio
                  ref={audioRef}
                  src={el.audio}
                  className="w-full rounded-md"
                  controls
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => (audioRef.current.currentTime -= 5)}
                    className="bg-(--primary) text-white p-2 rounded-md hover:cursor-pointer duration-300 ease-in-out transition-all hover:bg-(--primary-light)"
                  >
                    <TbRewindBackward5 className="text-xl" />
                  </button>

                  <button
                    onClick={() => (audioRef.current.currentTime += 5)}
                    className="bg-(--primary) text-white p-2 rounded-md hover:cursor-pointer duration-300 ease-in-out transition-all hover:bg-(--primary-light)"
                  >
                    <TbRewindForward5 className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex flex-col items-center lg:hidden w-full gap-2">
                <audio
                  ref={audioRef}
                  src={el.audio}
                  className="w-full rounded-md"
                  controls
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => (audioRef.current.currentTime -= 5)}
                    className="bg-gray-700 text-white p-2 rounded-md hover:cursor-pointer duration-300 ease-in-out transition-all"
                  >
                    <TbRewindBackward5 className="text-xl" />
                  </button>

                  <button
                    onClick={() => (audioRef.current.currentTime += 5)}
                    className="bg-gray-700 text-white p-2 rounded-md hover:cursor-pointer duration-300 ease-in-out transition-all"
                  >
                    <TbRewindForward5 className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {/* EVALUATION */}
            {(el?.evaluationStatus !== "evaluated" && role === 'admin') && (
              <EvaluationForm id={el?._id} />
            )}
            {(el?.evaluationStatus === "evaluated" && role === 'admin') && (
              <EvaluationResult el={el}/>
            )}
          </div>
        )}
      </div>
    );
    if(isDummy)return (
      <div className="w-full">
        <div className="w-full grid grid-cols-11 px-3 py-2 border-(--border)">
          {/* <p>{(page - 1) * 10 + index + 1}</p> */}
          <p className=" text-xs opacity-0">1</p>
          <p className="text-xs tracking-wider col-span-3">
            
          </p>
          <p className=" col-span-3 text-xs text-left"></p>
          <p className=" col-span-3 text-xs text-left"></p>
          <button
            // onClick={() => setIsExpand(!isExpand)}
            className="text-xs flex justify-center"
          >
            
          </button>
        </div>
      </div>
    );
}

export default RecordingEntry


function EvaluationForm({id}){
  const querClient = useQueryClient();

  const [data,setData] = useState({totalTalqeen:"",talqeenMissed:"",makharijMissed:"",hifzGrade:"",makharijGrade:"",remarks:''});
  function handleSetData(key,value){
    setData(val => {
      return {...val,[key]:value};
    })
  }

  useEffect(() => {
    if(!data.talqeenMissed || !data.totalTalqeen) {
      setData(el => {return {...el,hifzGrade:""}});
      return;
    };
    console.log('isInfinite');
    let grade = "";
    const percentageMissed = Math.round((data.talqeenMissed / data.totalTalqeen) * 100);
    console.log(percentageMissed)
    if (percentageMissed < 10) grade = "A+";
    if (percentageMissed >= 10 && percentageMissed < 20) grade = "A";
    if (percentageMissed >= 20 && percentageMissed < 30) grade = "B+";
    if (percentageMissed >= 30 && percentageMissed < 40) grade = "B";
    if (percentageMissed >= 40) grade = "D";
    console.log(grade);
    setData(el => {return {...el,hifzGrade:grade}});

  },[data.totalTalqeen,data.talqeenMissed])

  useEffect(() => {
    if(!data.makharijMissed) {
      setData(el => {return {...el,makharijGrade:""}});
      return;
    };
    console.log('isInfinite');
    let grade = ""; 
    const missed = data.makharijMissed.trim().split(' ').length;

    console.log(missed)
    if (missed === 0) grade = "A+";
    if (missed === 1) grade = "A";
    if (missed === 2) grade = "B";
    if (missed === 3) grade = "C";
    if (missed > 3) grade = "D";
    
    
    setData(el => {return {...el,makharijGrade:grade}});

  },[data.makharijMissed])

  async function handleSubmit(e){
    e.preventDefault();
    const toastId = 'evaluation';
    try{
      toast.loading('Updating...',{id:toastId});
      await axios.patch(`${process.env.NEXT_PUBLIC_URL}/recording/evaluate/${id}`,{data},{withCredentials:true});
      toast.success('evaluation completed',{id:toastId});
      querClient.invalidateQueries({queryKey:['recordings']});
    }catch(err){
      console.log(err);
      toast.error('failed to update evaluation status.',{id:toastId});
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl bg-(--card) border border-(--border) p-4"
    >
      <div className="flex items-center gap-1 mb-6 text-amber-800 font-bold">
        <LuInfo />{" "}
        <p className="text-xs">
          please do not enter comma or any special character in makharij missed
          field, enter makharij with only space in between.
        </p>
      </div>
      <div className="lg:grid grid-cols-5 flex flex-col gap-5">
        {/* Makharij */}

        {/* Tajweed */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            Total Talqeen
            <LuInfo className="text-gray-400" size={14} />
          </label>

          <input
            onChange={(e) => handleSetData("totalTalqeen", e.target.value)}
            value={data.totalTalqeen}
            required
            type="number"
            placeholder="Enter number of total talqeen"
            className="w-full rounded-lg border border-gray-500 bg-(--card) px-3 py-2.5 text-sm outline-none focus:border-(--primary) placeholder:text-xs"
          />
        </div>
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            Talqeen missed
            <LuInfo className="text-gray-400" size={14} />
          </label>

          <input
            onChange={(e) => handleSetData("talqeenMissed", e.target.value)}
            value={data.talqeenMissed}
            disabled={data.totalTalqeen ? false : true}
            max={Number(data.totalTalqeen)}
            required
            type="number"
            placeholder="Enter number of talqeen missed"
            className="w-full rounded-lg border border-gray-500 bg-(--card) px-3 py-2.5 text-sm outline-none focus:border-(--primary) placeholder:text-xs"
          />
        </div>

        {/* Overall */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            Makharij missed
            <LuInfo className="text-gray-400" size={14} />
          </label>

          <input
            onChange={(e) => handleSetData("makharijMissed", e.target.value)}
            value={data.makharijMissed}
            required
            min="0"
            max="10"
            placeholder="e.g. ص، س، ض، ح، خ، ع، ت"
            className="w-full rounded-lg border border-gray-500 bg-(--card) px-3 py-2.5 text-sm outline-none focus:border-(--primary) placeholder:text-xs"
          />
        </div>
        <div className="">
          <label className="mt-2 flex items-center gap-1.5 text-sm font-medium">
            Hifz Grade
            <LuInfo className="text-gray-400" size={14} />
          </label>

          <input
            disabled
            value={data.hifzGrade}
            onChange={(e) => handleSetData("hifzGrade", e.target.value)}
            required
            placeholder="Enter Talqeen, Grades will be calculated"
            className="disabled:cursor-not-allowed w-full rounded-lg border border-gray-500 bg-(--card) px-3 py-2.5 text-sm outline-none focus:border-(--primary) placeholder:text-xs"
          ></input>
        </div>
        <div className="">
          <label className="mt-2 flex items-center gap-1.5 text-sm font-medium">
            Makharij Grade
            <LuInfo className="text-gray-400" size={14} />
          </label>

          <input
            disabled
            value={data.makharijGrade}
            onChange={(e) => handleSetData("makharijGrade", e.target.value)}
            required
            placeholder="Enter Makharij, Grades will be calculated"
            className="disabled:cursor-not-allowed w-full rounded-lg border border-gray-500 bg-(--card) px-3 py-2.5 text-sm outline-none focus:border-(--primary) placeholder:text-xs"
          ></input>
        </div>
      </div>
      <div className="lg:w-1/2 mt-5 lg:mt-0">
        <label className="my-2 flex items-center gap-1.5 text-sm font-medium">
          Remarks
          <LuInfo className="text-gray-400" size={14} />
        </label>

        <textarea
          onChange={(e) => handleSetData("remarks", e.target.value)}
          required
          spellCheck="false"
          placeholder="Enter remarks..."
          className="w-full rounded-lg border border-gray-500 bg-(--card) px-3 py-2.5 text-sm outline-none focus:border-(--primary)"
        />
      </div>

      {/* Evaluate button */}
      <div className="flex justify-end mt-5">
        <button
          onClick={() => {
            // evaluate here
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--primary) text-white text-sm font-medium hover:opacity-90 transition-all duration-200"
        >
          Evaluated
          <LuCheck size={17} />
        </button>
      </div>
    </form>
  );
}

import {
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiStar,
  FiFileText,
} from "react-icons/fi";
import { el } from "date-fns/locale";

function EvaluationResult({el}) {
  return (
    <div className="flex lg:block flex-col gap-3 text-xs w-full mt-4 rounded-xl border border-[#eadfd2] bg-white p-5">
      {/* Evaluated heading */}
      <div className="mb-6 flex items-center gap-2 text-green-700">
        <FiCheckCircle size={24} />
        <span className="text-lg font-semibold">Evaluated</span>
      </div>

      {/* Evaluation details */}
      <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x divide-[#eadfd2]">
        {/* Evaluated By */}
        <div className="flex gap-4 px-4 py-2 lg:first:pl-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <FiUser size={22} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Evaluated by</p>
            <p className="mt-1 text-[15px] font-medium text-gray-900">
              {el.evaluatedBy}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex gap-4 px-4 py-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <FiCalendar size={22} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Date</p>
            <p className="mt-1 text-[15px] font-medium text-gray-900">
              {format(el.evaluationDate, "dd MMM, yyyy")}
            </p>
            <p className="text-sm text-gray-500">
              {format(el.evaluationDate, "hh:mm a")}
            </p>
          </div>
        </div>

        {/* Grade */}
        <div className="flex gap-4 px-4 py-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <FiStar size={22} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Grade</p>

            <div className="mt-1 fle items-center gap-2">
              <div className="flex items-center gap-2">
                hifz
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 font-bold text-green-700">
                  {el.hifzGrade}
                </span>
              </div>
              <div className="flex items-center gap-2">
                Makharij
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 font-bold text-green-700">
                  {el.makharijGrade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-4 px-4 py-2 lg:last:pr-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <FiFileText size={22} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Details</p>

            <div className="mt-1 space-y-1  text-gray-900 text-xs">
              <p>
                <span className="font-medium">Makharij:</span>{" "}
                {el.makharijMissed}
              </p>

              <p>
                <span className="font-mediu">talqeen missed:</span>{" "}
                {el.talqeenMissed}
              </p>

              <p>
                <span className="font-mediu">remarks:</span> {el.remarks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
