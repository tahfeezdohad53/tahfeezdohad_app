'use client';
import { FaCircleCheck } from "react-icons/fa6";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { IoInformationCircleOutline, IoTrash } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";
import { IoIosCloudUpload, IoMdCloudUpload } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
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
  audioChunks
}) {
  return (
    <div className="flex justify-center flex-col items-center gap-6 order py-3 px-5 border-(--border) h-full rounded-2xl hadow-2xl">
      <div className="flex flex-col items-center gap-3 bg-(--card) w-full py-4 rounded-2xl shadow-(--shadow-md) order border-(--border)">
        <FaCircleCheck className="text-5xl text-emerald-400 drop-shadow-2xl rounded-full" />
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-xl">Submit Class of</h1>
          <p className="font-bold text-center text-amber-800">            {studentName.split(' ').slice(1,studentName.split(' ').length).join(' ')}
</p>
        </div>
        <p className="text-xs text-stone-800 w-3/4 text-center">
          Your recording is done. you can review and submit now.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 bg-(--card) w-full px-5 py-4 rounded-2xl shadow-(--shadow-lg) order border-(--border)">
        <p className="text-xs font-bold self-start">Recorded Audio</p>
        <AudioPlayer
          autoPlay={false}
          customAdditionalControls={[]}
          src={clientAudioUrl || null}
          onPlay={() => console.log("Playing")}
          className=""
        />
      </div>

      <div className="flex flex-col  gap-3 bg-(--card) w-full px-5 py-4 rounded-2xl shadow-(--shadow-md) order border-(--border)">
        <div className="flex flex-col gap-1 text-sm font-bold tracking-wide border-b border-(--border) pb-3">
          <div className="flex items-center gap-1 text-xs text-amber-800">
            <IoInformationCircleOutline className="text-lg" />
            <p>Recording Details</p>
          </div>
          <div className="mt-3 flex justify-between">
            <div className="flex items-center gap-1 text-xs">
              <IoIosCloudUpload />
              <p>Size</p>
            </div>
            <p className="text-xs">{audioSize} mb</p>
          </div>
        </div>
      </div>

      <div className="w-full shadow-(--shadow-md)">
        <button
          disabled={isSubmitting}
          onClick={() => submitRecording(studentId)}
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
          disabled={isSubmitting}
          onClick={() => {
            setAudio?.(null);
            setClientAudioUrl?.("");
            setIsRecorded?.(false);
            setTotalSeconds?.(0);
            setIsPause?.(false);
            setIsRecording?.(false);  
          }}
          className="relative flex items-center gap-2 justify-center bg-(image:--gradient-danger) mt-5 hover:cursor-pointer hover:scale-102 ease-in-out duration-300 transition-all text-white shadow-lg py-4 rounded-md w-full"
        >
          <p className={` flex items-center gap-1`}>
            <IoTrash />
            Discard
          </p>
        </button>
      </div>
    </div>
  );
}

export default SubmitRecording;
