"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaBookOpen, FaUserFriends } from "react-icons/fa";
import { GiOpenBook } from "react-icons/gi";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { useUser } from "../providers/UserProvider";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { HiOutlinePlus } from "react-icons/hi";
import MaqaratFilter from "./MaqaratFilter";
import { CiViewList } from "react-icons/ci";
const inter = Inter({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
});

function MaqaratContainer({}) {
  const { user, isFetching } = useUser();
  const router = useRouter();

  const session = useSession();
  useEffect(() => {
    if (session.status === "loading") return;
    if (isFetching) return;
    if (!user?._id) {
      router.replace("/auth");
    }
  }, [user?.role, session?.status, isFetching]);
  const query = useSearchParams();
  const { data: maqarat, isLoading } = useQuery({
    queryKey: ["maqarat", query.get("batch"), query.get("status")],
    queryFn: handleGetMaqarat,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
  async function handleGetMaqarat() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/maqarat/get?batch=${query.get("batch") || ""}&status=${query.get("status") || ""}`,
        { withCredentials: true },
      );
      // console.log("sucess");
      // console.log(res.data.maqarat.length);
      return res.data.maqarat;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  if (!user) return null;
  if (isLoading) return null;
  // if (!isLoading && maqarat?.length === 0)
  //   return (
  //     <div className="w-full min-h-full border flex items-center justify-center">
  //       {user?.role === "admin" && <h1>Start Creating Maqarat Session</h1>}
  //       {(user?.role === "student" || user?.role === "teacher") && (
  //         <NoSessionsFound />
  //       )}
  //     </div>
  //   );
  return (
    // <h1>hello</h1>
    <div className="  ">
      {(maqarat?.length > 0 || query.get('batch') || query.get('status')) && (
        <div className="w-full flex justify-between mt-5 items-center">
          <div className="flex justify-between w-full pb-3">
            <h1 className="font-bold flex items-center gap-2 text-lg">
              <p className="p-2 rounded-md bg-(--bg-tertiary)/50 text-amber-900 border border-(--border) shadow-(--shadow-sm)">
                <CiViewList className="text-xl " />
              </p>{" "}
              Previous Maqarat Sessions
            </h1>
            <MaqaratFilter />
          </div>
        </div>
      )}
      {(maqarat?.length < 1 && !query.get('batch') && !query.get('status')) && <div className="w-[90%] lg:w-fit absolute top-1/2 left-5 lg:top-[55%] lg:left-[40%] -translate-y-1/2">
        <NoSessionsFound role={user?.role} />
      </div>}

      <div className="lg:grid lg:grid-cols-3 flex flex-col gap-3 mt-3">
        {maqarat.map((el) => (
          <MaqaratSessionCard
            key={el._id}
            juz={el.juz}
            batch={el.batch}
            teacher={el.teacher.name}
            date={el.date}
            students={el.students}
          />
        ))}
      </div>
    </div>
  );
}

export default MaqaratContainer;

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function MaqaratSessionCard({ juz, batch, teacher, date, students }) {
  const today = new Date();
  const sessionDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);

  const isUpcoming = sessionDate > today;
  const isToday = sessionDate.getTime() === today.getTime();

  const statusColor = isToday
    ? "bg-blue-500"
    : isUpcoming
      ? "bg-green-500"
      : "bg-red-500";
  const highlightColor = isToday
    ? "bg-blue-500/25"
    : isUpcoming
      ? "bg-green-500/25"
      : "bg-red-500/25";
  const textColor = isToday
    ? "text-blue-500"
    : isUpcoming
      ? "text-green-500"
      : "text-red-500";
  const border = isToday
    ? "border-l-blue-500"
    : isUpcoming
      ? "border-l-green-500"
      : "border-l-red-500";

  const statusText = isToday ? "Today" : isUpcoming ? "Upcoming" : "Ended";

  return (
    <div
      className={`border-l-3 ${border} bg-white p-4 flex flex-col gap-2 relative rounded-sm border border-(--border) shadow-(--shadow-sm) overflow-hidden`}
    >
      {/* Header */}

      <div className="flex gap-5 items-center">
        <div className="flex  items-start justify-between">
          <div className="flex flex-col gap-3">
            <div
              className={`h-12 w-12 rounded-2xl bg-(--bg-tertiary)/50 flex items-center justify-center ${highlightColor}`}
            >
              <IoCalendarOutline size={24} />
            </div>

            <div className="flex flex-col items-center">
              {/* <h2 className="font-bold text-lg">{juz}</h2> */}
              <p className={` font-semibold text-lg`}>
                {/* {format(date, "dd MMM yyyy")} */}
                {month.at(new Date(date).getMonth())}
              </p>
              <p className={`text-4xl font-bold`}>{new Date(date).getDate()}</p>
              <p className="text-md text-gray-700">
                {new Date(date).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-4 w-full pb-4 flex flex-col gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <LuUsers className={`${textColor}`} />
            <p>Batch: {batch}</p>
          </div>

          <div className="flex items-center gap-2">
            <span>
              <LuUsers className={`${textColor}`} />
            </span>
            <p>
              Teacher:{" "}
              <span className={`${inter.className} font-extrabold`}>
                {teacher.split(" ").slice(1).join(" ")}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FaBookOpen className={`${textColor}`} />
            <p className="text-xs">{juz}</p>
          </div>

          <div className="flex items-center gap-2">
            <IoCalendarOutline className={`${textColor}`} />
            <span
              className={`${statusColor} text-white text-xs px-3 py-1 rounded-full`}
            >
              {/* {statusText} */}
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-(--border) pt-3">
        <h3 className="font-semibold text-amber-700 mb-3">
          Students ({students?.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {students?.map((student) => (
            <div
              key={student?.name}
              className="px-3 py-1 rounded-full bg-gray-100 text-xs"
            >
              {student?.name.split(" ").slice(1).join(" ").split(' ').filter((el,i) => i !== 1 && i !== 3 && i !== 2).join(' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Students */}
    </div>
  );
}

function NoSessionsFound({role}) {
  return (
    <div className="space-y-6">
      {/* Filter */}
      {/* <div className="flex justify-end">
        <button className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-white px-5 py-3 shadow-sm transition hover:shadow-md">
          <FaCalendarAlt className="text-amber-700 text-lg" />
          <span className="font-semibold text-gray-800">All Time</span>
          <IoChevronDown className="text-gray-500 text-lg" />
        </button>
      </div> */}

      {/* Empty State */}
      <div className=" py-20 rounded-3xl bg-(--card)/80 p-8 shadow-sm border border-amber-100">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-amber-50">
            <FaUsers className="text-6xl text-amber-700" />
          </div>

          <h2 className="lg:text-3xl text-2xl font-bold text-gray-900">
            No sessions found!
          </h2>

          {role === 'admin' && <p className="mt-4 max-w-sm text-gray-500">
            You haven't created any Maqarat Sessions yet.
            <br />
            {/* Start your journey and your sessions will appear here. */}
          </p>}
          {role !== 'admin' &&<p className="mt-4 max-w-sm text-gray-500">
            You haven't participated in any Maqarat sessions yet.
            <br />
            {/* Start your journey and your sessions will appear here. */}
          </p>}

          {role === 'admin' && <button className="mt-8 flex items-center gap-3 rounded-2xl bg-amber-700 px-6 py-4 font-semibold text-white transition hover:bg-amber-800">
            <HiOutlinePlus className="text-2xl" />
            Start a Maqarat Session
          </button>}
        </div>
      </div>
    </div>
  );
}