"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import { useCallingFn } from "../socket-listeners/Socket";
import { useSession } from "next-auth/react";

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
function VideoCallUI() {
  const session = useSession();
  const videoRef = useRef(null);
  const {localVideoRef,localMedia,isCalling,isIncoming,isInCall,callerId,remoteVideoRef} = useVideoCallContext();
  const {dummyAnsCall,acceptCall,endCall} = useCallingFn();
  const [isMute,setIsMute] = useState(false);
  const [isVideoOff,setIsVideoOff] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const dragRef = useRef(null);
  useEffect(() => {
    if(!isInCall) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
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
  return (
    <>
      <div className="h-[10vh] w-full fixed z-9999 bottom-0 left-0 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-6">
        {/* Timer */}
        <div
          className={`${!isInCall && "opacity-0"} text-white text-lg font-semibold tracking-wide`}
        >
          {formatTime(seconds)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5">
          {/* Mute Button */}
          <button
            onClick={() => {
              setIsMute(!isMute);
              const currentState = !isMute;
              localMedia.current
                .getAudioTracks()
                .forEach((track) => (track.enabled = currentState));
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
          {!isCalling && !isInCall && <button
            onClick={() => acceptCall(session.data.currentUser._id, callerId)}
            className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center justify-center text-white shadow-xl active:scale-95"
          >
            <IoIosCall />
          </button>}
        </div>

        {/* Empty div for perfect center alignment */}
        <div className="w-[60px]" />
      </div>
      <div className="fixed h-[90vh] w-full inset-0 z-10000">
        {(isCalling || isIncoming) && !isInCall && (
          <>
            {isCalling && !isIncoming && (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="h-full w-full object-cover z-99999"
              />
            )}
            {!isCalling && isIncoming && (
              <video
                muted
                ref={localVideoRef}
                autoPlay
                className="w-full h-full object-cover"
              ></video>
            )}
          </>
        )}
        {(isCalling || isIncoming) && isInCall && (
          <>
            <div className="h-full w-full">
              <div className="absolute h-full w-full">
                <video
                  className="h-full  w-full object-cover z-99999"
                  ref={remoteVideoRef}
                ></video>
              </div>
              <Draggable nodeRef={dragRef}>

              <div ref={dragRef} className="absolute top-3 right-3 rounded-lg border border-black/20 overflow-auto shadow-2xl w-30 h-40 z-999999">
                  <video
                    ref={localVideoRef}
                    muted
                    autoPlay
                    className="h-full w-full object-cover z-99999"
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
