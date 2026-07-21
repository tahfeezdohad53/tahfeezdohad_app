"use client";

import { FaCircleCheck } from "react-icons/fa6";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { IoInformationCircleOutline, IoTrash } from "react-icons/io5";
import { IoIosCloudUpload, IoMdCloudUpload } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { AiOutlineExclamationCircle } from "react-icons/ai";

function SubmitVideoCallRecording({
  onlineClassBlob,
  onlineClassBlobUrl,
  onlineClassBlobUrlSize,
  setOnlineClassBlob,
  setOnlineClassBlobUrl,
  setVideoCallSeconds,
  studentId,
  setvideoCallSeconds,
  videoCallSeconds
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitVideoCallRecording() {
    setIsSubmitting(true);
     setOnlineClassBlob(null);
     setVideoCallSeconds(0);
     setOnlineClassBlobUrl("");
    const toastId = "uploading";
    toast.success("your recording will be submitted, do not close or refresh browser before success notification arrives", {
      icon: <AiOutlineExclamationCircle className="text-yellow-500 text-4xl"/>, duration:5000});
    try {
      // console.log(data.signedUrl)
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/recording/signedToken`,
        { withCredentials: true },
      );

      await axios.put(data.signedUrl, onlineClassBlob, {
        headers: {
          "Content-Type": "audio/webm",
        },
        // onUploadProgress: (progress) => {
        //   const percent = Math.round((progress.loaded * 100) / progress.total);

        //   toast.loading(`Uploading... ${percent}%`, {
        //     id: toastId,
        //   });
        // },
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/recording/create/${studentId}`,
        {
          isOnline: true,
          url: data.url,
          duration: videoCallSeconds / 60,
        },
        { withCredentials: true },
      );
      toast.success("recording submitted!");
     
    } catch (err) {
      console.log(err);
      toast.error("Upload failed!", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 rounded-2xl border-(--border) px-5 py-3">
      {/* Success Card */}
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border-(--border) bg-(--card) py-4 shadow-(--shadow-md)">
        <FaCircleCheck className="rounded-full text-5xl text-emerald-400 drop-shadow-2xl" />

        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold">Submit Class of</h1>
          <p className="font-bold text-amber-800">Student Name</p>
        </div>

        <p className="w-3/4 text-center text-xs text-stone-800">
          Your recording is done. You can review and submit now.
        </p>
      </div>

      {/* Audio Player */}
      <div className="flex w-full flex-col gap-3 rounded-2xl border-(--border) bg-(--card) px-5 py-4 shadow-(--shadow-lg)">
        <p className="self-start text-xs font-bold">Recorded Audio</p>

        <AudioPlayer
          autoPlay={false}
          customAdditionalControls={[]}
          src={onlineClassBlobUrl || null}
        />
      </div>

      {/* Recording Details */}
      <div className="flex w-full flex-col gap-3 rounded-2xl border-(--border) bg-(--card) px-5 py-4 shadow-(--shadow-md)">
        <div className="border-(--border) flex flex-col gap-1 border-b pb-3 text-sm font-bold tracking-wide">
          <div className="flex items-center gap-1 text-xs text-amber-800">
            <IoInformationCircleOutline className="text-lg" />
            <p>Recording Details</p>
          </div>

          <div className="mt-3 flex justify-between">
            <div className="flex items-center gap-1 text-xs">
              <IoIosCloudUpload />
              <p>Size</p>
            </div>

            <p className="text-xs">{onlineClassBlobUrlSize} MB</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full shadow-(--shadow-md)">
        <button
          disabled={isSubmitting}
          onClick={submitVideoCallRecording}
          className="relative flex items-center gap-2 justify-center hover:cursor-pointer hover:scale-102 ease-in-out duration-300 transition-all bg-(image:--gradient-primary) text-white shadow-lg py-4 rounded-md w-full"
        >
          <p
            className={`${isSubmitting && "opacity-0"} flex items-center gap-1`}
          >
            <IoMdCloudUpload />
            Submit Recording
          </p>
          {isSubmitting && (
            <span className=" absolute top-1/2 left-1/2 -translate-1/2 animate-spin">
              <ImSpinner2 />
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setOnlineClassBlob?.(null);
            setOnlineClassBlobUrl?.("");
            setvideoCallSeconds?.(0);
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-(image:--gradient-danger) py-4 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-102 hover:cursor-pointer"
        >
          <IoTrash />
          Discard
        </button>
      </div>
    </div>
  );
}

export default SubmitVideoCallRecording;
