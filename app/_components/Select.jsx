'use client';
import { changeDiary } from "@/actions/student";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Select from 'react-select';

export default function CustomSelect({options,filterType,isButton=false,handler,handleOnChange=false}) {
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
      {!handler && <Select options={options} onChange={handleChangeDateSelection} />}
      {(handler && !handleOnChange) && <Select options={options} onChange={e => setValue(e.value)}/>}
      {(handler && handleOnChange) && <Select options={options} onChange={e => handler({value:e.value,label:e.label})}/>}
      {isButton && <button onClick={() => handler(value)} className="w-full text-white/90 mt-5 bg-(image:--gradient-primary) rounded-md py-2 shadow-lg">
        Update
      </button>}
    </>
  );
};