'use client';

import useFilter from "@/shared/hooks/useFilter";
import { handleDownloadExcel } from "../api/handleDownloadExcel";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

function ExcelDownloadButton({attendanceLength}) {
  const { searchParams } = useFilter();

    return (
      <button
        onClick={() => {
            if(attendanceLength < 1) return toast.error("you don't have any attendance entry to export");
            handleDownloadExcel(searchParams);
        }}
        type="button"
        className="flex items-center gap-1.5 rounded-lg border border-gray-200
             bg-(image:--gradient-primary) text-white px-3 py-2 text-xs font-medium 
             shadow-sm transition-all
             hover:scale-105 hover:cursor-pointer
             active:scale-[0.98]"
      >
        <Download size={14} strokeWidth={2} />
        Export
      </button>
    );
}

export default ExcelDownloadButton
