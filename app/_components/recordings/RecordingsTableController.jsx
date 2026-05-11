'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
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
        router.replace(`${pathname}?${searchParams}`);
    }
    function previousPage(){
        if(page === 1) return;
        setPage(page - 1);
        const searchParams = new URLSearchParams(params);
        searchParams.set("page", page - 1);
        router.replace(`${pathname}?${searchParams}`);
    }
  return (
    <div className="text-sm flex justify-between items-center gap-x-3 pl-3 pr-1 bg-(--highlight) shadow-sm">
      <p>{page} out of {Math.ceil(totalRes / 10)} pages</p>

      <div className="space-x-1">
        <button onClick={previousPage} className=" px-3 py-[0.4rem] rounded-md">
          <IoIosArrowDropleftCircle className="text-2xl text-amber-800" />
        </button>

        <button onClick={nextPage} className=" px-3 py-[0.4rem] rounded-md">
          <IoIosArrowDroprightCircle className="text-2xl text-amber-800" />
        </button>
      </div>
    </div>
  );
}

export default RecordingsTableController;
