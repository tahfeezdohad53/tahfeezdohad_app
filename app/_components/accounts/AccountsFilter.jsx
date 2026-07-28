"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function AccountFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = searchParams.get("role");
   const { data } = useQuery({
     queryKey: ["totalAccounts",],
     queryFn: handleGetAccounts,
     refetchOnWindowFocus: false,
     placeholderData: keepPreviousData,
   });
   async function handleGetAccounts() {
     try {
       const { data } = await axios.get(
         `${process.env.NEXT_PUBLIC_URL}/user/totalAccounts`,
         { withCredentials: true },
       );
       return data;
     } catch (err) {
       console.log(err);
       toast.error("failed to load accounts");
       return [];
     }
   }
  useEffect(() => {
    if (!searchParams.get("role")) {
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.set("role", "student");
      router.replace(`${pathname}?${urlSearchParams}`, { scroll: false });
    }
  }, []);

  function handleFilter(type,value){
    const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.set(type, value);
      urlSearchParams.set('page','1')
      router.replace(`${pathname}?${urlSearchParams}`, { scroll: false });
  }
  return (
    <div className="rounded-2xl border border-(--border) bg-(--card) p-6 py-2 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-6">
        {/* Left Side */}
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Role
            </label>

            <select
              onChange={(e) => handleFilter("role", e.target.value)}
              value={role || "student"}
              className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-violet-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Batch
            </label>

            <div className="flex flex-1 gap-3">
              <select
                onChange={(e) => handleFilter("batch", e.target.value)}
                value={searchParams.get("batch") || ""}
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-violet-500"
              >
                <option value="yaqoot_mardo">yaqoot_mardo</option>
                <option value="yaqoot_bairo">yaqoot_bairo</option>
                <option value="baneen">baneen</option>
                <option value="banaat">banaat</option>
                <option value="kibaar">kibaar</option>
                <option value="taheri_hall">taheri_hall</option>
              </select>
            </div>
          </div>

          <div className="self-end text-xs py-3 rounded-xl bg-amber-100/50 pl-4 pr-8 text-left">
            <p>
              Teachers:{" "}
              <span className="font-bold text-amber-900">
                {data?.teacherTotalCount}
              </span>
            </p>
            <p>
              students: <span className="font-bold text-amber-900">{data?.studentTotalCount}</span>
            </p>
          </div>
        </div>

        {/* Right Side */}
      </div>
    </div>
  );
}
