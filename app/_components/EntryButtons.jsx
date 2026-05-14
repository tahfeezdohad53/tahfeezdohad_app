"use client";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import userAudioRecorder from "../_hooks/useAudioRecorder";
import ConfirmSubmit from "./ConfirmSubmit";
import ConfirmationMenu from "./ConfirmSubmit";
import { useQueryClient } from "@tanstack/react-query";

function EntryButtons({studentId,jwt,studentName}) {
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
  } = userAudioRecorder();
  const queryClient = useQueryClient();
  async function confirmSubmitHandler(){
    setConfirmSubmit(false);
    try{
      await submitRecording(studentId,jwt);
      queryClient.invalidateQueries(['myStudents']);
    }catch(err){
      console.log(err);
    }
  }

  if (!isRecording && !isRecorded)
    return (
      <>
        <div className="px-10 py-5 shadow-lg text-white flex flex-col items-center gap-2">
        <h1 className="text-black font-bold mb-2 text-center">
          You are about to record class of{" "}
          <span className="text-amber-800">{studentName}</span>
        </h1>
          <button
            className="px-8 py-2 rounded-md bg-amber-900 flex items-center gap-3 justify-center"
            onClick={startRecording}
          >
            <FaMicrophoneAlt /> record
          </button>
          <div className="text-amber-900 text-sm font-bold items-center flex gap-1">
            <input
              onInput={(el) => setIsRedirect(el.target.checked)}
              // onChange={(el) => console.log(el.target.value)}
              type="checkbox"
              id="checkbox"
            />
            <label htmlFor="checkbox">redirect</label>
          </div>
        </div>
      </>
    );
    
    

  if (isRecording)
    return (
      <>
        <div className="flex flex-col items-center gap-2 px-15 py-8 rounded-md shadow-lg">
          <h1 className="font-bold mb-1 text-center">
            recording class of{" "}
            <span className="text-amber-800">{studentName}</span>
          </h1>
          <p className="mb-2 text-sm tracking-wider font-bold text-amber-800">
            {isPause ? "paused..." : "recording..."}
          </p>
          {!isPause && <FaMicrophoneAlt className="text-2xl" />}
          {isPause && <FaMicrophoneAltSlash className="text-2xl" />}
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
              onClick={handleConfirmFinishRecording}
              className="px-4 py-1 rounded-md bg-amber-900 text-white "
            >
              stop
            </button>
          </div>
          {confirmFinishRecording && (
        
              
              <ConfirmationMenu
                confirmButtonTitle="Ok"
                title={"you are about to stop recording"}
                confirmHandler={finishRecording}
                onClose={() => {
                  setConfirmFinishRecording(false);
                  handleResume();
                }}
              />
           
          )}
        </div>
      </>
    );


  if (isRecorded)
    return (
      <div className="flex flex-col items-center gap-2 bg-(--layer) px-10 py-5 rounded-md shadow">
        <h1 className="font-bold mb-3 text-center">
          Submit class recording of{" "}
          <span className="text-amber-800">{studentName}</span>
        </h1>
        <audio controls src={clientAudioUrl || null}></audio>
        <button
          onClick={() => setConfirmSubmit(true)}
          disabled={isSubmitting}
          className="relative px-4 py-1 rounded-md bg-amber-900 text-white"
        >
          <p className={`${isSubmitting && "opacity-0"}`}>submit</p>
          {isSubmitting && (
            <span className="absolute top-1/2 left-1/2 -translate-1/2 animate-spin">
              <ImSpinner2 />
            </span>
          )}
        </button>

        {confirmSubmit && (
          <ConfirmSubmit
            onClose={() => setConfirmSubmit(false)}
            confirmHandler={confirmSubmitHandler}
            title={"you are about to submit this recording"}
          />
        )}
      </div>
    );
}
export default EntryButtons;