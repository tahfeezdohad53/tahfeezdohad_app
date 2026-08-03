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
  const {
    onlineClassBlob,
    setOnlineClassBlobUrl,
    setOnlineClassBlob,
    videoCallSeconds,
    setVideoCallSeconds,
  } = useVideoCallContext();
  const router = useRouter();

  let audioChunks = useRef([]);
  const recorder = useRef(null);
  const interval = useRef(null);
  const stream = useRef(null);

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  async function startRecording() {
    let wakeLock;
    audioChunks.current = [];
    if (recorder.current) recorder.current = null;
    try {
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
      setIsRecording(true);
    } catch (err) {
      return toast.error("microphone permission denied");
    }
    try {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (!isIOS) await document.documentElement.requestFullscreen();
      wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.log(err);
    }
    const ctx = new AudioContext();

    const source = ctx.createMediaStreamSource(stream.current);

    const gainNode = ctx.createGain();
    gainNode.gain.value = 1.5; // Increase volume by 50%

    const destination = ctx.createMediaStreamDestination();

    source.connect(gainNode).connect(destination);

    const processedStream = destination.stream;
    interval.current = setInterval(() => {
      setTotalSeconds((seconds) => seconds + 1);
    }, 1000);

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    let mimeType = "";

    if (isIOS && MediaRecorder.isTypeSupported("audio/mp4")) {
      mimeType = "audio/mp4";
    } else if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
      mimeType = "audio/webm;codecs=opus";
    } else if (MediaRecorder.isTypeSupported("audio/webm")) {
      mimeType = "audio/webm";
    } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
      mimeType = "audio/mp4";
    }
    //  console.log("recording");
    recorder.current = new MediaRecorder(processedStream, {
      mimeType: mimeType,
      audioBitsPerSecond: 256000,
    });
    recorder.current.ondataavailable = (e) => {
      // console.log('data avialable')
      // console.log(e.data);
      if(e.data.size > 1024)audioChunks.current.push(e.data);
      else toast.error(
        "Something went wrong while recording this class. Please do not submit this recording. Refresh your browser before recording the next class.",
      {duration:5000});
    };
    recorder.current.onstop = async (e) => {
      // console.log(recorder.current);
      const blob = new Blob(audioChunks.current, {
        type: recorder.current.mimeType,
      });
      //  console.log(blob.size / 1024 / 1024);
      setAudioSize(blob.size);
      const url = URL.createObjectURL(blob);
      setClientAudioUrl(url);
      setAudio(blob);
      wakeLock?.release();
      source.disconnect();
      gainNode.disconnect();
      try{
        await ctx.close();
      }catch(err){
        console.log(err);
      }
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

  function handleConfirmFinishRecording() {
    handlePause();
    setConfirmFinishRecording(true);
  }

  function finishRecording() {
    setConfirmFinishRecording(false);
    setIsRecording(false);

    if (interval.current) clearInterval(interval.current);
    if (recorder.current) recorder.current.stop();
    if (stream.current)
      stream.current.getTracks().forEach((track) => track.stop());
    setIsRecorded(true);
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (!isIOS && document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch((err) => console.log("Failed to exit fullscreen:", err));
    }
  }

  async function submitRecording(studentId, name) {
      if(audioSize < 1024) return toast.error(
        "Something went wrong while recording this class. Please do not submit this recording. Refresh your browser before recording the next class.",
      {duration:5000});

    setIsSubmitting(true);
    const toastId = "uploading";
    try {
      // console.log(data.signedUrl)
      // toast.success(
      //   "your recording will be submitted, do not close or refresh browser before success notification arrives",
      //   {
      //     icon: <AiOutlineExclamationCircle className="text-yellow-500 text-4xl" />, duration:6000,style:{fontSize:'12px'}
      //   },
      // );
      let blob = audio;
      setAudio(null);
      setIsRecording(false);
      setIsRecorded(false);
      URL.revokeObjectURL(clientAudioUrl);
      setClientAudioUrl("");
      router.replace("/students");
      toast.loading('Upload starting...',{id:toastId})
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/recording/signedToken/${name}`,
        { withCredentials: true },
      );
      await axios.put(data.signedUrl, blob, {
        headers: {
          "Content-Type": "audio/webm",
        },
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded * 100) / progress.total);

          toast.loading(`Uploading... ${percent}%`, {
            id: toastId,
          });
        },
      });
      toast.loading("almost done...", { id: toastId });

      await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/recording/create/${studentId}`,
        {
          isOnline: false,
          url: data.url,
          duration: totalSeconds / 60,
        },
        { withCredentials: true },
      );
      toast.success("Upload complete!", {
        id: toastId,
      });
      // setOnlineClassBlob(null);
      // setVideoCallSeconds(0);
      // setOnlineClassBlobUrl("");
    } catch (err) {
      console.log(err);
      toast.error("Upload failed!", {
        id: toastId,
      });
      alert(err);
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
      seconds,
      audioSize,
      audioChunks,
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
      setIsRecording,
    },
  };
}

export default useAudioRecorder;
