import Link from "next/link";
import EntryButtons from "../../_components/EntryButtons"
import { FaArrowLeftLong } from "react-icons/fa6";
import { GrNotes } from "react-icons/gr";
import ProtectRoutes from "../../_components/auth/ProtectRoutes";
import { auth } from "@/auth";

async function Page({params,searchParams}) {
  const searchParam = await params;
  const queryParams = await searchParams;
  const session = await auth();
    return (
      <ProtectRoutes>
        <div className="h-full px-1">
          <h1 className="text-2xl underline-offset-8 underline mt-10 font-semibold tracking-wider flex items-center gap-2 justify-center">
            <GrNotes /> Instructions
          </h1>
          <div className="mt-10 p-5 shadow-lg rounded-md space-y-3 bg-(--layer)">
            <p className="text-xs text-amber-900 font-semibold tracking-wide">
              1) do not refresh browser while recording
            </p>
            <p className="text-xs text-amber-900 font-semibold tracking-wide">
              2) in case of receiving a call or some work you can pause and
              resume recording
            </p>
            <p className="text-xs text-amber-900 font-semibold tracking-wide">
              3) recording will automatically stop at 60 mins
            </p>
            <p className="text-xs text-amber-900 font-semibold tracking-wide">
              4) keep the recording device as close as possible with the student
            </p>
            <p className="text-xs text-red-700 font-bold tracking-wide">
              5) turning phone screen off or leaving browser in background for
              more than 60 sec will cause the recording to stop
            </p>
            <p className="text-xs text-amber-900 font-semibold tracking-wide">
              6) after recording if you want to redirect to elearningquran
              website to complete entry please check the checkbox below
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="w-fit px-3 rounded-md shadow-lg flex flex-col items-center justify-center bg-(--layer)">
              
              <EntryButtons
                studentId={searchParam.studentId}
                jwt={session?.jwt}
                studentName={queryParams.studentName}
              />
            </div>
          </div>
        </div>
      </ProtectRoutes>
    );
}

export default Page
