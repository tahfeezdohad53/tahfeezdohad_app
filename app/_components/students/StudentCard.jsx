'use client';
import Image from "next/image";
import Link from "next/link";
import { Item, Separator, useContextMenu } from "react-contexify";
import { BiDotsVertical } from "react-icons/bi";
import { FaEdit, FaMicrophone, FaUserCircle } from "react-icons/fa";
import ContextMenu from "../ContextMenu";
import { CiMicrophoneOn } from "react-icons/ci";
import { useState } from "react";
import Modal from "../Modal";
import CustomSelect from "../Select";
import { changeDiary } from "@/actions/student";
import { MdDelete } from "react-icons/md";
import { useAppProvider } from "../providers/AppProvider";

function StudentCard({ image, name, studentId }) {
  
  return (
    <div className="flex justify-center">
      <div className="relative rounded-md w-3/4 border-t-4 border-amber-900 bg-(--layer) shadow border border-x-(--border) border-b-(--border)">
        <button
          data-studentid={studentId}
          data-studentname={name}
          className="menu-btn absolute right-2 top-2 w-8 flex justify-center py-1"
        >
          <BiDotsVertical className=" text-lg" />
        </button>
        <div
          // href={`/entry/${studentId}`}
          className=" flex flex-col items-center  w-full p-4 rounded-md  gap-2"
        >
          {image && (
            <div className="relative h-18 w-18 rounded-full overflow-hidden">
              <Image src={image} alt="user photo" fill />
            </div>
          )}
          {!image && <FaUserCircle className="text-5xl text-amber-950" />}
          <p className="font-semibold text-stone-800 tracking-wider text-xs text-center">
            {name}
          </p>
          <Link
            href={`/entry/${studentId}`}
            className="border rounded-full shadow-md p-2 bg-amber-800 text-white"
          >
            <FaMicrophone className=""/>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentCard
