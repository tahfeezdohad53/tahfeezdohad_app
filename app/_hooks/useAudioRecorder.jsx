import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useVideoCallContext } from "../_components/providers/VideoCallProvider";
import { AiOutlineExclamationCircle } from "react-icons/ai";

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
    const [audioSize, setAudioSize] = useState(0);
    const {onlineClassBlob,setOnlineClassBlobUrl,setOnlineClassBlob,videoCallSeconds,setVideoCallSeconds} = useVideoCallContext();
    const router = useRouter();

    let audioChunks = useRef([]);;
    const recorder = useRef(null);
    const interval = useRef(null);
    const stream = useRef(null);

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    
     async function startRecording(loudness) {
       try{
         await document.documentElement.requestFullscreen();
          wakeLock = await navigator.wakeLock.request('screen');
       }catch(err){
        console.log(err);
       }
       setIsRecording(true);
       audioChunks.current = [];
       let wakeLock;
       stream.current = await navigator.mediaDevices.getUserMedia({
         audio: {
           noiseSuppression: false,
           echoCancellation: false,
           autoGainControl: false,
           channelCount: 1,
           sampleRate: 48000,
         },
         video: false,
       });
       const ctx = new AudioContext();

       const source = ctx.createMediaStreamSource(stream.current);

       const gainNode = ctx.createGain();
       gainNode.gain.value = loudness; // Increase volume by 50%

       const destination = ctx.createMediaStreamDestination();

       source.connect(gainNode).connect(destination);

       const processedStream = destination.stream;
       interval.current = setInterval(() => {
         setTotalSeconds((seconds) => seconds + 1);
       }, 1000);

      //  console.log("recording");
       recorder.current = new MediaRecorder(processedStream, {
         mimeType: "audio/webm;codecs=opus",
         audioBitsPerSecond: 256000,
       });
       recorder.current.ondataavailable = (e) => {
         // console.log('data avialable')
         audioChunks.current.push(e.data);
       };
       recorder.current.onstop = (e) => {
         const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        //  console.log(blob.size / 1024 / 1024);
         setAudioSize(Number((blob.size / 1024 / 1024).toFixed(1)));
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
      document.exitFullscreen().catch(err => console.log('failed to exit full screen'));
      setConfirmFinishRecording(false);
       setIsRecording(false);
       
       if (interval.current) clearInterval(interval.current);
       if (recorder.current) recorder.current.stop();
       if (recorder.current) recorder.current = null;
       if (stream.current)
         stream.current.getTracks().forEach((track) => track.stop());
       setIsRecorded(true);
     }

     
     async function submitRecording(studentId) {
      setIsSubmitting(true);  
      const toastId = 'uploading'
      try{
        // console.log(data.signedUrl)
        toast.success(
          "your recording will be submitted, do not close or refresh browser before success notification arrives",
          {
            icon: <AiOutlineExclamationCircle className="text-yellow-500 text-4xl" />, duration:5000
          },
        );
        let blob = audio;
        setAudio(null)
        setIsRecording(false);
        setIsRecorded(false);
        URL.revokeObjectURL(clientAudioUrl);
        setClientAudioUrl('');
        router.replace('/students');
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/recording/signedToken`,{withCredentials:true}
        );
        await axios.put(data.signedUrl, blob, {
          headers: {
            "Content-Type": "audio/webm",
          },
          // onUploadProgress: (progress) => {
          //   const percent = Math.round(
          //     (progress.loaded * 100) / progress.total,
          //   );

          //   toast.loading(`Uploading... ${percent}%`, {
          //     id: toastId,
          //   });

          // },
        });
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/recording/create/${studentId}`,
          {
            isOnline: false,
            url: data.url,
            duration: totalSeconds / 60,
          },{withCredentials:true}
        );
        toast.success("Upload complete!", {
          id: toastId,
        });
        // setOnlineClassBlob(null);
        // setVideoCallSeconds(0);
        // setOnlineClassBlobUrl("");
            
      }catch(err){
        console.log(err);
        toast.error("Upload failed!", {
          id: toastId,
        });
      }finally{
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
        seconds,
        audioSize,
        audioChunks
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
        setConfirmFinishRecording,
        setIsRecorded,
        setAudio,
        setClientAudioUrl,
        setTotalSeconds,
        setIsPause,
        setIsRecording
      },
    };
}

export default useAudioRecorder
