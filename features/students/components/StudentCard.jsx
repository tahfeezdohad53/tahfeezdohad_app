"use client";
import { formatName } from "@/helpers";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { BiDotsVertical } from "react-icons/bi";
import { CiTimer, CiUser } from "react-icons/ci";
import { FaMicrophone, FaRegUser, FaUser, FaUserCircle } from "react-icons/fa";
import { FaCheckToSlot, FaUserXmark } from "react-icons/fa6";
import { IoTimerOutline } from "react-icons/io5";
import { LiaGraduationCapSolid } from "react-icons/lia";
import { LuGraduationCap } from "react-icons/lu";
import { SiGoogleclassroom } from "react-icons/si";
import { TbNotes } from "react-icons/tb";

function StudentCard({
  image,
  name,
  studentId,
  proxyTeacherId,
  teacherId,
  teacherName,
  proxyTeacherName,
  isSelecting,
  setSelectedStudents,
  selectedStudents,
  classStatus,
  classDuration,
  role,
  slots = [],
  batch,
}) {
  const isProxy = proxyTeacherId === teacherId;
  const queryClient = useQueryClient();
  function handleSelectedStudent(e) {
    if (!e.target.checked) {
      setSelectedStudents((arr) => arr.filter((el) => el !== studentId));
    } else {
      setSelectedStudents((arr) => [...arr, studentId]);
    }
  }

  async function handleMarkAbsent() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/student/absent`,
        { studentId },
        { withCredentials: true },
      );
      toast.success("Student marked as absent");
      queryClient.invalidateQueries(["myStudents"]);
    } catch (err) {
      console.log(err);
      toast.error("failed to mark student as absent");
    }
  }

  const formattedName = formatName(name);

  return (
    <div
      className="
    relative
    w-full
    lg:w-[18%]
    rounded-2xl
    border
    border-(--border)
    bg-(--card)
    shadow-(--shadow-xl)
    overflow-hidden
    pb-10
  "
    >
      {/* Selection Checkbox */}
      {isSelecting && (
        <input
          onChange={handleSelectedStudent}
          checked={selectedStudents.includes(studentId)}
          type="checkbox"
          className="
        absolute
        top-3
        left-3
        z-10
        h-4
        w-4
        accent-(--primary)
      "
        />
      )}

      {/* Proxy Badge */}
      {isProxy && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="rounded-full bg-(--background) px-4 py-1 text-[10px] font-medium text-(--text-secondary) shadow-sm">
            Proxy
          </span>
        </div>
      )}

      {/* Menu */}
      <button
        data-studentid={studentId}
        data-studentname={name}
        data-teachername={teacherName}
        data-proxyteachername={proxyTeacherName}
        className="
      menu-btn
      absolute
      right-2
      top-2
      z-10
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-lg
      text-(--text-secondary)
      transition
      duration-200
      hover:bg-(--bg-tertiary)
      hover:text-(--text)
    "
      >
        <BiDotsVertical className="text-lg" />
      </button>

      {/* Student Content */}
      <div
        className={`
      flex
      w-full
      flex-col
      items-center
      px-4
      py-5
      ${!isProxy ? "h-full" : ""}
    `}
      >
        {/* Profile */}
        <div className="flex flex-col items-center gap-2">
          {image ? (
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border- border-(--primary-soft)">
              <Image
                src={image}
                alt="user photo"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <FaUserCircle className="text-5xl text-amber-900" />
          )}

          <div className="max-w-full text-center">
            <p className="text-xs font-bold tracking-wide text-(--text)">
              ITS - {name.split(" ")[0]}
            </p>

            <p className="mt-1 wrap-break-word text-[10px] leading-4 text-(--text-secondary)">
              {formattedName}
            </p>
          </div>
        </div>

        {/* Student Information */}
        <div className="mt-4 w-full border-t border-(--border)">
          {/* Teacher */}
          {role === "admin" && (
            <div className="flex items-center gap-3 border-b border-(--border) py-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--primary-soft)/15">
                <LuGraduationCap className=" text-(--primary)" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-(--text-muted)">Teacher</p>

                <p className="truncate text-[0.55rem] font-medium text-(--text)">
                  {teacherName?.split(" ").slice(1).join(" ") ||
                    "No teacher assigned"}
                </p>
              </div>
            </div>
          )}

          {/* Slots */}
          <div className="flex items-start gap-3 border-b border-(--border) py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--primary-soft)/15">
              <TbNotes className=" text-(--primary)" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] text-(--text-muted)">Slots</p>

              <div className="flex flex-wrap gap-x-1 text-[10px] font-medium">
                {["jd", "mr", "jz", "tm"].map((el, i, arr) => {
                    return (
                      <span
                        key={el}
                        className={
                          slots.includes(el) ? "text-green-500" : "text-red-500"
                        }
                      >
                        {el.slice(0,1).toUpperCase().concat(el.slice(1))},
                      </span>
                    );
                })}

                {["t1", "t2", "t3", "t4", "t5"].map((el, i, arr) => {
                  if (i < 2 || batch.includes("yaqoot"))
                    return (
                      <span
                        key={el}
                        className={
                          slots.includes(el) ? "text-green-500" : "text-red-500"
                        }
                      >
                        {el.toUpperCase()}
                        {arr.length === i + 1 ? "" : ","}
                      </span>
                    );
                })}
              </div>
            </div>
          </div>

          {/* Recording Duration */}
          <div className="flex items-center gap-3 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--primary-soft)/15">
              <IoTimerOutline className=" text-(--primary)" />
            </div>

            <div className="min-w-0 flex-1 truncate">
              <p className="text-[10px] text-(--text-muted)">
                {classStatus === "absent"
                  ? "Class status"
                  : "Recording duration"}
              </p>

              {classStatus !== "absent" && (
                <p className="truncate text-xs font-medium text-(--text)">
                  {classDuration} min
                </p>
              )}
              {classStatus == "absent" && (
                <p className="truncate text-xs font-medium text-(--text) text-red-500">
                  Absent
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute w-[90%] bottom-4  flex w-fu items-center gap-2 ">
          {/* Record */}
          <Link
            href={`/entry/${studentId}?studentName=${name}`}
            title="Record"
            className="
          flex
          h-10
          flex-1
          items-center
          justify-center
          rounded-xl
          border
          border-(--border)
          bg-(--primary-soft)/10
          text-(--primary)
          transition
          duration-200
          hover:bg-(--primary-soft)/20
          hover:shadow-sm
        "
          >
            <FaMicrophone className="text-base" />
          </Link>

          {/* Mark Absent */}
          <button
            type="button"
            title="Mark Absent"
            onClick={handleMarkAbsent}
            className="
          flex
          h-10
          flex-1
          items-center
          justify-center
          rounded-xl
          border
          border-red-200
          bg-red-500/10
          text-red-500
          transition
          duration-200
          hover:bg-red-500/15
          hover:shadow-sm
        "
          >
            <FaUserXmark className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
