'use client';

import CustomDateRangePicker from "@/app/_components/CustomDateRangePicker";
import { useAppProvider } from "@/app/_components/providers/AppProvider"
import CustomSelect from "@/app/_components/Select";
import { api } from "@/lib/axios";
import useFilter from "@/shared/hooks/useFilter";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoFilterOutline } from "react-icons/io5"

function ReportsFilter() {
    const {students} = useAppProvider();
    const {searchParams,router,pathname} = useFilter();
    const formattedStudents = students?.map(el => ({label:el.name,value:el._id}));
    const [isShowDatePicker,setIsShowDatePicker] = useState(false);
    function handler({value}){
        const params = new URLSearchParams(searchParams);
        params.set('student', value);
        router.replace(`${pathname}?${params}`);
    }
    function reset(){
        const params = new URLSearchParams(searchParams);
        params.delete('student');
        params.delete('startDate');
        params.delete('endDate');
        router.replace(`${pathname}?${params}`);
    }

    async function handleDownloadExcel(){
      try{
        const {data} = await api.get('report/excel',{responseType:'blob'});
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.download = 'ikhtebaar_reports_excel';
        a.href = url;
        document.documentElement.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.documentElement.removeChild(a);
      }catch(err){
        toast.error('oops! something went wrong.');
      }
    }
    return (
      <div className="flex items-center gap-2 w-full">
        {/* <button className="flex items-center gap-2 ml-auto"><IoFilterOutline /> Filter</button> */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          <CustomSelect
            options={formattedStudents}
            handleOnChange
            handler={handler}
          />
          <button
            onClick={() => setIsShowDatePicker(!isShowDatePicker)}
            className="hover:cursor-pointer p-1 bg-white rounded-md flex items-center px-5 "
          >
            <h1>Select Date</h1>
            {isShowDatePicker && (
              <div
                className="backdrop-brightness-50 fixed top-1/2 left-1/2 -translate-1/2 w-full h-screen flex items-center justify-center"
                onClick={(e) => setIsShowDatePicker(false)}
              >
                <div onClick={(e) => e.stopPropagation()} className="">
                  <CustomDateRangePicker className=" shadow-(--shadow-lg) rounded-md w-full" />
                </div>
              </div>
            )}
          </button>
        </div>
        <button
          className="p-2 bg-(--primary) text-white rounded-md"
          onClick={reset}
        >
          reset
        </button>
        <button
          className="hidden lg:block p-2 bg-blue-600 text-white rounded-md"
          onClick={handleDownloadExcel}
        >
          export
        </button>
      </div>
    );
}

export default ReportsFilter
