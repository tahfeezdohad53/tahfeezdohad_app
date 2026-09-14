'use client';

import useFilter from "@/shared/hooks/useFilter";
import useSetSearchParams from "@/shared/hooks/useSetSearchParams";
import { useEffect } from "react";

function TeacherAttendanceTablePaginationController({count=1}) {
  // useSetSearchParams({paramsList:[{key:'page',value:'1'}]});
  const {searchParams,pathname,router} = useFilter();

  const page = searchParams.get("page");

  function handleNextPage() {
    const pageNo = Number(page);
    if (pageNo === Math.ceil(count / 10) || Math.ceil(count) === 0) return;
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("page", pageNo + 1);
    router.replace(`${pathname}?${urlParams}`, { scroll: false });
  }

  function handlePreviousPage() {
    const pageNo = Number(page);
    if (pageNo === 1) return;
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("page", pageNo - 1);
    router.replace(`${pathname}?${urlParams}`, { scroll: false });
  }
    return (
      <div className="flex  justify-between items-center w-full text-xs text-gray-600 px-3 py-3 bg-white border-t rounded-br-md rounded-bl-md border-gray-200">
        <p>showing {page} out of {Math.ceil(count / 10)} pages</p>
        {/* <p>showing 1-9 out of 128 entries</p> */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousPage}
            className="flex px-3 py-1 items-center justify-center rounded-xl border border-gray-300 text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ←
          </button>

          <div className="flex py-2 items-center justify-center rounded-xl bg-blue-100 px-4 text-sm font-semibold text-blue-700">
            {page}
          </div>

          <button
            onClick={handleNextPage}
            className="flex px-3 py-1 items-center justify-center rounded-xl border border-gray-300 text-lg text-gray-600 transition hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>
    );
}

export default TeacherAttendanceTablePaginationController
