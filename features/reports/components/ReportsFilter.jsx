'use client';

import { useAppProvider } from "@/app/_components/providers/AppProvider"
import CustomSelect from "@/app/_components/Select";
import useFilter from "@/shared/hooks/useFilter";
import { IoFilterOutline } from "react-icons/io5"

function ReportsFilter() {
    const {students} = useAppProvider();
    const {searchParams,router,pathname} = useFilter();
    const formattedStudents = students?.map(el => ({label:el.name,value:el._id}));
    // console.log('int: ' , formattedStudents[0].value)
    console.log('int: ' , searchParams.get('student'));
    function handler({value}){
        const params = new URLSearchParams(searchParams);
        params.set('student', value);
        router.replace(`${pathname}?${params}`);
    }
    function reset(){
        const params = new URLSearchParams(searchParams);
        params.delete('student');
        router.replace(`${pathname}?${params}`);
    }
    return (
      <div className="flex items-center gap-2 w-full">
        {/* <button className="flex items-center gap-2 ml-auto"><IoFilterOutline /> Filter</button> */}
        <div className="flex-1">
          <CustomSelect
            options={formattedStudents}
            handleOnChange
            handler={handler}
          />
        </div>
        <button
          className="p-2 bg-(--primary) text-white rounded-md"
          onClick={reset}
        >
          reset
        </button>
      </div>
    );
}

export default ReportsFilter
