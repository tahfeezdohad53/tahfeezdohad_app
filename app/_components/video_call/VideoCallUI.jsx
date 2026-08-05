"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import { useCallingFn } from "../socket-listeners/Socket";
import { useSession } from "next-auth/react";
import Select from 'react-select';

import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
} from "react-icons/fi";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import Draggable from "react-draggable";
import { useUser } from "../providers/UserProvider";
import { BsFillRecordCircleFill } from "react-icons/bs";
import Modal from "../Modal";
import { FaGraduationCap, FaRegLightbulb } from "react-icons/fa";
import CustomSelect from "../Select";
import { useAppProvider } from "../providers/AppProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { HiXMark } from "react-icons/hi2";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { formatName } from "@/helpers";
function VideoCallUI() {
  const {user} = useUser();
  const videoRef = useRef(null);
  const {
    localVideoRef,
    setShowCallControls,
    showCallControls,
    localMedia,
    isCalling,
    isIncoming,
    isInCall,
    callerId,
    remoteVideoRef,
    setVideoCallSeconds,
    videoCallSeconds,
  } = useVideoCallContext();
  const {dummyAnsCall,acceptCall,endCall} = useCallingFn();
  const [isMute,setIsMute] = useState(false);
  const [isVideoOff,setIsVideoOff] = useState(false)
  const dragRef = useRef(null);
  const [showModal,setShowModal] = useState(false);
  useEffect(() => {
    if(!isInCall) return;
    const interval = setInterval(() => {
      setVideoCallSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isInCall]);

  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const mins = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const secs = String(time % 60).padStart(2, "0");

    return `${hours}:${mins}:${secs}`;
  };
  useEffect(() => {
   
    let stream;

    async function getMedia() {
       if (isCalling) return;
       
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 },
          },
          audio: {
            sampleRate: 48000,
            channelCount: 2,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    }

    getMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isCalling]);

  // if(isAdminJoined)return <div className="fixed h-[90%] w-full inset-0 z-10000 lg:flex">
  //   <video ref={adminMediaOfferRefOne} src="" className="bg-black w-full h-1/2 lg:h-full object-contain" ></video>
  //   <video ref={adminMediaOfferReftwo} src="" className="bg-gray-500 w-full h-1/2 lg:h-full object-contain" ></video>
  // </div>;
  return (
    <>
      {(showCallControls) && (
        <div className="h-[10%] w-full fixed z-9999 bottom-0 left-0 bg-black backdrop-blur-md border-t border-white/10 flex items-center justify-between px-6">
          {/* Timer */}
          <div
            className={`${!isInCall && "opacity-0"} text-white text-lg font-semibold tracking-wide`}
          >
            {formatTime(videoCallSeconds)}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            {/* Mute Button */}
            <button
              onClick={() => {
                setIsMute(!isMute);
                localMedia.current
                  .getAudioTracks()
                  .forEach((track) => (track.enabled = !track.enabled));
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white shadow-lg active:scale-95"
            >
              {/* Change icon conditionally */}
              {!isMute && <FiMic size={20} />}
              {isMute && <FiMicOff size={20} />}
            </button>

            {/* Camera Button */}
            <button
              onClick={() => {
                setIsVideoOff(!isVideoOff);
                const currentState = !isVideoOff;
                localMedia.current
                  .getVideoTracks()
                  .forEach((track) => (track.enabled = !currentState));
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white shadow-lg active:scale-95"
            >
              {/* Change icon conditionally */}
              {!isVideoOff && <FiVideo size={20} />}
              {isVideoOff && <FiVideoOff size={20} />}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center text-white shadow-xl active:scale-95"
            >
              <MdCallEnd />
            </button>
            {!isCalling && !isInCall && (
              <button
                onClick={() => acceptCall(user._id, callerId)}
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center justify-center text-white shadow-xl active:scale-95"
              >
                <IoIosCall />
              </button>
            )}
            {user?.role !== 'student' && isInCall && <button
              onClick={() => setShowModal(!showModal)}
              className="text-white flex bg-gray-800 px-4 items-center gap-2 text-xs p-2 hover:bg-gray-700 rounded-md duration-300 ease-in-out transition-all hover:cursor-pointer absolute right-5"
            >
              Lap <BsFillRecordCircleFill className="" />
            </button>}
          </div>

          {/* Empty div for perfect center alignment */}
          <div className="w-[60px]" />
        </div>
      )}
      <div className="fixed h-[90%] w-full inset-0 z-10000">
        {(isCalling || isIncoming) && !isInCall && (
          <>
            {isCalling && !isIncoming && (
              <video
                // onPlay={()=>setShowCallControls(true)}
                ref={localVideoRef}
                autoPlay
                muted
                className="h-full w-full object-cover lg:object-contain bg-black bg-cover bg-center z-99999"
              />
            )}
            {!isCalling && isIncoming && (
              <video
                onPlay={() => setShowCallControls(true)}
                muted
                ref={localVideoRef}
                autoPlay
                className="w-full h-full object-cover lg:object-contain bg-black bg-cover bg-center"
              ></video>
            )}
          </>
        )}
        {(isCalling || isIncoming) && isInCall && (
          <>
          
            {showModal && <SelectStudent onclose={()=>setShowModal(false)}/>}

            <div onClick={()=>setShowModal(false)} className="h-full w-full">
              <div className="absolute h-full w-full">
                <video
                  playsInline
                  className="h-full  w-full object-cover lg:object-contain bg-black  z-99999"
                  ref={remoteVideoRef}
                ></video>
              </div>
              <Draggable nodeRef={dragRef}>
                <div
                  ref={dragRef}
                  className="absolute top-3 right-3 rounded-lg bg-black border border-black/20 overflow-auto shadow-2xl w-30 h-40 z-999999"
                >
                  <video
                    ref={localVideoRef}
                    muted
                    autoPlay
                    className="h-full w-full object-cover lg:object-contain z-99999"
                  ></video>
                </div>
              </Draggable>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default VideoCallUI;


function SelectStudent({onclose}){
  const {students} = useAppProvider();
  const [student,setStudent] = useState({id:'',name:''});
  const formattedName = formatName(student.name);
  const [error,setError] = useState(false);
  const {isLap,setIsLap,videoCallSeconds,setVideoCallSeconds,onlineClassBlob,recorderRef,setOnlineClassBlob,setOnlineClassBlobUrl} = useVideoCallContext();
  const formatedStudents = students?.map((el) => {
    // const name = el.name.split(' ').filter((el,i) => i !== 1 ? true : false).join(' ');
    // const name = el.name.split(' ').filter(el => el.toLowerCase() !== 'bhai').join(' ');
    return { label: el.name, value: el._id };
  });
  
  useEffect(() => {
    async function submitVideoCallRecording() {
      if (!student.id) return setError(true);

      const url = URL.createObjectURL(onlineClassBlob);
      const audio = new Audio(url);
      let dur;

      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = () => {
          dur = audio.duration / 60;
          resolve();
        };
        audio.onerror = () => {
          dur = 1;
          reject();
        };
      });

      onclose();
      setOnlineClassBlob(null);
      setVideoCallSeconds(0);
      setOnlineClassBlobUrl("");

      const toastId = "uploading";

      toast.success(
        "your recording will be submitted, do not close or refresh browser before success notification arrives",
        {
          icon: (
            <AiOutlineExclamationCircle className="text-yellow-500 text-4xl" />
          ),
          duration: 6000,
          style: { fontSize: "12px" },
        },
      );

      let data;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/recording/signedToken/${formattedName}`,
          { withCredentials: true },
        );
        data = response.data;
      } catch (err) {
        console.log(err);
        toast.error("signed token failed!", { id: toastId });
        setIsLap((val) => !val);
        return;
      }

      try {
        await axios.put(data.signedUrl, onlineClassBlob, {
          headers: {
            "Content-Type": "audio/webm",
          },
        });
      } catch (err) {
        console.log(err);
        toast.error("Upload failed!", { id: toastId });
        setIsLap((val) => !val);
        return;
      }

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/recording/create/${student.id}`,
          {
            isOnline: true,
            url: data.url,
            duration: dur,
          },
          { withCredentials: true },
        );
      } catch (err) {
        console.log(err);
        toast.error("entry failed!", { id: toastId });
        setIsLap((val) => !val);
        return;
      }

      URL.revokeObjectURL(url);
      toast.success("recording submitted!");
      setIsLap((val) => !val);
    }
    if(onlineClassBlob) submitVideoCallRecording();
  },[onlineClassBlob,student.id])
  
  
  return (
    <div className="fixed rounded-md lg:w-1/2 z-999999999999999 backdrop-opacity-0 top-1/2 left-1/2 -translate-1/2 bg-(--card) p-10 w-[90%] flex flex-col gap-6">
      {/* Header */}
      <button className="absolute right-3 top-3" onClick={onclose}>
        <HiXMark />
      </button>
      <div className="flex items-center gap-4">
        <div className="flex p-3 items-center justify-center rounded-full bg-amber-100">
          <FaGraduationCap className="text-3xl text-amber-700" />
        </div>

        <div>
          <h2 className="lg:text-2xl text-lg font-bold text-amber-950">
            Select Student
          </h2>

          <p className="mt-1 text-gray-500 text-xs lg:text-sm">
            Choose a student from the list
          </p>
        </div>
      </div>

      {/* Select */}
      <div>
        <Select options={formatedStudents} onChange={(e) => {
          setStudent({ id: e.value, name: e.label });
          setError(false);
        }}/>
        {(error && !student.id) && <p className="text-xs text-red-500 mt-1 font-bold">please select a student</p>}
      </div>
      <button
        onClick={() => {
          if(student.id) recorderRef?.current?.stop?.();
        }}
        className="bg-(image:--gradient-primary) text-white p-2 rounded-md"
      >
        Submit Recording
      </button>
      <div className="flex items-start gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex p-3 items-center justify-center rounded-full bg-amber-100">
          <FaRegLightbulb className="text-xl text-amber-700" />
        </div>

        <div>
          <p className="font-semibold text-amber-900 text-sm">
            Can't find the student?
          </p>

          <p className="mt-1 text-sm text-gray-500 text-xs">
            Try searching with a name, ITS or lastname.
          </p>
        </div>
      </div>
    </div>
  );
}