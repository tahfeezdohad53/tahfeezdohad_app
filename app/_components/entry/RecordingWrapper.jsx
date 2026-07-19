'use client';
import { useQueryClient } from "@tanstack/react-query";
import useAudioRecorder from "../../_hooks/useAudioRecorder";
import StartRecording from "./StartRecording";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import RecordingInProgress from "./RecordingInProgress";
import SubmitRecording from "./SubmitRecording";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "../providers/UserProvider";
import { useRouter } from "next/navigation";

function RecordingWrapper({studentName,studentId}) {
    // const session = useSession();
    const {user,isFetching} = useUser();
        const router = useRouter();
    
        const session = useSession();
        useEffect(() => {
            if(session.status === "loading") return;
            if(isFetching) return;
            if(user?.role && user?.role === 'student') router.replace('/gurfah');
            if(!user?._id) {
              router.replace("/auth");
            }
            
          },[user?.role,session?.status,isFetching])
    const {
      states: {
        isRecording,
        isRecorded,
        isPause,
        isSubmitting,
        confirmSubmit,
        clientAudioUrl,
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
        setIsRecording,
      },
    } = useAudioRecorder();
     

    // const { startCall, dummyStartCall } = useCallingFn();
    const {
      onlineClassBlob,
      onlineClassBlobUrl,
      setOnlineClassBlobUrl,
      setOnlineClassBlob,
    } = useVideoCallContext();
    const queryClient = useQueryClient();
    
    async function confirmSubmitHandler() {
      setConfirmSubmit(false);
      try {
        await submitRecording(studentId);
        queryClient.invalidateQueries(["myStudents"]);
      } catch (err) {
        console.log(err);
      }
    }
    
    // return <StartRecording />
    // return <RecordingInProgress hours={hours} minutes={minutes} seconds={seconds} isPause={isPause} handlePause={handlePause} handleResume={handleResume}/>
    if (!isRecording && !isRecorded){
        return<StartRecording startRecording={startRecording} studentName={studentName}/>
    }
    if (isRecording){
        return (
          <RecordingInProgress
            studentName={studentName}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            isPause={isPause}
            handlePause={handlePause}
            handleResume={handleResume}
            finishRecording={finishRecording}
            confirmFinishRecording={confirmFinishRecording}
            setConfirmFinishRecording={setConfirmFinishRecording}
          />
        );
    }
    if (isRecorded){
      return (
        <SubmitRecording
        setIsPause={setIsPause}
        setTotalSeconds={setTotalSeconds}
        setIsRecording={setIsRecording}
        setClientAudioUrl={setClientAudioUrl}
          setAudio={setAudio}
          setIsRecorded={setIsRecorded}
          studentId={studentId}
          isSubmitting={isSubmitting}
          submitRecording={submitRecording}
          studentName={studentName}
          audioSize={audioSize}
          clientAudioUrl={clientAudioUrl}
          audioChunks={audioChunks}
        />
      );
    }
}

export default RecordingWrapper
