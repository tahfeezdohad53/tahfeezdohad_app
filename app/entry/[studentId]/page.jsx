import ProtectRoutes from "../../_components/auth/ProtectRoutes";
import RecordingWrapper from "@/app/_components/entry/RecordingWrapper";

async function Page({params,searchParams}) {
  const searchParam = await params;
  const queryParams = await searchParams;
    return (
      // <ProtectRoutes>
        <div className=" flex w-full p-4 py-2 h-fit">
          <RecordingWrapper
            studentName={queryParams.studentName}
            studentId={searchParam.studentId}
          />
        </div>
      // </ProtectRoutes>
    );
}

export default Page
