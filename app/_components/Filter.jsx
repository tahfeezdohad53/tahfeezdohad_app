"use client";
import { IoFilter } from "react-icons/io5";
import Modal from "./Modal";
import CustomSelect from "./Select";
import { Suspense, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { SlCalender } from "react-icons/sl";
import CustomDateRangePicker from "./CustomDateRangePicker";
import { CiCalendarDate, CiExport, CiFilter } from "react-icons/ci";
import { useUser } from "./providers/UserProvider";
import CustomContextMenu from "./CustomContextMenu";
import { useAppProvider } from "./providers/AppProvider";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { TfiExport } from "react-icons/tfi";
import { GoBlocked } from "react-icons/go";

// const teachers = [
//   {
//     label: "janab mulla aliasgar bhai adil",
//     value: "janab mulla aliasgar bhai adil",
//   },
//   {
//     label: "huzefa ratlam",
//     value: "huzefa ratlam",
//   },
//   {
//     label: "fakhruddin charchoda",
//     value: "fakhruddin charchoda",
//   },
//   {
//     label: "abbas jiniya",
//     value: "abbas jiniya",
//   },
//   {
//     label: "murtaza dudhiya",
//     value: "murtaza dudhiya",
//   },
// ];

// const students = [
//   {
//     label: "all",
//     value: "all",
//   },
//   {
//     label: "aliasgar hasham",
//     value: "aliasgar hasham",
//   },
//   {
//     label: "taha chati",
//     value: "taha chati",
//   },
//   {
//     label: "hasan challa",
//     value: "hasan challa",
//   },
//   {
//     label: "burhanuddin soda",
//     value: "burhanuddin soda",
//   },
//   {
//     label: "yusuf naya",
//     value: "yusuf naya",
//   },
// ];

function Filter({role}) {
  const {teachers,students} = useAppProvider();
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [filterType, setFilterType] = useState("");
  const {user} = useUser();
  const params = useSearchParams();
  const router = useRouter();
 
  const customizedTeachers = teachers?.map((el,i) => {
    if(i === 0) return {label:'all',value:''}
    else return { label: el.name, value: el.name };
  })
  const customizedStudents = students?.map((el,i) => {
    if (i === 0) return { label: "all", value: "" };
    else return { label: el.name, value: el.name };
  })
  if(user?.role === 'student' || user?.role === 'teacher') return null;

  async function handleDownloadExcel(){
    try{
      const res = await axios.get(
             `${process.env.NEXT_PUBLIC_URL}/recording/excel?page=${params.page || 1}&student=${params.get("student") || ""}&teacher=${params.get("teacher") || ""}&startDate=${params.get("startDate") || ""}&endDate=${params.get("endDate") || ""}`,
             {
               withCredentials:true,
               responseType:'blob'
             },
           );
           const url = window.URL.createObjectURL(res.data);

           const a = document.createElement('a');
           a.href = url;
           a.download = 'recordings.xlsx';

           document.body.appendChild(a);
           a.click();

           document.body.removeChild(a);
           window.URL.revokeObjectURL(url);
    }catch(err){
      console.log(err);
      toast.error('failed to download excel');
    }
  }
  return (
    <div className="relative  px-2 w-fit flex gap-5">
      <button onClick={handleDownloadExcel} className="flex font-semibold hover:cursor-pointer duration-300 ease-in-out transition-all hover:bg-blue-900 text-white text-sm items-center gap-3 px-4 py-2 bg-blue-800 rounded-md shadow-(--shadow-md)">
        <TfiExport className="text-white font-bold"/> export
      </button>
      <button
        className="flex font-semibold hover:cursor-pointer duration-300 ease-in-out transition-all hover:bg-(--primary) text-white text-sm items-center gap-3 px-4 py-2 bg-(--primary-light) rounded-md shadow-(--shadow-md)"
        onClick={() => setIsShowFilter(!isShowFilter)}
      >
        <CiFilter className="text-xl" /> Filter
      </button>
      {isShowFilter && (
        <CustomContextMenu
          onClose={() => setIsShowFilter(false)}
          className="pr-15"
          options={[
            {
              handler: () => {
                setFilterType("student");
                setIsShowFilter(false);
                setIsShowModal(true);
              },
              text: "Students",
              icon: <PiStudentBold className="text-amber-800" />,
            },
            {
              handler: () => {
                setFilterType("teacher");
                setIsShowFilter(false);
                setIsShowModal(true);
              },
              text: "Teacher",
              icon: <LiaChalkboardTeacherSolid className="text-amber-800" />,
            },
            {
              handler: () => {
                setFilterType("date");
                setIsShowFilter(false);
                setIsShowModal(true);
              },
              text: "Date",
              icon: <CiCalendarDate className="text-amber-800" />,
            },
            {
              handler: () => {
                setFilterType("");
                setIsShowFilter(false);
                setIsShowModal(false);
                router.replace(window.location.pathname + '?page=1');
              },
              text: "Reset",
              icon: <GoBlocked className="text-amber-800" />,
            },
          ]}
        />
      )}

      <Suspense>
        {isShowModal && (
          <Modal
            heading={
              (filterType === "student" && "select student") ||
              (filterType === "teacher" && "select teacher") ||
              (filterType === "date" && "select date")
            }
            onClose={() => setIsShowModal(false)}
            className={filterType === "date" && "h-fit w-fit"}
          >
            {filterType === "date" && <CustomDateRangePicker />}

            {filterType !== "date" && (
              <>
                <CustomSelect
                  options={
                    filterType === "student"
                      ? customizedStudents
                      : customizedTeachers
                  }
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
      className="flex border-b border-b-(--border) items-center gap-3 w-full px-5 py-3 text-left text-sm hover:bg-(--card-hover) transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}