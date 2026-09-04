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
import { FiBookOpen, FiFileText, FiEdit3, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
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
      {/* Header */}

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto rounded-[28px] bg-(--card) p-5 sm:p-7 shadow-(--shadow-xl)">
        {/* Recording Card */}
        <div className="relative w-full rounded-[24px] border border-(--border) bg-(--bg-main)/40 px-2 py-3 sm:px-8 sm:py-12">
      <div className="flex items-center gap-4 mb-2">
        <Link
          href="/students"
          className="absolute left-2 top-2 flex items-center justify-center w-8 h-8  text-(--text)"
        >
          <IoMdArrowRoundBack className="text-xl" />
        </Link>
      </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-bold text-(--text)">
              Start Recording Class of
            </p>

            <h1 className="text-sm font-bold text-(--primary) mt-3">
              {formattedName}
            </h1>

            {/* Microphone */}
            <div className="mt-5 flex items-center justify-center w-[130px] h-[130px] rounded-full border border-(--border) bg-(--card) shadow-xl">
              <button onClick={() => {
                if(!classType) return toast.error('please select class type first');
                startRecording();
              }} className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-(--primary) shadow-lg">
                <FaMicrophoneLines className="text-4xl text-white" />
              </button>
            </div>

            <p className="text-base text-(--text-secondary) mt-7">
              Tap to start recording
            </p>
          </div>
        </div>

        {/* Class Type */}
        {/* Class Type */}
        <div className="w-full mt-9">
          <p className="text-xl font-bold text-(--text) mb-5">
            Select Class Type
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Jadeed",
                value: "jd",
                icon: <FiBookOpen />,
              },
              {
                label: "Juz/Mur",
                value: "jz-mj",
                icon: <FiBookOpen />,
              },
              {
                label: "Muraja'ah",
                value: "mj",
                icon: <FiBookOpen />,
              },
              {
                label: "Juzhaali",
                value: "jz",
                icon: <FiBookOpen />,
              },
              {
                label: "Tasmee 1",
                value: "t1",
                icon: <FiFileText />,
              },
              {
                label: "Tasmee 2",
                value: "t2",
                icon: <FiFileText />,
              },
              {
                label: "Tasmee 3",
                value: "t3",
                icon: <FiFileText />,
              },
              {
                label: "Tasmee 4",
                value: "t4",
                icon: <FiFileText />,
              },
              {
                label: "Tasmee 5",
                value: "t5",
                icon: <FiFileText />,
              },
              {
                label: "Tamreen",
                value: "tm",
                icon: <FiEdit3 />,
              },
            ].map(({ label, value, icon }) => {
              const selected = classType === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setClassType(value)}
                  className={`
            relative
            flex
            items-center
            gap-2
            py-1
            px-4
            rounded-xl
            border
            
            text-left
            transition-all
            ${
              selected
                ? "border-transparent shadow-md bg-(--bg-tertiary)/40"
                : "border-(--border) hover:shadow-md bg-(--card)"
            }
          `}
                >
                  {/* Icon */}
                  <div
                    className={`
              flex
              items-center
              justify-center
              w-11
              h-11
              rounded-xl
              shrink-0
              text-xl
              ${selected ? "text-(--primary)" : "text-(--text-secondary)"}
            `}
                  >
                    {icon}
                  </div>

                  {/* Label */}
                  <span className="text-sm sm:text-base font-semibold text-(--text)">
                    {label}
                  </span>

                  {/* Selected Checkmark */}
                  {selected && (
                    <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-(--primary) text-white shadow-md">
                      <FiCheck className="text-base" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="flex items-center gap-3 mt-5 px-4 py-4 rounded-2xl bg-(--bg-tertiary)/70">
            <BsExclamationCircle className="text-lg text-(--primary) shrink-0" />

            <p className="text-xs text-(--text-secondary)">
              Please select{" "}
              <span className="font-semibold text-(--text)">Jadeed</span> if you
              are taking a full class.
            </p>
          </div>
        </div>

        {/* Start Recording */}
        {/* <div className="w-full mt-7">
          <button
            disabled={!classType}
            onClick={() => startRecording()}
            className="
          flex
          items-center
          justify-center
          gap-3
          w-full
          py-5
          rounded-2xl
          bg-(--primary)
          text-white
          text-lg
          font-semibold
          shadow-lg
          transition-all
          hover:shadow-xl
          disabled:bg-(--primary-soft)
          disabled:cursor-not-allowed
        "
          >
            <PiRecordFill className="text-2xl" />
            Start Recording
          </button>
        </div> */}
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