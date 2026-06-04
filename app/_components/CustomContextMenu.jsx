'use client';

import { useEffect, useRef } from "react";

function CustomContextMenu({options,className,onClose}) {
    const ref = useRef(null);
    function close(e){
        if(!ref.current.contains(e.target)) onClose();
    }
    useEffect(() => {
        document.documentElement.addEventListener('click',close);
        return () => document.documentElement.removeEventListener('click',close);
    },[])
    return (
        <div ref={ref} className={`absolute flex flex-col top-[110%] z-999 right-1 rounded-md shadow-2xl bg-(--card)`}>
            {options?.map(el => {
            return <button onClick={el?.handler} key={el?.text} className={`flex items-center gap-3 text-sm text-left py-3 px-3 border-b border-(--border) hover:bg-(--card-hover) ${className}`}>
              {el?.icon} {el?.text}
            </button>
            })}
        </div>
    )
}

export default CustomContextMenu
