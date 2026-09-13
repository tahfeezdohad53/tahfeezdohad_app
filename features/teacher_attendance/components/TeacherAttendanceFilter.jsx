'use client';

import Filter from "@/app/_components/Filter";
import { useAppProvider } from "@/app/_components/providers/AppProvider";
import useFilter from "@/shared/hooks/useFilter";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { CiFilter, CiUser } from "react-icons/ci";
import { FaCalendar, FaRegCalendarAlt, FaRegUser, FaUser, FaUserAlt } from "react-icons/fa"
import { IoIosArrowDown } from "react-icons/io"
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { RotateCcw } from "lucide-react";
import { useUser } from "@/app/_components/providers/UserProvider";

function TeacherAttendanceFilter() {
    const {user} = useUser();
    const {teachers} = useAppProvider();
    const [isShowDatePicker,setIsShowDatePicker] = useState(false);
    const [isShowTeacherSelect,setIsShowTeacherSelect] = useState(false);
    const {searchParams,pathname,router} = useFilter();

    function handleFilter(filters){
        const url = new URLSearchParams(searchParams);
        filters.forEach(el => url.set(el.key,el.value));
        router.replace(`${pathname}?${url}`,{scroll:false});
    }
    function handleReset(){
        const url = new URLSearchParams(searchParams);
        url.delete('teacher')
        url.delete('startDate')
        url.delete('endDate')
        url.set('page',1);
        router.replace(`${pathname}?${url}`,{scroll:false});
    }

    const formattedTeachers = teachers?.map(el => {
        return {label:el.name,value:el._id}
    })
    return (
      <div className={`w-full py-3 mb-4 px-2 grid ${user?.role === 'admin' ? 'grid-cols-4':'grid-cols-3'} gap-1`}>
        <div
          onClick={() => setIsShowDatePicker(true)}
          className=" flex items-center justify-between text-xs border border-gray-300  p-2  rounded-md shadow-(--shadow-sm)"
        >
          <div className="flex items-center gap-1 lg:gap-2">
            <FaRegCalendarAlt />
            <p className="text-[0.65rem]">Date</p>
          </div>

          <IoIosArrowDown className="hidde lg:block" />
        </div>

        {user?.role === 'admin' && <div
          onClick={() => setIsShowTeacherSelect(true)}
          className=" flex items-center justify-between text-xs border border-gray-300  p-2  rounded-md shadow-(--shadow-sm)"
        >
          <div className="flex items-center  gap-1 lg:gap-2">
            <CiUser />
            <p className="text-[0.65rem]">Teacher</p>
          </div>

          <IoIosArrowDown className="hidde lg:block" />
        </div>}

        <div onClick={() => alert('under development')} className=" flex items-center justify-between text-xs border border-gray-300  p-2  rounded-md shadow-(--shadow-sm)">
          <div className="flex items-center  gap-1 lg:gap-2">
            <CiFilter />
            <p className="text-[0.65rem]">Status</p>
          </div>

          <IoIosArrowDown className="hidde lg:block" />
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200
             bg-(--card) px-3 py-2 text-[0.65rem] font-medium text-gray-600
             shadow-sm transition-all
             hover:border-red-200 hover:bg-red-50 hover:text-red-600
             active:scale-[0.98]"
        >
          <RotateCcw size={13} strokeWidth={2} />
          Reset
        </button>

        {isShowTeacherSelect && (
          <TeacherFilterForm
            setIsShowTeacherSelect={setIsShowTeacherSelect}
            formattedTeachers={formattedTeachers}
            handleFilter={handleFilter}
          />
        )}
        {isShowDatePicker && (
          <DateFilterForm
            setIsShowDatePicker={setIsShowDatePicker}
            handleFilter={handleFilter}
          />
        )}
      </div>
    );
}

export default TeacherAttendanceFilter



export function Modal({children,onClose}){
    return (
      <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[1px] px-4">
        <div onClick={(e) => e.stopPropagation()} className="relative w-[98%] lg:w-1/4 rounded-xl border border-gray-200 bg-(--card) p-4 shadow-xl">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center
                 rounded-full text-gray-400 transition
                 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <IoClose size={18} />
          </button>
            {children}
        </div>
      </div>
    );
}

function TeacherFilterForm({ setIsShowTeacherSelect, formattedTeachers ,handleFilter}) {
  return (
    <Modal onClose={() => setIsShowTeacherSelect(false)}>
      <div className="mb-4 pr-8">
        <h2 className="text-sm font-semibold text-gray-900">
          Filter by Teacher
        </h2>

        <p className="mt-1 text-[11px] text-gray-500">
          Select a teacher to view their attendance.
        </p>
      </div>

      {/* Select */}
      <Select
        options={formattedTeachers}
        placeholder="Choose a teacher..."
        onChange={({ value }) => handleFilter([{key:'teacher',value}])}
      />

      {/* Subtle hint */}
      <p className="mt-3 text-center text-[10px] text-gray-400">
        Results update automatically
      </p>
    </Modal>
  );
}

function DateFilterForm({ setIsShowDatePicker , handleFilter}) {
    const {searchParams} = useFilter();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const [range,setRange] = useState([{startDate:startDate || new Date(),endDate:endDate || new Date()}]);
  return (
    <Modal onClose={() => setIsShowDatePicker(false)}>
      <div className="mb-4 pr-8 w-full">
        <h2 className="text-sm font-semibold text-gray-900">Filter by Date</h2>

        <p className="mt-1 text-[11px] text-gray-500">
          Select a date range to view attendances in a specified time.
        </p>
      </div>

      {/* Select */}
      <div className=" w-full flex justify-center  rounded-md py-1">
        <div className="shadow-(--shadow-md) border border-gray-200 rounded-md overflow-hidden">
          <DateRangePicker
            ranges={range}
            onChange={(el) => {
              const startDate = el.range1.startDate;
              const endDate = el.range1.endDate;
              setRange([{ startDate, endDate }]);
              handleFilter([
                { key: "startDate", value: startDate },
                { key: "endDate", value: endDate },
              ]);
            }}
          />
        </div>
      </div>

      {/* Subtle hint */}
      <p className="mt-3 text-center text-[10px] text-gray-400">
        Results update automatically
      </p>
    </Modal>
  );
}