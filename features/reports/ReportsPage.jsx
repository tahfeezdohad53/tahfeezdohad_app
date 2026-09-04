'use client';

import IkhtebaarReportCard from "./components/IkhtebaarReportCard"
import useReports from "./hooks/useReports";

function ReportsPage() {
    const {data:reports,isFetching} = useReports();
    return (
      <div className="p-5 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-3">
        {reports?.map(el => <IkhtebaarReportCard key={el._id} report={el}/>)}
      </div>
    );
}

export default ReportsPage
