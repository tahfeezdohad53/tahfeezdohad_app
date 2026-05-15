"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useSocketContext } from "@/app/_components/providers/SocketProvider";
import { useVideoCallContext } from "../providers/VideoCallProvider";

const Context = createContext(null);

export function CallingFnProvider({ children }) {
  const { socket } = useSocketContext();
  const { isIncoming,remoteVideoRef,isCalling, callingTo,setCallingTo,localVideoRef,setIsCalling, setIsIncoming, isInCall,setIsInCall,setCallerId,callerId,remoteOffer, setRemoteOffer } = useVideoCallContext();

  const {peerConnection} = useVideoCallContext();
  const candidates = useRef([]);

  /* eslint-disable */
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("connected");
    });

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    
    
}, [socket]);
    async function startCall(receiverId,callerId) {
        setIsCalling(true);
        setCallingTo(receiverId);
    const stream = await navigator.mediaDevices.getUserMedia({
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
    if(!localVideoRef.current) return alert(localVideoRef.current);
    localVideoRef.current.srcObject = stream;
    
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track,stream));
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('incoming-call',{to:receiverId,from:callerId,offer});
    }


    async function acceptCall(receiverId,callerId) {
      setIsInCall(true);
      const stream = await navigator.mediaDevices.getUserMedia({
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
      localVideoRef.current.srcObject = stream;

      stream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, stream));
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteOffer),
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      console.log(candidates.current);
      for(const candidate of candidates.current){
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
      socket.emit("call-accepted", { to: callerId, from: receiverId, answer });
    }
  
  async function dummyStartCall(callerId) {
  socket.emit('incoming-call',{to:callerId,from:callerId});
  }
  async function dummyAnsCall(callerId) {
  socket.emit('call-accepted',{to:callerId,from:callerId});
  }


    useEffect(() => {
      // console.log(peerConnection.current);
      if(!peerConnection.current) return;
      

      peerConnection.current.ontrack = (event) => {
        const stream = event.streams[0];
          if(remoteVideoRef.current){
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.play().catch(err => console.log(err));
          }
      };
    },[peerConnection,socket])

    useEffect(() => {
      if (!peerConnection.current) return;
      peerConnection.current.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("ice-candidate", {
            to: isIncoming ? callerId : callingTo,
            candidate,
          });
        }
      };
    },[callingTo])

    useEffect(() => {
        if(!socket) return;
        socket.on('incoming-call',async ({caller,offer}) => {
          setIsIncoming(true);
          setCallerId(caller);
          setRemoteOffer(offer);
    //         const r = new RTCPeerConnection();
    // r.setRemoteDescription()
            // await peerConnection.current.setRemoteDescription(offer);

        })
        socket.on('call-accepted',async ({caller,answer}) => {
            console.log('accepted');
            setIsInCall(true);
            const stream = await navigator.mediaDevices.getUserMedia({
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
            localVideoRef.current.srcObject = stream;
            peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
            console.log(candidates.current)
            for(const candidate of candidates.current){
              peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        })
        socket.on('ice-candidate',async ({candidate}) => {
          console.log('candidate');
           if(peerConnection.current.remoteDescription){
            peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
           }else{
            candidates.current.push(candidate);
           }
        })
    },[socket])

  return (
    <Context.Provider value={{ startCall,acceptCall,dummyStartCall,dummyAnsCall }}>
      {children}
    </Context.Provider>
  );
}

export function useCallingFn() {
  return useContext(Context);
}
