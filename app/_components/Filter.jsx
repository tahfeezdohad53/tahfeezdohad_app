'use client';
import { IoFilter } from "react-icons/io5"
import Modal from "./Modal";
import CustomSelect from "./Select";
import { useState } from "react";

const teachers = [
    {label:'janab mulla aliasgar bhai adil'},
    {label:'huzefa ratlam'},
    {label:'fakhruddin charchoda'},
    {label:'abbas jiniya'},
    {label:'murtaza dudhiya'},
]

const students = [
    {label:'aliasgar hasham'},
    {label:'taha chati'},
    {label:'hasan challa'},
    {label:'burhanuddin soda'},
    {label:'husain rang'},
]

function Filter() {
    const [isShowFilter,setIsShowFilter] = useState(false);
    const [isShowModal,setIsShowModal] = useState(false);
    const [heading,setHeading] = useState('');
    return (
      <div className="relative px-2 rounded-md bg-(--layer) shadow w-fit">
        <button onClick={() => setIsShowFilter(!isShowFilter)}>
          <IoFilter />
        </button>
        {isShowFilter && (
          <div className="rounded-md py-2 tracking-widest font-normal absolute text-white bg-[#A47251] shadow-md right-0 top-full mt-1">
            <button
              className="px-8"
              onClick={() => {
                setHeading("select student");
                setIsShowFilter(false);
                setIsShowModal(true);
              }}
            >
              students
            </button>
            <hr className="text-stone-300" />
            <button
              className="px-8"
              onClick={() => {
                setHeading("select teacher");
                setIsShowFilter(false);
                setIsShowModal(true);
              }}
            >
              teacher
            </button>
          </div>
        )}
        {isShowModal && (
          <Modal onClose={() => setIsShowModal(false)} heading={heading}>
            <CustomSelect options={heading === 'select student' ? students:teachers}/>
          </Modal>
        )}
      </div>
    );
}

export default Filter
