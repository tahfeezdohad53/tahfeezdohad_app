"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RxCross2 } from "react-icons/rx";

export default function Modal({ children, onClose,className,heading, headingStyles }) {
    const [isMounted,setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    },[])
    if(!isMounted) return;
  return createPortal(
    <div
      onClick={onClose}
      className="z-1000 fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-(--card) p-8 py-3 pb-5 rounded-xl w-3/4 lg:w-[30%] h-1/2 ${className}`}
      >
        <h1 className={`font-bold text-center mb-3 text-lg tracking-wider text-amber-950 ${headingStyles}`}>
          {/* {filterType === "student" ? "select student" : "select teacher"} */}
          {heading}
        </h1>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute hover:cursor-pointer p-2 rounded-md hover:bg-(--card-hover) duration-300 ease-in-out transition-all  right-2 top-2"
        >
          <RxCross2 />
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("root"),
  );
}
