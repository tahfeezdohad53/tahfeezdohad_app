'use client';

import { useUser } from "@/app/_components/providers/UserProvider";
import useFilter from "@/shared/hooks/useFilter";
import useSetSearchParams from "@/shared/hooks/useSetSearchParams";

const batches = [
  { value: "all", label: "All" },
  { value: "yaqoot_mardo", label: "Yaqoot (mardo)" },
  { value: "yaqoot_bairo", label: "Yaqoot (bairo)" },
  { value: "atfaal", label: "Baneen/Banaat" },
  { value: "kibaar", label: "Kibar" },
  { value: "taheri_hall", label: "Taheri hall" },
  { value: "online", label: "Online" },
];

function TeacherAttendanceBatchFilter() {
    const { searchParams,pathname,router } = useFilter();
    const {user} = useUser();
    function handleChangeSearchParams(key,value) {
        const url = new URLSearchParams(searchParams);
        url.set(key,value);
        url.set('page',"1");
        router.replace(`${pathname}?${url}`,{scroll:false});
    }

    // useSetSearchParams({paramsList:[{key:'batch',value:'all'}],guardClause:() => {
    //     if(searchParams.get('batch') && user?.role !== 'admin') return false;
    // }})
    return (
      <div className="text-[0.60rem] px-3 mt-3 justify-center flex-wrap flex gap-3 mb-3">
        {batches.map((batch) => {
          const isActive = searchParams.get("batch") === batch.value;

          return (
            <button
              key={batch.value}
              onClick={() => handleChangeSearchParams("batch", batch.value)}
              className={`${
                isActive
                  ? "bg-(--primary) text-white -translate-y-1 border-(--border)"
                  : "bg-gray-100 text-whit"
              } border border-gray-200  hover:cursor-pointer ease-in-out duration-300 transition-all shadow-(--shadow-sm) p-2 rounded-md`}
            >
              {batch.label}
            </button>
          );
        })}
      </div>
    );
}

export default TeacherAttendanceBatchFilter
