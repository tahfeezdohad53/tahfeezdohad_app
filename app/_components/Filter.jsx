"use client";
import { IoFilter } from "react-icons/io5";
import Modal from "./Modal";
import CustomSelect from "./Select";
import { Suspense, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { SlCalender } from "react-icons/sl";
import CustomDateRangePicker from "./CustomDateRangePicker";

const teachers = [
  {
    label: "janab mulla aliasgar bhai adil",
    value: "janab mulla aliasgar bhai adil",
  },
  {
    label: "huzefa ratlam",
    value: "huzefa ratlam",
  },
  {
    label: "fakhruddin charchoda",
    value: "fakhruddin charchoda",
  },
  {
    label: "abbas jiniya",
    value: "abbas jiniya",
  },
  {
    label: "murtaza dudhiya",
    value: "murtaza dudhiya",
  },
];

const students = [
  {
    label: "all",
    value: "all",
  },
  {
    label: "aliasgar hasham",
    value: "aliasgar hasham",
  },
  {
    label: "taha chati",
    value: "taha chati",
  },
  {
    label: "hasan challa",
    value: "hasan challa",
  },
  {
    label: "burhanuddin soda",
    value: "burhanuddin soda",
  },
  {
    label: "yusuf naya",
    value: "yusuf naya",
  },
];

function Filter({role}) {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [filterType, setFilterType] = useState("");

 

  return (
    <div className="relative px-2 rounded-md bg-(--layer) shadow w-fit">
      <button onClick={() => setIsShowFilter(!isShowFilter)}>
        <IoFilter />
      </button>

      <div
        className={`
    absolute right-0 top-full mt-3 w-48 overflow-hidden
    rounded-2xl border border-yellow-700/40
    bg-yellow-900/95 backdrop-blur-md
    shadow-2xl shadow-black/30
    transition-all duration-300 ease-out
    ${
      isShowFilter
        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
        : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
    }
  `}
      >
        <FilterButton
          onClick={() => {
            setFilterType("student");
            setIsShowFilter(false);
            setIsShowModal(true);
          }}
        >
          <PiStudentBold /> Students
        </FilterButton>

        <div className="h-px bg-yellow-700/40" />
        {role === 'admin' && <FilterButton
          onClick={() => {
            setFilterType("teacher");
            setIsShowFilter(false);
            setIsShowModal(true);
          }}
        >
          <LiaChalkboardTeacherSolid /> Teacher
        </FilterButton>}

        <div className="h-px bg-yellow-700/40" />
        <FilterButton
          onClick={() => {
            setFilterType("date");
            setIsShowFilter(false);
            setIsShowModal(true);
          }}
        >
          <SlCalender /> Date
        </FilterButton>
      </div>

      <Suspense>
        {isShowModal && (
          <Modal
            heading={filterType === 'student' && 'select student' || filterType === 'teacher'&&'select teacher' || filterType==='date'&&'select date'}
            onClose={() => setIsShowModal(false)}
            className={filterType === "date" && "h-fit w-fit"}
          >
            {filterType === "date" && (
              <CustomDateRangePicker
              />
            )}

            {filterType !== "date" && (
              <>
                <CustomSelect
                  options={filterType === "student" ? students : teachers}
                  filterType={filterType}
                />
              </>
            )}
          </Modal>
        )}
      </Suspense>
    </div>
  );
}
export default Filter;

function FilterButton({ onClick, children }) {
  return (
    <button
      className="flex items-center gap-3 w-full px-5 py-3 text-left text-sm text-yellow-100 hover:bg-yellow-800/70 transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}