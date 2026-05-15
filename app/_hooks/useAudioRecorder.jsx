import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useVideoCallContext } from "../_components/providers/VideoCallProvider";

function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isRecorded, setIsRecorded] = useState(false);
    const [confirmFinishRecording, setConfirmFinishRecording] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [isPause, setIsPause] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState();
    const [clientAudioUrl, setClientAudioUrl] = useState("");
    const [isRedirect, setIsRedirect] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const {onlineClassBlob,setOnlineClassBlobUrl,setOnlineClassBlob} = useVideoCallContext();
    const router = useRouter();

    let audioChunks = [];
    const recorder = useRef(null);
    const interval = useRef(null);
    const stream = useRef(null);

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    
     async function startRecording() {
       setIsRecording(true);
       let wakeLock;
       try{
          wakeLock = await navigator.wakeLock.request('screen');
       }catch(err){
        console.log(err);
       }
       stream.current = await navigator.mediaDevices.getUserMedia({
         audio: {
           echoCancellation: false,
           noiseSuppression: false,
           autoGainControl: false,
           channelCount: 2,
           sampleRate: 48000,
         },
         video: false,
       });
       interval.current = setInterval(() => {
         setTotalSeconds((seconds) => seconds + 1);
       }, 1000);

       console.log("recording");
       recorder.current = new MediaRecorder(stream.current, {
         mimeType: "audio/webm;codecs=opus",
         audioBitsPerSecond: 256000,
       });
       recorder.current.ondataavailable = (e) => {
         // console.log('data avialable')
         audioChunks.push(e.data);
       };
       recorder.current.onstop = (e) => {
         const blob = new Blob(audioChunks, { type: "audio/webm" });
         console.log(blob.size / 1024 / 1024);
         const url = URL.createObjectURL(blob);
         setClientAudioUrl(url);
         setAudio(blob);
         wakeLock?.release();
       };

       recorder.current.start();
     }

     function handlePause() {
       clearInterval(interval.current);
       interval.current = null;
       recorder.current.pause();
       setIsPause(true);
     }
     function handleResume() {
       interval.current = setInterval(() => {
         setTotalSeconds((seconds) => seconds + 1);
       }, 1000);
       recorder.current.resume();
       setIsPause(false);
     }

     function handleConfirmFinishRecording(){
      handlePause();
        setConfirmFinishRecording(true);
     }

     function finishRecording() {
      setConfirmFinishRecording(false);
       setIsRecording(false);
       setTotalSeconds(0);
       if (interval.current) clearInterval(interval.current);
       if (recorder.current) recorder.current.stop();
       if (recorder.current) recorder.current = null;
       if (stream.current)
         stream.current.getTracks().forEach((track) => track.stop());
       setIsRecorded(true);
     }

     async function submitRecording(studentId,jwt) {
       const formData = new FormData();
       if(!onlineClassBlob) formData.append("recording", audio, "recording.webm");
       if(onlineClassBlob) formData.append("recording",onlineClassBlob,"recording.webm")
       try {
      setIsSubmitting(true);
      setConfirmSubmit(false);
      console.log(formData.get("audio"));
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/recording/upload/${studentId}`,
        formData,{headers:{Authorization:`Bearer ${jwt}`}}
      );
      toast.success("recording uploaded");
      setOnlineClassBlob(null);
      setOnlineClassBlobUrl('')
         if (isRedirect) return router.push("https://www.elearningquran.com");
         else return router.push("/recordings");
       } catch (err) {
         toast.error("failed to upload recording");
         console.log(err)
       } finally {
         setIsSubmitting(false);
       }
     }

    return {
      states: {
        isRecording,
        isRecorded,
        isPause,
        isSubmitting,
        confirmSubmit,
        clientAudioUrl,
        totalSeconds,
        confirmFinishRecording,
        hours,
        minutes,
        seconds
      },

      actions: {
        startRecording,
        handlePause,
        handleResume,
        finishRecording,
        submitRecording,
        setConfirmSubmit,
        setIsRedirect,
        handleConfirmFinishRecording,
        setConfirmFinishRecording
      },
    };
}

export default useAudioRecorder
