'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";

function CustomContextMenu({options,className,onClose}) {
    const ref = useRef(null);
    function close(e){
        if(!ref.current.contains(e.target)) onClose();
    }
    useEffect(() => {
        document.documentElement.addEventListener('click',close);
        return () => document.documentElement.removeEventListener('click',close);
    },[])
    const searchParams = useSearchParams();
    
    return (
        <div ref={ref} className={`absolute flex flex-col top-[110%] z-999 right-1 rounded-md shadow-(--shadow-lg) border border-(--border)/50 bg-(--card)`}>
            {options?.map(el => {
            return (
              <button
                onClick={el?.handler}
                key={el?.text}
                className={`${el?.textColor} ${el?.bg} relative pr-10 flex items-center gap-3 text-sm text-left py-3 px-3 border-b border-(--border) hover:bg-(--card-hover) ${className}`}
              >
                {el?.icon} {el?.text}{" "}
                {searchParams.has(el?.name,el?.value) &&
                  <FaCheck className="text-[0.60rem] absolute right-5 text-blue-500" />
                }
              </button>
            );
            })}
        </div>
    )
}

export default CustomContextMenu
