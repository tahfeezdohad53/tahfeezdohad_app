"use client";
import useAudioRecorder from "@/app/_hooks/useAudioRecorder";
import { formatName } from "@/helpers";
import Link from "next/link";
import { useState } from "react";
import { BsBrowserChrome, BsExclamationCircle } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineSocialDistance } from "react-icons/md";
import { PiRecordFill } from "react-icons/pi";

function StartRecording({ startRecording, studentName,classType,setClassType }) {
  const [audioConfig, setAudioConfig] = useState({
    ns: false,
    ec: false,
    agc: false,
    loudness: 1,
  });
  const formattedName = formatName(studentName);
  
  // const {actions:{startRecording}} = useAudioRecorder();
  return (
    <div className="w-full">
      <div className="flex items-center gap-1 text-sm text-(--text) mb-2">
        <button className="shadow-(--shadow-md) bg-(--card) rounded-lg p-2">
          <Link href={"/students"}>
            <IoMdArrowRoundBack />
          </Link>
        </button>
        Back
      </div>

      <div className="flex flex-col items-center gap-6 lg:w-full lg:mx-auto px-5 h-fit py-5 rounded-2xl shadow-(--shadow-xl)">
        {/* Student */}
        <div className="border border-(--border) w-full py-4 rounded-lg shadow-(--shadow-lg)">
          <div className="flex flex-col items-center">
            <header className="font-bold text-sm text-(--text)">
              Start Recording Class of
            </header>

            <h1 className="font-bold text-sm my-2 text-center text-(--text-secondary)">
              {formattedName}
            </h1>
          </div>

          <div className="border border-(--border) shadow-2xl rounded-full p-3 bg-(--layer) w-fit mx-auto">
            <div className="borde border-(--text-muted) bg-(--bg-main)/50 shadow-(--shadow-lg) rounded-full w-fit p-6">
              <FaMicrophoneLines className="text-2xl text-amber-900" />
            </div>
          </div>
        </div>

        {/* Class Type */}
        <div className="w-full">
          <p className="text-sm font-bold text-(--text) mb-3">
            Select Class Type
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Jadeed", value: "jd" },
              { label: "Juzhaali-Muraja'ah", value: "jz-mj" },
              { label: "Muraja'ah", value: "mj" },
              { label: "Juzhaali", value: "jz" },
              { label: "Tasmee 1", value: "t1" },
              { label: "Tasmee 2", value: "t2" },
              { label: "Tasmee 3", value: "t3" },
              { label: "Tasmee 4", value: "t4" },
              { label: "Tasmee 5", value: "t5" },
              { label: "Tamreen", value: "tm" },
            ].map(({ label, value }) => (
              <button
                key={value}
                type="button"
                className={`py-3 px-3 rounded-lg border font-semibold text-sm transition-all ${
                  classType === value
                    ? "bg-(--primary) text-white border-(--primary) shadow-md"
                    : "bg-(--card) text-(--text) border-(--border) hover:bg-(--bg-tertiary)"
                }`}
                onClick={() => setClassType(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 flex items-center gap-3">
            <BsExclamationCircle />
            please select jadeed if you are taking full class.
          </p>
        </div>

        {/* Before you start */}
        {/* <div className="shadow-(--shadow-lg) text-(--text) bg-(--bg-tertiary)/50 border border-(--border) w-full rounded-2xl px-4 py-5">
          <div className="flex items-center gap-1 text-sm text-amber-800 font-bold tracking-wide">
            <IoInformationCircleOutline className="text-lg" />
            <p>Before you start</p>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-3 border-b border-(--border) pb-3">
              <span className="border border-(--border) shadow rounded-md p-2 text-white/90 bg-(image:--gradient-soft)">
                <BsBrowserChrome className="text-xl" />
              </span>

              <p className="text-xs font-semibold">
                do not keep browser in background for more than 30 seconds.
              </p>
            </div>

            <div className="flex items-center gap-3 border-b border-(--border) pb-3">
              <span className="border border-(--border) shadow rounded-md p-2 text-white/90 bg-(image:--gradient-soft)">
                <MdOutlineSocialDistance className="text-lg" />
              </span>

              <p className="text-xs font-semibold">
                keep phone close to the reciter.
              </p>
            </div>

            <div className="flex items-center gap-3 border-b border-(--border) pb-3">
              <span className="border border-(--border) shadow rounded-md p-2 text-white/90 bg-(image:--gradient-soft)">
                <FaHeart className="text-lg" />
              </span>

              <p className="text-xs font-semibold">
                Listen with your heart not just with ears.
              </p>
            </div>
          </div>
        </div> */}

        {/* Start Recording */}
        <div className="w-full">
          <button
            disabled={!classType}
            onClick={() => startRecording()}
            className="disabled:bg-(--primary-soft) flex items-center gap-2 justify-center bg-(--primary) text-white shadow-lg py-4 rounded-md w-full"
          >
            <PiRecordFill />
            Start Recording
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartRecording;
{
  /* <div className="flex items-center gap-1 text-xs mt-3">
              <input checked={audioConfig.ns} onChange={(e) => setAudioConfig(old => {
                return {...old,ns:e.target.checked}
              })} id="ns" type="checkbox" />
              <label htmlFor="ns">Background noise suppression</label>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <input checked={audioConfig.ec} onChange={(e) => setAudioConfig(old => {
                return {...old,ec:e.target.checked}
              })} id="ec" type="checkbox" />
              <label htmlFor="ec">Echo cancellation</label>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <input checked={audioConfig.agc} onChange={(e) => setAudioConfig(old => {
                return {...old,agc:e.target.checked}
              })} id="agc" type="checkbox" />
              <label htmlFor="agc">
                AGC{" "}
                <span className="text-gray-600 text-[0.65rem]">
                  (adjusts mic loudness based on reciter&apos;s loudness)
                </span>
              </label>
            </div> */
}
{
  /* <div className="flex items-center gap-1 text-xs mt-3">
              <input value={1} checked={audioConfig.loudness === 1} onChange={(e) => setAudioConfig(old => {
                return {...old,loudness:1}
              })} id="loudness" name="loudness" type="radio" />
              <label htmlFor="loudness">
                Loudness
                <span className="text-gray-600 text-[0.65rem]">
                  (loudness is default at normal 100% )
                </span>
              </label>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <input  checked={audioConfig.loudness === 1.5} onChange={(e) => setAudioConfig(old => {
                return {...old,loudness:1.5}
              })} id="loudness-50" name="loudness" type="radio" />
              <label htmlFor="loudness-50">
                Loudness
                <span className="text-gray-600 text-[0.65rem]">
                  (loudness increase by 50% )
                </span>
              </label>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <input  checked={audioConfig.loudness === 2} onChange={(e) => setAudioConfig(old => {
                return {...old,loudness:2}
              })} id="loudness-100" name="loudness" type="radio" />
              <label htmlFor="loudness-100">
                Loudness
                <span className="text-gray-600 text-[0.65rem]">
                  (loudness is increased by 100% , 2x)
                </span>
              </label>
            </div> */
}