'use client';

import { createContext, useContext, useRef, useState } from "react";

const Context = createContext();
function VideoCallProvider({children}) {
    const [isCalling,setIsCalling] = useState(false);
    const [isIncoming,setIsIncoming] = useState(false);
    const [showCallControls,setShowCallControls] = useState(false);
    const [isInCall,setIsInCall] = useState(false);
    const [callerId,setCallerId] = useState(false);
    const [callingTo,setCallingTo] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localMedia = useRef(null);
    const [remoteMedia,setRemoteMedia] = useState(null);
    const [remoteOffer,setRemoteOffer] = useState(null);
    const [onlineClassBlob,setOnlineClassBlob] = useState(null);
    const [onlineClassBlobUrl,setOnlineClassBlobUrl] = useState('');
    const [onlineClassBlobUrlSize,setOnlineClassBlobUrlSize] = useState(0);
    const [videoCallSeconds,setVideoCallSeconds] = useState(0);    
    const peerConnection = useRef(null);
    const [isLap,setIsLap] = useState(false);
  const recorderRef = useRef(null);

    return (
        <Context.Provider value={{
            // states
            isCalling,
            isIncoming,
            peerConnection,
            localVideoRef,
            remoteVideoRef,
            isInCall,
            callerId,
            remoteOffer,
            callingTo,
            localMedia,
            remoteMedia,
            onlineClassBlob,
            onlineClassBlobUrl,
            onlineClassBlobUrlSize,
            showCallControls,
            videoCallSeconds,
            recorderRef,
            isLap,
            // setter functions

            setIsCalling,
            setIsIncoming,
            setIsInCall,
            setCallerId,
            setRemoteOffer,
            setCallingTo,
            setRemoteMedia,
            setOnlineClassBlob,
            setOnlineClassBlobUrl,
            setOnlineClassBlobUrlSize,
            setShowCallControls,
            setVideoCallSeconds,
            setIsLap
            }}>
            {children}
        </Context.Provider>
    )
}

export function useVideoCallContext(){
    const context = useContext(Context);
    if(!context) throw new Error('cannot use context outside of scope');
    return context;
}

export default VideoCallProvider
