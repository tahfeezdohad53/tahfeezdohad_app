"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RxCross2 } from "react-icons/rx";

export default function Modal({ children, onClose,heading }) {
    const [isMounted,setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    },[])
    if(!isMounted) return;
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FFF1D3] p-8 rounded-xl w-3/4 h-1/2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-2 top-2"
        >
          <RxCross2 />
        </button>
        <h1 className="text-center mb-3 text-lg tracking-wider font-semibold">
          {heading}
        </h1>
        {children}
      </div>
    </div>,
    document.getElementById("root"),
  );
}
