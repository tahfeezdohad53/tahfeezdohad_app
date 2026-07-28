'use client';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import AccountRow from "./AccountRow";
import TableController from "./TableController";
import toast from "react-hot-toast";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
const users = [
  {
    _id: "1",
    its: "30404001",
    name: "Huzefa Ratlam",
    role: "Admin",
    batch: null,
  },
  {
    _id: "2",
    its: "30404002",
    name: "Ali Taher",
    role: "Teacher",
    batch: "Batch A",
  },
  {
    _id: "3",
    its: "30404003",
    name: "Fatema Yusuf",
    role: "Student",
    batch: "Batch A",
  },
  {
    _id: "4",
    its: "30404004",
    name: "Mohammed Saif",
    role: "Student",
    batch: "Batch B",
  },
  {
    _id: "5",
    its: "30404005",
    name: "Sakina Bai",
    role: "Student",
    batch: "Batch C",
  },
  {
    _id: "6",
    its: "30404006",
    name: "Nooruddin Bhai",
    role: "Teacher",
    batch: "Batch B",
  },
  {
    _id: "7",
    its: "30404007",
    name: "Sarrah Bai",
    role: "Student",
    batch: "Batch A",
  },
  {
    _id: "8",
    its: "30404008",
    name: "Taher Hussain",
    role: "Student",
    batch: "Batch D",
  },
  {
    _id: "9",
    its: "30404009",
    name: "Ahmed Kapadia",
    role: "Teacher",
    batch: "Batch C",
  },
  {
    _id: "10",
    its: "30404010",
    name: "Zainab Mulla",
    role: "Student",
    batch: "Batch B",
  },
];

export default function AccountsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get('page');
  const batch = searchParams.get('batch');
  const role = searchParams.get('role');
  const {data} = useQuery({
    queryKey:['accounts',page,batch,role],
    queryFn:handleGetAccounts,
    refetchOnWindowFocus:false,
    placeholderData:keepPreviousData,
  })
  async function handleGetAccounts(){
    try{
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/user/getAccounts?page=${page}&batch=${batch}&role=${role}`,
        { withCredentials: true },
      );
      return data;
    }catch(err){
      console.log(err);
      toast.error('failed to load accounts');
      return [];
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-(--card) shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-[70px_2fr_1fr_1fr_1fr] border-b border-gray-200 bg-(--bg-tertiary)/30 px-6 py-4 text-sm font-semibold text-gray-700">
        <div>#</div>
        <div>Name</div>
        <div>ITS</div>
        <div>Role</div>
        <div>Batch</div>
      </div>

      {/* Rows */}
      <div className="overflow-auto flex-1 overflow-auto">
        {data?.accounts?.map((user, index) => (
          <AccountRow
            key={user._id}
            user={user}
            index={(Number(page) - 1) * 10 + index}
          />
        ))}
      </div>

      <TableController totalRes={data?.totalRes} />
    </div>
  );
}
