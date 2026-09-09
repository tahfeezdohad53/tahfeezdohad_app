'use client';

import { useState } from "react";
import IkhtebaarReportCard from "./components/IkhtebaarReportCard"
import ReportRow from "./components/ReportRow";
import useReports from "./hooks/useReports";



function ReportsPage() {
    const {data:reports,isFetching} = useReports();
    const [isShowDetails,setIsShowDetails] = useState();
    return (
      <div className="p-5 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-3">

      
        {/* // <div className=" p-5 px-3 flex gap-2 w-full overflow-hidden"> */}
          {reports?.map(el => <IkhtebaarReportCard key={el._id} report={el}/>)}
          {/* <div
            className={`${isShowDetails ? "w-[65%]" : "w-full"} transition-all duration-300 ease-in-out`}
          >
            <div className="grid grid-cols-7 font-bold px-3 text-amber-800">
              <p>Date</p>
              <p className="col-span-2">Student</p>
              <p className="col-span-2">Teacher</p>
              <p>Class</p>
              <p>Mode</p>
            </div>
            <div className="mt-3"></div>
            <ReportRow show={setIsShowDetails} />
            <ReportRow />
            <ReportRow />
            <ReportRow />
            <ReportRow />
            <ReportRow />
            <ReportRow />
            <ReportRow />
            <ReportRow />
            <ReportRow />
          </div>

          <div
            className={`${isShowDetails ? "right-0" : "-right-full"} transition-all duration-300 ease-in-out min-w-[30%] max-w-[30%] border border-(--border) shadow-(--shadow-md) h-full absolute top-0 bg-[#FFF7EB]`}
          ></div> */}
        </div>
      
    );
}

export default ReportsPage
