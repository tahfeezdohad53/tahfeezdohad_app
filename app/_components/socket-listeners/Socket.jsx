"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useSocketContext } from "@/app/_components/providers/SocketProvider";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Context = createContext(null);

export function CallingFnProvider({ children }) {
  const { socket } = useSocketContext();
  const { isIncoming,setOnlineClassBlob,setOnlineClassBlobUrl,localMedia,remoteMedia,setRemoteMedia,remoteVideoRef,isCalling, callingTo,setCallingTo,localVideoRef,setIsCalling, setIsIncoming, isInCall,setIsInCall,setCallerId,callerId,remoteOffer, setRemoteOffer } = useVideoCallContext();
  const session = useSession();
  const {peerConnection} = useVideoCallContext();
  const candidates = useRef([]);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const router = useRouter();

  function endCall(){
    setIsCalling(false);
    setIsIncoming(false);
    setIsInCall(false);
  
    if(session?.data?.currentUser?.role !== 'student' && recorderRef.current){
       recorderRef.current.stop();
    }else{
      window.location.reload();
    }
    if(localMedia.current){
      localMedia.current.getTracks().forEach((track) => track.stop());
    }
    socket.emit('end-call',{to:isIncoming ? callerId : callingTo});
  }

  useEffect(() => {
    if(!isInCall) return;
    if(session?.data?.currentUser?.role === 'student') return;
    if(recorderRef?.current?.state === 'recording') return;
    if(!localMedia.current || !remoteMedia) return;
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const localAudiotracks = new MediaStream(localMedia.current.getAudioTracks())
    const localSource = audioContext.createMediaStreamSource(localAudiotracks);
    const remoteAudiotracks = new MediaStream(
      remoteMedia.getAudioTracks(),
    );
    const remoteSource = audioContext.createMediaStreamSource(remoteAudiotracks);
    localSource.connect(destination);
    remoteSource.connect(destination);
    recorderRef.current = new MediaRecorder(destination.stream, {
         mimeType: "audio/webm;codecs=opus",
         audioBitsPerSecond: 256000,
       });

    recorderRef.current.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    }
    recorderRef.current.onstop = (event) => {
      const blob = new Blob(chunksRef.current,{
        type:'audio/webm'
      })
      setOnlineClassBlob(blob);
      const url =  URL.createObjectURL(blob);
      setOnlineClassBlobUrl(url);
      console.log(url);
    }
    recorderRef.current.start();
  },[isInCall,session?.data?.currentUser.role,localMedia,remoteMedia])

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
    localMedia.current = await navigator.mediaDevices.getUserMedia({
        video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60 },
        },
        audio: {
        sampleRate: 48000,
        channelCount: 2,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        },
    });
    localVideoRef.current.srcObject = localMedia.current;
    
    localMedia.current.getTracks().forEach(track => peerConnection.current.addTrack(track,localMedia.current));
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('incoming-call',{to:receiverId,from:callerId,offer});
    }


    async function acceptCall(receiverId,callerId) {
      setIsInCall(true);
      localMedia.current = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 },
        },
        audio: {
          sampleRate: 48000,
          channelCount: 2,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      localVideoRef.current.srcObject = localMedia.current;

      localMedia.current
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, localMedia.current));
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
        setRemoteMedia(stream)
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
      if(!localVideoRef.current) return;
      if(isIncoming) return;
      localVideoRef.current.srcObject = localMedia.current;
    },[isInCall])

    useEffect(() => {
        if(!socket) return;
        socket.on('incoming-call',async ({caller,offer}) => {
          setIsIncoming(true);
          setCallerId(caller);
          setRemoteOffer(offer);
          localMedia.current = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 60 },
            },
            audio: {
              sampleRate: 48000,
              channelCount: 2,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });
          localVideoRef.current.srcObject = localMedia.current; 

        })
        socket.on('call-accepted',async ({caller,answer}) => {
            setIsInCall(true);
            // localVideoRef.current.srcObject = localMedia.current;
            // localVideoRef.current.play();
            peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
            console.log(candidates.current)
            for(const candidate of candidates.current){
              peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        })
        socket.on('ice-candidate',async ({candidate}) => {
          if(!peerConnection.current) return;
           if(peerConnection.current.remoteDescription){
            peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
           }else{
            candidates.current.push(candidate);
           }
        })

        socket.on('end-call',() => {
          setIsCalling(false);
          setIsIncoming(false);
          setIsInCall(false);
          candidates.current = [];
          if(session?.data?.currentUser?.role !== 'student' && recorderRef.current){
             recorderRef.current.stop();
          }else{
                  window.location.reload();

          }
          localMedia.current.getTracks().forEach((track) => track.stop());
        })
    },[socket])

  return (
    <Context.Provider value={{ startCall,acceptCall,dummyStartCall,dummyAnsCall,endCall }}>
      {children}
    </Context.Provider>
  );
}

export function useCallingFn() {
  return useContext(Context);
}
