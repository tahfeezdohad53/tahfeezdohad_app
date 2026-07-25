'use client';
import { changeDiary } from "@/actions/student";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

import Select from 'react-select';

export default function CustomSelect({isSubmitting,options,filterType,isButton=false,handler,handleOnChange=false}) {
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const router = useRouter();
   const [value,setValue] = useState('');
   function handleChangeDateSelection(el){
    const params = new URLSearchParams(searchParams);
    params.set(filterType,el.value);
    router.replace(`${pathname}?${params}`);
   }

  return (
    <>
      {!handler && (
        <Select options={options} onChange={handleChangeDateSelection} />
      )}
      {handler && !handleOnChange && (
        <Select options={options} onChange={(e) => setValue(e.value)} />
      )}
      {handler && handleOnChange && (
        <Select
          options={options}
          onChange={(e) => handler({ value: e.value, label: e.label })}
        />
      )}
      {isButton && (
        <button
          onClick={() => handler(value)}
          className="relative w-full text-white/90 mt-4 bg-(image:--gradient-primary) hover:cursor-pointer hover:-translate-y-1 duration-300 transition-all ease-in-out rounded-md py-2 shadow-lg"
        >
          <span className={`${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>Update</span>
          <ImSpinner2 className={`${isSubmitting ? 'absolute top-1/2 left-1/2 -translate-1/2' : 'hidden'} animate-spin text-lg`}/>
        </button>
      )}
    </>
  );
};