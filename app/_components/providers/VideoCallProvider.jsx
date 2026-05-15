'use client';

import { createContext, useContext, useRef, useState } from "react";

const Context = createContext();
function VideoCallProvider({children}) {
    const [isCalling,setIsCalling] = useState(false);
    const [isIncoming,setIsIncoming] = useState(false);
    const [isInCall,setIsInCall] = useState(false);
    const [callerId,setCallerId] = useState(false);
    const [callingTo,setCallingTo] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [remoteOffer,setRemoteOffer] = useState(null);
    const peerConnection = useRef(null);
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
            // setter functions

            setIsCalling,
            setIsIncoming,
            setIsInCall,
            setCallerId,
            setRemoteOffer,
            setCallingTo
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
