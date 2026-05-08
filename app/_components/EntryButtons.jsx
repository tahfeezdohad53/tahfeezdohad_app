'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { IoMdMic } from "react-icons/io";

function EntryButtons() {
    const [isRecording,setIsRecording] = useState(false);
    const [isRecorded,setIsRecorded] = useState(false);
    const [totalSeconds,setTotalSeconds] = useState(0);
    const [isPause,setIsPause] = useState(false);
    const [audio,setAudio] = useState(null);
    const [isSubmitting,setIsSubmitting] = useState();
    const [clientAudioUrl,setClientAudioUrl] = useState("");
    const router = useRouter();
    let audioChunks = [];
    const recorder = useRef(null);
    const interval = useRef(null);
    const stream = useRef(null);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    async function startRecording(){
        setIsRecording(true);
        interval.current = setInterval(() => {
            setTotalSeconds(seconds => seconds + 1);
        }, 1000);

        stream.current = await navigator.mediaDevices.getUserMedia({audio: {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
    channelCount: 2,
    sampleRate: 48000
  },video:false});
       
            console.log('recording');
            recorder.current = new MediaRecorder(stream.current, {
  mimeType: "audio/webm;codecs=opus",
  audioBitsPerSecond: 256000
});
            recorder.current.ondataavailable = (e) => {
                // console.log('data avialable')
                audioChunks.push(e.data);
            }
            recorder.current.onstop = (e) => {
                  const blob = new Blob(audioChunks, { type: "audio/webm" });
                  console.log(blob.size / 1024 /1024)
                  const url = URL.createObjectURL(blob);
        setClientAudioUrl(url);
                setAudio(blob);
            }
        
        recorder.current.start();
    }

    function handlePause(){
        clearInterval(interval.current);
        interval.current = null;
        recorder.current.pause();
        setIsPause(true);
    }
    function handleResume(){
        interval.current = setInterval(() => {
            setTotalSeconds(seconds => seconds + 1);
        }, 1000);
        recorder.current.resume();
        setIsPause(false);
    }

    function finishRecording(){
        setIsRecording(false);
        setTotalSeconds(0);
        if(interval.current) clearInterval(interval.current);
        if(recorder.current) recorder.current.stop();
        if(recorder.current) recorder.current = null;
        if(stream.current) stream.current.getTracks().forEach(track => track.stop())
        setIsRecorded(true);
    }

    async function submitRecording(){
        const formData = new FormData();
        formData.append('audio',audio,"recording.webm");
        formData.append('student',"aliasgar kagzi");
        formData.append('muhaffiz',"huzefa ratlam");
        try{
          setIsSubmitting(true)
            console.log(formData.get('audio'))
            await axios.post(`${process.env.NEXT_PUBLIC_URL}/entry/recording`,formData);
            toast.success('recording uploaded');
            router.push('/recordings');
        }catch(err){
            toast.error('failed to upload recording');
        }finally{
          setIsSubmitting(false);
        }
    }
    // let milliseconds = Math.floor((ms % 1000) / 10);
    if(!isRecording && !isRecorded)return (
      <div className="grid grid-cols-2 gap-3 text-white">
        <button className="px-2 py-1 rounded-md bg-amber-900 ">present</button>
        <button className="px-2 py-1 rounded-md bg-amber-900 ">absent</button>
        <button className="px-2 py-1 rounded-md bg-amber-900 ">holiday</button>
        <button className="px-2 py-1 rounded-md bg-amber-900 " onClick={startRecording}>record</button>
      </div>
    );

    if(isRecording) return (
      <div className="flex flex-col items-center gap-2 bg-(--layer) p-10 rounded-md shadow">
        <p className="mb-2 text-sm tracking-wider">
          {isPause ? "paused" : "recording..."}
        </p>
        <IoMdMic className="text-2xl bg-(--surface)" />
        <p>
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </p>
        <div className="space-x-2 mt-3">
          {!isPause && (
            <button
              onClick={handlePause}
              className="px-4 py-1 rounded-md bg-amber-900 text-white "
            >
              pause
            </button>
          )}
          {isPause && (
            <button
              onClick={handleResume}
              className="px-4 py-1 rounded-md bg-amber-900 text-white "
            >
              resume
            </button>
          )}
          <button
            onClick={finishRecording}
            className="px-4 py-1 rounded-md bg-amber-900 text-white "
          >
            stop
          </button>
        </div>
      </div>
    );

    if (isRecorded)
      return (
        <div className="flex flex-col items-center gap-2 bg-(--layer) p-10 rounded-md shadow">
          <audio controls src={clientAudioUrl || null}></audio>
          <button disabled={isSubmitting} onClick={submitRecording} className="relative px-4 py-1 rounded-md bg-amber-900 text-white">
            <p className={`${isSubmitting && 'opacity-0'}`}>submit</p>
            {isSubmitting && <span className="absolute top-1/2 left-1/2 -translate-1/2 animate-spin"><ImSpinner2 /></span>}
          </button>
        </div>
      );
}

export default EntryButtons
