import Filter from "../_components/Filter";
import RecordingsContainer from "../_components/recordings/RecordingsContainer";

async function Page({searchParams}) {
  const params = await searchParams;
  
  return (
    // <ProtectRoutes>
    <div className="w-full h-full flex flex-col px-2 py-2 gap-3 ">
      {/* <Redirect unauthorizedRole={["student", "teacher"]} /> */}
      <div className="self-end">
        <Filter />
      </div>
      <div>
        <div className="relative rounded-2xl w-full lg:pb-2">
          <div className="w-full rounded-lg overflow-hidden lg:pb-0">
              <RecordingsContainer params={params} />
          </div>
        </div>
      </div>
    </div>
    // </ProtectRoutes>
  );
}

export default Page;
