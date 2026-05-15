'use client';

import { useVideoCallContext } from "../providers/VideoCallProvider";
import VideoCallUI from "./VideoCallUI";

function VideoCallWrapper() {
    const {isIncoming,isCalling} = useVideoCallContext();
    return (
        <div>
            {(isIncoming || isCalling) && <VideoCallUI />}
        </div>
    )
}

export default VideoCallWrapper
