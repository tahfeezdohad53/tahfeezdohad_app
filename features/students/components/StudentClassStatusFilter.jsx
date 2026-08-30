'use client';

import useSetSearchParams from "@/shared/hooks/useFilter";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiRefresh } from "react-icons/bi";

function StudentClassStatusFilter() {
    const queryClient = useQueryClient();
    const {handleChangeSearchParams,searchParams} = useSetSearchParams();
  return (
    <div>
      <div className="text-[0.70rem] mb-5 flex gap-3 items-center justify-center">
        <button
          onClick={() => handleChangeSearchParams("classStatus", "all")}
          className={`${searchParams.get("classStatus") === "all" ? "bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)" : "bg-(--card) border-transparent"} border-  hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          All
        </button>
        <button
          onClick={() => handleChangeSearchParams("classStatus", "pending")}
          className={`${searchParams.get("classStatus") === "pending" ? "bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)" : "bg-(--card) border-transparent"} border-  hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Pending
        </button>
        <button
          onClick={() => handleChangeSearchParams("classStatus", "recorded")}
          className={`${searchParams.get("classStatus") === "recorded" ? "bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)" : "bg-(--card) border-transparent"} border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all  shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Recorded
        </button>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["myStudents"] })
          }
          className={`bg-(--card) border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all  shadow-(--shadow-md) p-2 rounded-md `}
        >
          <BiRefresh className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default StudentClassStatusFilter;
