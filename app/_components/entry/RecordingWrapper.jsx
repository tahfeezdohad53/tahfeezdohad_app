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
import IkhtebaarForm from "@/features/entry/components/IkhtebaarForm";

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
        audioChunks,
        classType,
      },

      actions: {
        startRecording,
        handlePause,
        handleResume,
        finishRecording,
        submitRecording,
        submitIkhtebaarRecording,
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
        setClassType
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

    useEffect(() => {
      // Add 3 fake entries
      window.history.pushState({ block: 1 }, "", window.location.href);
      window.history.pushState({ block: 2 }, "", window.location.href);
      window.history.pushState({ block: 3 }, "", window.location.href);

      

      function handlePopState() {
        
          window.history.go(1);
        
      }

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }, []);
    
    // return <StartRecording />
    // return <RecordingInProgress hours={hours} minutes={minutes} seconds={seconds} isPause={isPause} handlePause={handlePause} handleResume={handleResume}/>
    if (!isRecording && !isRecorded){
        return<StartRecording startRecording={startRecording} studentName={studentName} classType={classType} setClassType={setClassType}/>
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
    if (isRecorded && classType !== 'tm'){
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
    // tm === tamreen
    if (isRecorded && classType === 'tm'){
      return (
        <IkhtebaarForm
          setIsPause={setIsPause}
          setTotalSeconds={setTotalSeconds}
          setIsRecording={setIsRecording}
          setClientAudioUrl={setClientAudioUrl}
          setAudio={setAudio}
          setIsRecorded={setIsRecorded}
          studentId={studentId}
          isSubmitting={isSubmitting}
          studentName={studentName}
          audioSize={audioSize}
          clientAudioUrl={clientAudioUrl}
          audioChunks={audioChunks}
          submitIkhtebaarRecording={submitIkhtebaarRecording}
        />
      );
    }
}

export default RecordingWrapper
