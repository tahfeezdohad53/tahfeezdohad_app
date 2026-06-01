'use client';
import { Playfair_Display } from "next/font/google";
import { FaRegClock, FaUser, FaVideo } from "react-icons/fa"
import { SlCalender } from "react-icons/sl";
import { useCallingFn } from "../socket-listeners/Socket";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import SubmitRecording from "../entry/SubmitRecording";
import useAudioRecorder from "@/app/_hooks/useAudioRecorder";
import { useUser } from "../providers/UserProvider";

const font = Playfair_Display({
    subsets:['latin'],
    weight:['500','600','700']
})
function StudentWrapper({id}) {
    const {user} = useUser();
    const {startCall} = useCallingFn();
    const {onlineClassBlob,onlineClassBlobUrl,onlineClassBlobUrlSize} = useVideoCallContext();
    const {actions:{submitRecording},states:{isSubmitting}} = useAudioRecorder();
    if(!onlineClassBlob) return (
      <div className="mt-5 w-full flex flex-col gap-5 items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-(--bg-tertiary)/50">
            <FaUser className="text-4xl" />
          </div>
          <h1 className={`${font.className} text-2xl font-bold tracking-wide`}>
            Huzefa ratlam
          </h1>
        </div>
        <button onClick={() => startCall(id,user?._id)} className="flex gap-3 items-center w-full justify-center bg-purple-500 shadow-(--shadow-lg) py-4 rounded-lg text-white/90">
          <FaVideo /> Start video Call
        </button>

        <div className="flex w-full gap-6 items-center bg-(--card) rounded-md shadow-(--shadow-sm) p-5">
          <div className="p-3 rounded-full bg-yellow-100">
            <FaRegClock className="text-2xl text-yellow-500" />
          </div>
          <div className="text-(--text-secondary) text-xs font-semibold">
            <p>Last Session</p>
            <p className="text-lg text-(--text)">2 days ago</p>
            <p>May 18, 2025 ~ 30 min</p>
          </div>
        </div>
        <div className="bg-(--card) rounded-md shadow-(--shadow-sm) p-5 w-full flex flex-col gap-3">
          <p>Recent Sessions</p>
          <div className="flex w-full gap-6 items-center border-b border-(--border) pb-3">
            <div className="p-3 rounded-full bg-green-100">
              <SlCalender className="text-lg text-green-500" />
            </div>
            <div className="text-(--text-secondary) text-xs font-semibold flex justify-between w-full ">
              <p>May 18, 2025</p>
              <p>30 min</p>
            </div>
          </div>
          <div className="flex w-full gap-6 items-center border-b border-(--border) pb-3">
            <div className="p-3 rounded-full bg-green-100">
              <SlCalender className="text-lg text-green-500" />
            </div>
            <div className="text-(--text-secondary) text-xs font-semibold flex justify-between w-full ">
              <p>May 18, 2025</p>
              <p>30 min</p>
            </div>
          </div>
        </div>
      </div>
    );
    if(onlineClassBlob && user?.role !== 'student') return <SubmitRecording audioSize={onlineClassBlobUrlSize} clientAudioUrl={onlineClassBlobUrl} studentId={id} submitRecording={submitRecording} isSubmitting={isSubmitting}/>
}

export default StudentWrapper
