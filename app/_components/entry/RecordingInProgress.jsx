import { BsSoundwave } from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { PiRecordFill } from "react-icons/pi";
import { TbPlayerRecordFilled } from "react-icons/tb";
import ConfirmationMenu from "../ConfirmSubmit";
import { formatName } from "@/helpers";

function RecordingInProgress({ studentName, hours, minutes, seconds, isPause, handlePause, handleResume, finishRecording, confirmFinishRecording, setConfirmFinishRecording }) {
  const formattedName = formatName(studentName);
  return (
    <div className="bg-(--card) flex flex-col items-center gap-6 lg:w-1/2 lg:mx-auto order py-8 px-5 border-(--border) h-full rounded-2xl shadow-(--shadow-2xl)">
      <div className="flex flex-col items-center gap-5 text-sm">
        {!isPause && (
          <div className="flex items-center border border-blue-500 rounded-full px-2 text-blue-500 font-bold">
            <TbPlayerRecordFilled />
            <p>Rec</p>
          </div>
        )}
        {isPause && (
          <div className="flex items-center border border-red-500 rounded-full px-2 text-red-500 font-bold">
            <TbPlayerRecordFilled />
            <p>paused</p>
          </div>
        )}
        <div className="flex flex-col items-center ">
          <header className="font-bold text-xl text-(--text)">
            Recording Class of
          </header>
          <h1 className="font-bold text-center text-(--text-secondary) text-lg">
            {formattedName}
          </h1>
        </div>
      </div>

      <div className="borde border-(--border) shadow-2xl rounded-full p-4 bg-(--layer)">
        <div className="border border-(--border) bg-(--background)/50 shadow-l rounded-full p-8">
          <BsSoundwave className="text-5xl text-(--primary-light)" />
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-1 items-center">
        <h1 className="text-4xl font-bold">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </h1>
        {!isPause && (
          <p className="text-xs text-stone-700">Recording in Progress</p>
        )}
        {isPause && (
          <p className="text-xs text-(--danger)">Recording is paused</p>
        )}
      </div>

      <div className="order bg-(--bg-tertiary)/50 border-(--border) w-full rounded-2xl px-4 py-5">
        <div className="mt-3 flex flex-col gap-3 ">
          <div className="flex items-center gap-3 pb-3 ">
            <span className="border border-(--border) shadow rounded-md p-2 bg-(--background)">
              <BsSoundwave className="text-xl text-(--primary)" />
            </span>
            <p className="text-xs font-semibold">
              Recording, please do not keep browser in background for more than
              30 seconds
            </p>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            handlePause();
            setConfirmFinishRecording(true);
          }}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-(--danger) py-4 text-white shadow-lg"
        >
          <PiRecordFill />
          Stop 
        </button>

        {isPause ? (
          <button
            onClick={handleResume}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-500 py-4 text-white shadow-lg"
          >
            <FaPlay />
            Resume 
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-500 py-4 text-white shadow-lg"
          >
            <FaPause />
            Pause 
          </button>
        )}
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
  );
}

export default RecordingInProgress;
