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
import { useRef } from "react";
function SubmitRecording({
  studentId,
  studentName,
  audioSize,
  clientAudioUrl,
  submitRecording,
  isSubmitting,
  setOnlineClassBlobUrl,
  setOnlineClassBlob,
  setIsRecorded,
  setClientAudioUrl,
  setAudio,
  setTotalSeconds,
  setIsPause,
  setIsRecording,
  setvideoCallSeconds,
  audioChunks,
}) {
  const audioRef = useRef(null);
  const formattedName = formatName(studentName);
  return (
    <div className="my-auto flex w-full flex-col gap-5 rounded-3xl border border-(--border) bg-(--card) px-5 py-7 shadow-(--shadow-lg) lg:w-1/2 lg:mx-auto">
      {/* Success / Student */}
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <FaCircleCheck className="text-[3.2rem] text-emerald-500" />
        </div>

        <h1 className="text-xl font-bold tracking-tight">
          Class recorded successfully!
        </h1>

        

        <p className=" mt-4 max-w-full px-3 font-bold text-amber-800">
          {formattedName}
        </p>
      </div>

      {/* Audio */}
      <div className="rounded-2xl border border-(--border)/60 bg-white/60 p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
            {/* <TbWaveform className="text-xl text-amber-800" /> */} <PiWaveform className="text-xl text-amber-800"/>
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
      <div className="rounded-2xl border border-(--border)/60 bg-white/60">
        <div className="flex items-center gap-2 border-b border-(--border)/60 px-4 py-3">
          <IoInformationCircleOutline className="text-xl text-amber-800" />

          <p className="text-sm font-bold">Recording Details</p>
        </div>

        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100">
              <IoIosCloudUpload className="text-lg text-stone-600" />
            </div>

            <div>
              <p className="text-sm font-medium">File size</p>

              <p className="text-[11px] text-stone-500">Audio recording</p>
            </div>
          </div>

          <p className="text-sm font-bold">
            {Number((audioSize / 1024 / 1024).toFixed(1))} MB
          </p>
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
          onClick={() => submitRecording(studentId, formatName(studentName))}
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
