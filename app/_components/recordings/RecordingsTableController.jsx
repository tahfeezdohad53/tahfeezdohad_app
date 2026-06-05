'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
  IoIosArrowForward,
} from "react-icons/io";

function RecordingsTableController({totalRes}) {
    const params = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [page,setPage] = useState(1);
    useEffect(() => {
        const searchParams = new URLSearchParams(params);
        searchParams.set('page','1');
        router.replace(`${pathname}?${searchParams}`);
    },[pathname,router])

    function nextPage(){
        if(page === Math.ceil(totalRes / 10)) return;
        setPage(page + 1);
        const searchParams = new URLSearchParams(params);
        searchParams.set("page", page + 1);
        router.replace(`${pathname}?${searchParams}`,{scroll:false});
    }
    function previousPage(){
        if(page === 1) return;
        setPage(page - 1);
        const searchParams = new URLSearchParams(params);
        searchParams.set("page", page - 1);
        router.replace(`${pathname}?${searchParams}`,{scroll:false});
    }
  return (
    <div className="text-sm py-2 flex justify-between items-center gap-x-3 pl-3 pr-1 bg-(--highlight) shadow-sm">
      <p>{page} out of {Math.ceil(totalRes / 10)} pages</p>

      <div className="flex items-center gap-2">
        <button onClick={previousPage} className=" p-1 rounded-md bg-orange-50">
          <IoIosArrowBack  className="text-2xl text-amber-800" />
        </button>
    <span className="p-1  px-3 rounded-md bg-(--primary)/90 text-white/90">
      {page}
    </span>
        <button onClick={nextPage} className=" p-1 rounded-md bg-orange-50">
          <IoIosArrowForward className="text-2xl text-amber-800" />
        </button>
      </div>
    </div>
  );
}

export default RecordingsTableController;
