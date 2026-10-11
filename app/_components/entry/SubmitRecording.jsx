"use client";
import { FaCircleCheck } from "react-icons/fa6";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { IoInformationCircleOutline, IoTrash } from "react-icons/io5";
import { PiStudentFill, PiWaveform } from "react-icons/pi";
import { IoIosCloudUpload, IoMdCloudUpload, IoMdLock } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { formatName } from "@/helpers";
import {
  TbRewindBackward5,
  TbRewindForward5,
  
} from "react-icons/tb";
import { useRef, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { CiCircleInfo } from "react-icons/ci";
import { FaBookOpen } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi2";

const ahkaamArr = [
  { name: "Ghunna", arabic: "غُنَّة" },
  { name: "Qalqalah", arabic: "قَلْقَلَة" },
  { name: "Izhar", arabic: "إِظْهَار" },
  { name: "Idgham", arabic: "إِدْغَام" },
  { name: "Iqlab", arabic: "إِقْلَاب" },
  { name: "Ikhfa", arabic: "إِخْفَاء" },
  {
    name: "Harakaat Zaa'idah",
    arabic: "حَرَكَات زَائِدَة",
  },
  {
    name: "Ahkaam ur Raa",
    arabic: "أَحْكَامُ الرَّاءِ",
  },
  {
    name: "Tahreek us Saakin",
    arabic: "تَحْرِيكُ السَّاكِنِ",
  },
  {
  name: "Ism ul Jalalah",
  arabic: "اسم الجلالة"
},
  { name: "Madd Tabee'i", arabic: "مَدّ طَبِيعِي" },
  { name: "Madd Lazim", arabic: "مَدّ لَازِم" },
  { name: "Madd Muttasil", arabic: "مَدّ مُتَّصِل" },
  { name: "Madd Munfasil", arabic: "مَدّ مُنْفَصِل" },
  { name: "Madd Aarid", arabic: "مَدّ عَارِض لِلسُّكُون" },
  { name: "Madd Badal", arabic: "مَدّ بَدَل" },
];

const huroofArr = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
];
function SubmitRecording({
  studentId,
  studentName,
  audioSize,
  clientAudioUrl,
  submitRecording,
  isSubmitting,
  setIsRecorded,
  setClientAudioUrl,
  setAudio,
  setTotalSeconds,
  setIsPause,
  setIsRecording,
}) {
  const audioRef = useRef(null);
  const formattedName = formatName(studentName);
  const [remarks,setRemarks] = useState('');
  const [ahkaam,setAhkaam] = useState([]);
  const [huroof,sethuroof] = useState([]);
  return (
    <div className="my-auto flex w-full flex-col gap-5 rounded-3xl border border-(--border) bg-(--card) px-5 py-5 shadow-(--shadow-lg) lg:w-1/2 lg:mx-auto">
      {/* Success / Student */}
      <div className="flex flex-col items-center text-center pb-3">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <FaCircleCheck className="text-[3.2rem] text-emerald-500" />
        </div>

        <h1 className="text-xl font-bold tracking-tight">
          Class recorded successfully!
        </h1>

        <p className=" mt-1 max-w-full px-3 font-bold text-amber-800">
          {formattedName}
        </p>
      </div>

      {/* Audio */}
      <div className="rounded-2xl border border-(--border)/60 bg-white/60 p-4 flex flex-col gap-2">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
            {/* <TbWaveform className="text-xl text-amber-800" /> */}{" "}
            <PiWaveform className="text-xl text-amber-800" />
          </div>

          <div>
            <p className="text-sm font-bold">Recorded Audio</p>

            <p className="text-[11px] text-stone-500">
              You can review your recording
            </p>
          </div>
        </div>

        {/* Native audio player */}
        <audio
          ref={audioRef}
          src={clientAudioUrl || null}
          controls
          className="w-full"
        />

        {/* Skip controls */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = Math.max(
                0,
                audioRef.current.currentTime - 5,
              );
            }}
            className="
          flex items-center justify-center gap-2
          rounded-xl border border-amber-200
          bg-transparent py-3
          text-sm font-semibold text-amber-800
          transition-all duration-200
          hover:bg-amber-50
          active:scale-[0.98]
        "
          >
            <TbRewindBackward5 className="text-xl" />5 sec
          </button>

          <button
            type="button"
            onClick={() => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = Math.min(
                audioRef.current.duration || Infinity,
                audioRef.current.currentTime + 5,
              );
            }}
            className="
          flex items-center justify-center gap-2
          rounded-xl border border-amber-200
          bg-transparent py-3
          text-sm font-semibold text-amber-800
          transition-all duration-200
          hover:bg-amber-50
          active:scale-[0.98]
        "
          >
            5 sec
            <TbRewindForward5 className="text-xl" />
          </button>
        </div>
      </div>

      {/* Recording Details */}
      <div className="w-full">

        <div className="flex items-center text-xs gap-2 mb-2   py-2 rounded-md px-2">
          <div className="p-2 bg-blue-50 rounded-md">
            <LuClipboardList className="text-xl text-blue-600" />
          </div>
          <div>
            <p className=" tracking-wide text-xs font-bold">
              Remarks{" "}
              <span className="text-[0.60rem] text-gray-500">(optional)</span>
            </p>
            <div className="flex items-center">
              {/* <CiCircleInfo /> */}
              <p className="text-gray-500 tracking-wide text-[0.60rem]">
                This remarks will be sent to the student's parent via email.
              </p>
            </div>
          </div>
        </div>
        <div className="border border-gray-100 rounded-md p-3">
          <p className="text-xs ml-1 mb-1 font-bold">Write Remarks</p>
          <textarea
            spellCheck={false}
            onChange={(e) => setRemarks(e.target.value)}
            value={remarks}
            placeholder="Enter any remarks..."
            rows={4}
            name=""
            id=""
            className="focus:outline-1 outline-amber-800 p-2 px-3 rounded-md border border-(--border)/60 bg-white/60 font-semibold tracking-wider text-xs w-full"
          ></textarea>

          <hr className=" text-gray-200 my-3" />

          <div className="flex items-center text-xs gap-2 mb-2   py-2 rounded-md px-2">
            <div className="p-2 bg-blue-50 rounded-md">
              <HiOutlineBookOpen className="text-xl text-blue-600" />
            </div>
            <div>
              <p className=" tracking-wide text-xs font-bold">Ahkaam </p>
              <div className="flex items-center">
                {/* <CiCircleInfo /> */}
                <p className="text-gray-500 tracking-wide text-[0.60rem]">
                  Select the Ahkaam that need attention
                </p>
              </div>
            </div>
          </div>
          <div className="flex  flex-wrap gap-3">
            {ahkaamArr.map(el => {
              return (
                <button onClick={() => setAhkaam(ahkaams => {
                  if(ahkaams.includes(el.arabic)) return ahkaams.filter(el2 => el2 !== el.arabic);
                  else return [...ahkaams,el.arabic];
                })} key={el.arabic} className="border border-gray-300 flex items-center rounded-md gap-3 px-3 py-1">
                  <input type="checkbox" readOnly checked={ahkaam.includes(el.arabic)}/>
                  {el.arabic}
                </button>
              );
            })}
          </div>

          <hr className=" text-gray-200 my-3" />

          <div className="flex items-center text-xs gap-2 mb-2   py-2 rounded-md px-2">
            <div className="p-2 bg-blue-50 rounded-md">
              <HiOutlineBookOpen className="text-xl text-blue-600" />
            </div>
            <div>
              <p className=" tracking-wide text-xs font-bold">Makharij </p>
              <div className="flex items-center">
                {/* <CiCircleInfo /> */}
                <p className="text-gray-500 tracking-wide text-[0.60rem]">
                  Select the Huroof that need attention
                </p>
              </div>
            </div>
          </div>
          <div className="flex  flex-wrap gap-3">
            {huroofArr.map(el => {
              return (
                <button onClick={() => {
                  sethuroof(preHuroof => {
                    if(preHuroof.includes(el)) return preHuroof.filter(filteredPreHuroof => filteredPreHuroof !== el);
                    else return [...preHuroof,el];
                  })
                }} key={el} className="border border-gray-300 flex items-center rounded-md gap-3 px-3 py-1">
                  <input type="checkbox" readOnly checked={huroof.includes(el)}/>
                  {el}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          disabled={isSubmitting}
          onClick={() => {
            const discard = confirm(
              "Are you sure you want to discard recording?",
            );

            if (!discard) return;

            setAudio?.(null);
            setClientAudioUrl?.("");
            setIsRecorded?.(false);
            setTotalSeconds?.(0);
            setIsPause?.(false);
            setIsRecording?.(false);
          }}
          className="
        flex items-center justify-center gap-2
        rounded-xl border border-red-200
        bg-red-50
        py-4
        text-sm font-semibold text-red-500
        transition-all duration-200
        hover:bg-red-100
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
        >
          <IoTrash className="text-lg" />
          Discard
        </button>

        <button
          disabled={isSubmitting}
          onClick={() =>
            submitRecording(studentId, formatName(studentName), remarks,huroof,ahkaam)
          }
          className="
        relative flex items-center justify-center gap-2
        rounded-xl
        bg-(image:--gradient-primary)
        py-4
        text-sm font-semibold text-white
        shadow-(--shadow-md)
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-(--shadow-lg)
        active:translate-y-0
        disabled:cursor-not-allowed
        disabled:opacity-80
      "
        >
          <p
            className={`flex items-center gap-2 ${
              isSubmitting ? "opacity-0" : ""
            }`}
          >
            <IoMdCloudUpload className="text-lg" />
            Submit
          </p>

          {isSubmitting && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <ImSpinner2 className="animate-spin text-lg" />
            </span>
          )}
        </button>
      </div>

      {/* Privacy note */}
      <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-stone-500">
        <IoMdLock className="text-sm" />
        <span>Your recording is secure and private</span>
      </div>
    </div>
  );
}

export default SubmitRecording;
