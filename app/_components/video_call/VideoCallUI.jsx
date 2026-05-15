"use client";

import { useEffect, useRef } from "react";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import { useCallingFn } from "../socket-listeners/Socket";
import { useSession } from "next-auth/react";

function VideoCallUI() {
  const session = useSession();
  const videoRef = useRef(null);
  const {localVideoRef,isCalling,isIncoming,isInCall,callerId,remoteVideoRef} = useVideoCallContext();
  const {dummyAnsCall,acceptCall} = useCallingFn();
  useEffect(() => {
   
    let stream;

    async function getMedia() {
       if (isCalling) return;
       
      try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
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
    <div className="fixed h-screen w-full inset-0 z-10000">
      {(isCalling || isIncoming) && !isInCall && (
        <>
         {isCalling && !isIncoming && <video
            ref={localVideoRef}
            autoPlay
            className="h-full w-full object-cover z-99999"
          />}
          {!isCalling && isIncoming && <video ref={videoRef} autoPlay className="w-full h-full object-cover"></video>}
          {isIncoming && <button
            onClick={() => acceptCall(session.data.currentUser._id,callerId)}
            className="bg-red-500 absolute bottom-5 left-1/2 -translate-x-1/2"
          >
            accept
          </button>}
          {isCalling && <button
            onClick={() => acceptCall(session.data.currentUser._id,callerId)}
            className="bg-red-500 absolute bottom-5 left-1/2 -translate-x-1/2"
          >
            end call
          </button>}
        </>
      )}
      {(isCalling || isIncoming) && isInCall && (
        <>
          <div className="h-full w-full">
            <div className="absolute h-full w-full">
              <video className="h-full w-full object-cover z-99999" ref={remoteVideoRef}></video>
            </div>
            <div className="absolute top-0 right-0 w-30 h-40 ">
              {isIncoming && !isCalling && <video
                ref={localVideoRef}
                autoPlay
                className="h-full w-full object-cover z-99999"
              ></video>}
              {!isIncoming && isCalling && <video
                ref={localVideoRef}
                autoPlay
                className="h-full w-full object-cover z-99999"
              ></video>}
            </div>
          </div>
          {/* <video
            ref={videoRef}
            autoPlay
            className="h-full w-full object-cover z-99999"
          /> */}
          <button className="bg-red-500 absolute bottom-5 left-1/2 -translate-x-1/2">
            end call
          </button>
        </>
      )}
      {/* {isCalling && !isInCall && (
        <>
          <video
            ref={localVideoRef}
            autoPlay
            className="h-full w-full object-cover"
          />
          <button className="bg-red-500 absolute bottom-5 left-1/2 -translate-x-1/2">
            end call
          </button>
        </>
      )} */}
      {/* {isCalling && isInCall && (
        <>
          <div className="h-full w-full">
            <div className="absolute h-full w-full bg-black"></div>
            <div className="absolute top-0 right-0 w-30 h-40 ">
              <video
                ref={videoRef}
                autoPlay
                className="h-full w-full object-cover z-99999"
              ></video>
            </div>
          </div>
          <button className="bg-red-500 absolute bottom-5 left-1/2 -translate-x-1/2">
            end call
          </button>
        </>
      )} */}
    </div>
  );
}

export default VideoCallUI;
