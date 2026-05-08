import Link from "next/link";
import EntryButtons from "../_components/EntryButtons"
import { FaArrowLeftLong } from "react-icons/fa6";
import { GrNotes } from "react-icons/gr";

function Page() {
    return (
      <div className="h-full">
        <h1 className="text-2xl underline-offset-8 underline mt-10 font-semibold tracking-wider flex items-center gap-2 justify-center">
          <GrNotes /> Instructions
        </h1>
        <div className="mt-10 px-5 space-y-3">
          <p className="text-xs text-amber-900 font-semibold tracking-wide">
            1) do not refresh browser while recording
          </p>
          <p className="text-xs text-amber-900 font-semibold tracking-wide">
            2) in case of receiving a call or some work you can pause and resume
            recording
          </p>
          <p className="text-xs text-amber-900 font-semibold tracking-wide">
            3) recording will automatically stop at 60 mins
          </p>
          <p className="text-xs text-amber-900 font-semibold tracking-wide">
            4) keep the recording device as close as possible with the student
          </p>
          <p className="text-xs text-amber-900 font-semibold tracking-wide">
            5) after recording if you want to redirect to elearningquran website to complete entry please check the checkbox below
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <EntryButtons />
        </div>
      </div>
    );
}

export default Page
