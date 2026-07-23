'use client';
import useAudioRecorder from "@/app/_hooks/useAudioRecorder";
import Link from "next/link";
import { useState } from "react";
import { BsBrowserChrome } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineSocialDistance } from "react-icons/md";
import { PiRecordFill } from "react-icons/pi";

function StartRecording({startRecording,studentName}) {
  const [audioConfig,setAudioConfig] = useState({ns:false,ec:false,agc:false,loudness:1});
    // const {actions:{startRecording}} = useAudioRecorder();
    return (
      <div>
        <div className=" flex items-center gap-1 text-sm text-(--text) mb-2">
          <button className="shadow-(--shadow-md) bg-(--card) rounded-lg p-2">
            <Link href={"/students"} className="">
              <IoMdArrowRoundBack />
            </Link>
          </button>
          Back
        </div>
        <div className=" flex flex-col items-center gap-6  py-3 px-5  h-ful rounded-2xl shadow-(--shadow-xl)">
          <div className="bg-(--card w-full py-4 rounded-lg hadow-(--shadow-lg)">
            <div className="flex flex-col items-center ">
              <header className="font-bold text-lg text-(--text)">
                Start Recording Class of
              </header>
              <h1 className="font-bold my-2 text-center text-(--text-secondary)">
                {" "}
                {studentName
                  .split(" ")
                  .slice(1, studentName.split(" ").length)
                  .join(" ")}
              </h1>
            </div>
            <div className="border border-(--border) shadow-2xl rounded-full p-4 bg-(--layer) w-fit mx-auto">
              <div className="borde border-(--text-muted) bg-(--bg-main)/50 shadow-l rounded-full w-fit p-8">
                <FaMicrophoneLines className="text-5xl text-amber-900" />
              </div>
            </div>
          </div>

          <div className="shadow-(--shadow-lg) text-(--text) bg-(--bg-tertiary)/50 border border-(--border) w-full rounded-2xl px-4 py-5">
            <div className="flex items-center gap-1 text-sm text-amber-800 font-bold tracking-wide">
              <IoInformationCircleOutline className="text-lg" />
              <p>Before you start</p>
            </div>

            <div className="mt-3 flex flex-col gap-3 ">
              <div className="flex items-center gap-3 border-b border-(--border) pb-3 ">
                <span className="border border-(--border) shadow rounded-md p-2 text-white/90 bg-(image:--gradient-soft)">
                  <BsBrowserChrome className="text-xl" />
                </span>
                <p className="text-xs font-semibold">
                  do not keep browser in background for more than 30 seconds
                </p>
              </div>
              <div className="flex items-center gap-3 border-b border-(--border) pb-3 ">
                <span className="border border-(--border) shadow rounded-md p-2 text-white/90 bg-(image:--gradient-soft)">
                  <MdOutlineSocialDistance className="text-lg" />
                </span>
                <p className="text-xs font-semibold">
                  keep phone close to the reciter
                </p>
              </div>
              <div className="flex items-center gap-3 border-b border-(--border) pb-3 ">
                <span className="border border-(--border) shadow rounded-md p-2 text-white/90 bg-(image:--gradient-soft)">
                  <FaHeart className="text-lg" />
                </span>
                <p className="text-xs font-semibold">
                  Listen with your heart not just with your ears
                </p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <button
              onClick={() => startRecording(audioConfig.loudness)}
              className="flex items-center gap-2 justify-center bg-(--primary) text-white shadow-lg py-4 rounded-md w-full"
            >
              <PiRecordFill />
              Start Recording
            </button>
            {/* <div className="flex items-center gap-1 text-xs mt-3">
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
            </div> */}
            <div className="flex items-center gap-1 text-xs mt-1">
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
            </div>
          </div>
        </div>
      </div>
    );
}

export default StartRecording
