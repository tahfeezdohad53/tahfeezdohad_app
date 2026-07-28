'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TableController({totalRes}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = searchParams.get('page');
    useEffect(() => {
      const urlSearchParams = new URLSearchParams(searchParams);
        if(!searchParams.get('page')) urlSearchParams.set('page','1');
        if(!searchParams.get('role')) urlSearchParams.set("role", "student");
        if(!searchParams.get('batch')) urlSearchParams.set('batch','yaqoot_mardo');
        router.replace(`${pathname}?${urlSearchParams}`,{scroll:false});
    },[])
    function handleNextPage(){
      const urlSearchParams = new URLSearchParams(searchParams);
      const totalPages = Math.ceil(totalRes / 10);
      if(Number(searchParams.get('page')) === totalPages) return;
      const nextPage = Number(searchParams.get("page")) + 1;
      urlSearchParams.set("page", nextPage);
      router.replace(`${pathname}?${urlSearchParams}`, { scroll: false });
    }
    function handlePreviousPage(){
      if(searchParams.get('page') === '1') return;
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.set('page',Number(searchParams.get('page')) - 1);
      router.replace(`${pathname}?${urlSearchParams}`,{scroll:false})
    }
  if(totalRes)return (
    <div className=" flex items-center justify-between border border-gray-200 bg-(--card) px-5 py-4 shadow-sm">
      {/* Left */}
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{page}</span> out of{" "}
        <span className="font-semibold text-gray-900">{Math.ceil(totalRes / 10)}</span>
      </p>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button onClick={handlePreviousPage} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
          ←
        </button>

        <div className="flex h-10 min-w-[44px] items-center justify-center rounded-xl bg-violet-100 px-4 text-sm font-semibold text-violet-700">
          {page}
        </div>

        <button onClick={handleNextPage} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-lg text-gray-600 transition hover:bg-gray-100">
          →
        </button>
      </div>
    </div>
  );
}
