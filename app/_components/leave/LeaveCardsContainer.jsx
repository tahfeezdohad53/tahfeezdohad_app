"use client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import LeaveCard from "./LeaveCard";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CiCalendar, CiChat1, CiUser } from "react-icons/ci";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { IoArrowBackOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import toast from "react-hot-toast";
import { useUser } from "../providers/UserProvider";
import { MdOutlineNotes } from "react-icons/md";
import { FaBan, FaCheck, FaClock, FaCross, FaUser } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import Image from "next/image";

function LeaveCardsContainer({ setShow, show }) {
  const { user } = useUser();
  const query = useSearchParams();
  const queryClient = useQueryClient();
  const [showLeaveDetails, setShowLeaveDetails] = useState({
    show: false,
    details: {},
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: leaves } = useQuery({
    queryKey: ["leaves", query.get("status"), query.get("user")],
    queryFn: handleGetLeaves,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if(show) {
      const url = new URLSearchParams(searchParams);
      if(url.has('status')){
        url.delete('status');
        router.replace(`${pathname}?${url}`,{scroll:false});
      }
    }
  },[show])

  async function handleUpdate(status) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/leave/update`,
        { leaveId: showLeaveDetails.details.id, status },
        { withCredentials: true },
      );
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leaveStatistics"] });
      setShowLeaveDetails({ show: false, details: {} });
      toast.success("leave status updated");
    } catch (err) {
      console.log(err);
      toast.error("failed to update leave status");
    }
  }
  async function handleGetLeaves() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/leave/get?status=${query.get("status") || ""}&user=${query.get("user") || ""}`,
        { withCredentials: true },
      );
      return res.data.leaves;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  function handleChangeSearchParams(value) {
    const params = new URLSearchParams(searchParams);
    params.set("status", value);
    router.replace(`${pathname}?${params}`, { scroll: false });
  }
  // if(leaves?.length < 1) return <div className="text-center mt-15 font-bold">Apply For Leave</div>
  return (
    <div className="bg-(--card) border border-gray-200 relative py-5 px-2 rounded-xl h-full">
      {show && !showLeaveDetails.show && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="pl-3 text-amber-800 font-bold text-2xl flex items-center gap-2 border-b border-gray-200 w-full pb-3">
              <span className="p-2 rounded-md bg-gray-100">
                <CiCalendar />
              </span>{" "}
              <span className="">Recent Requests</span>
            </h1>
            {/* <button
                onClick={() => {
                  setShow(false);
                  handleChangeSearchParams("pending");
                }}
                className="hover:bg-blue-100 p-2 rounded-md hover:cursor-pointer duration-300 ease-in-out transition-all text-blue-700 font-bold text-sm"
              >
                View All
              </button> */}
          </div>
          {leaves?.length < 1 && (
            <div className="flex py-10">
              <p className="mt-5 mx-auto font-bold ">No recent requests!</p>
            </div>
          )}
          <div className="lg:pb-15  hidden lg:grid lg:grid-cols-2 lg:gap-5">
            {leaves?.slice(0, 10).map((el) => (
              <PhoneLeaveCard
                role={user?.role}
                setShowLeaveDetails={setShowLeaveDetails}
                key={el._id}
                id={el._id}
                createdAt={el.createdAt}
                status={el.status}
                reason={el.reason}
                name={el.name}
                batch={el.batch}
                type={el.type}
                from={el.from}
                to={el.to}
                days={el.days}
                profileImage={el?.user?.profileImage}
              />
            ))}
            {leaves?.length > 0 && (
              <button
                onClick={() => {
                  setShow(false);
                  handleChangeSearchParams("pending");
                }}
                className="hover:bg-amber-800 w-1/4 lg:absolute lg:left-1/2 lg:bottom-[-2%] lg:-translate-1/2  duration-300 transition-all ease-in-out hover:cursor-pointer py-3 flex items-center bg-amber-700 rounded-md text-white justify-center gap-2"
              >
                View All <HiArrowRight />
              </button>
            )}
          </div>
          <div className="lg:hidden grid lg:grid-cols-2 lg:gap-5">
            {leaves?.slice(0, 3).map((el) => (
              <PhoneLeaveCard
                role={user?.role}
                setShowLeaveDetails={setShowLeaveDetails}
                key={el._id}
                id={el._id}
                createdAt={el.createdAt}
                status={el.status}
                reason={el.reason}
                name={el.name}
                batch={el.batch}
                type={el.type}
                from={el.from}
                to={el.to}
                days={el.days}
                profileImage={el?.user?.profileImage}
              />
            ))}
            {leaves?.length > 0 && (
              <button
                onClick={() => {
                  setShow(false);
                  handleChangeSearchParams("pending");
                }}
                className="hover:bg-amber-800 mt-5 duration-300 transition-all ease-in-out hover:cursor-pointer py-3 flex items-center bg-amber-700 rounded-md text-white justify-center gap-2"
              >
                View All <HiArrowRight />
              </button>
            )}
          </div>
        </>
      )}

      {!show && (
        <div className="min-h-screen absolute p-5 bg-(--card) w-full top-0 left-0">
          <button
            onClick={() => setShow(true)}
            className="flex items-center  gap-5 p-2 rounded-md hover:bg-gray-200 mb-10"
          >
            <IoArrowBackOutline />
            Leave Request
          </button>
          <div className="grid grid-cols-4 text-center text-sm">
            <button
              onClick={() => handleChangeSearchParams("all")}
              className={`pb-3 border-b  ${searchParams.has("status", "all") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => handleChangeSearchParams("pending")}
              className={`pb-3 border-b ${searchParams.has("status", "pending") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              Pending
            </button>
            <button
              onClick={() => handleChangeSearchParams("accepted")}
              className={`pb-3 border-b  ${searchParams.has("status", "accepted") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              Accepted
            </button>
            <button
              onClick={() => handleChangeSearchParams("rejected")}
              className={`pb-3 border-b  ${searchParams.has("status", "rejected") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              Rejected
            </button>
          </div>
          <div className="lg:grid grid-cols-3 flex flex-col gap-3 mt-5">
            {leaves?.map((el) => (
              <PhoneLeaveCard
                key={el._id}
                role={user?.role}
                id={el._id}
                createdAt={el.createdAt}
                status={el.status}
                reason={el.reason}
                name={el.name}
                batch={el.batch}
                type={el.type}
                from={el.from}
                to={el.to}
                days={el.days}
                profileImage={el?.user?.profileImage}
              />
            ))}
          </div>
        </div>
      )}
      {!show && (
        <div className="overflow-hidden flex flex-col h-screen fixed p-5 bg-(--card) w-full top-0 left-0">
          <button
            onClick={() => {
              setShow(true);
              handleChangeSearchParams("");
            }}
            className="flex items-center hover:cursor-pointer duration-300 ease-in-out transition-all w-fit  gap-5 p-2 rounded-md hover:bg-gray-200 mb-10"
          >
            <IoArrowBackOutline />
            Leave Request
          </button>
          <div className="grid grid-cols-4 text-center text-sm">
            <button
              onClick={() => handleChangeSearchParams("all")}
              className={`py-2 hover:cursor-pointer hover:bg-(--card-hover) border-b transition-colors duration-300 ease-in-out  ${searchParams.has("status", "all") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => handleChangeSearchParams("pending")}
              className={`py-2 hover:cursor-pointer hover:bg-(--card-hover) border-b transition-colors duration-300 ease-in-out ${searchParams.has("status", "pending") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              Pending
            </button>
            <button
              onClick={() => handleChangeSearchParams("accepted")}
              className={`py-2 hover:cursor-pointer hover:bg-(--card-hover) border-b transition-colors duration-300 ease-in-out  ${searchParams.has("status", "accepted") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              Accepted
            </button>
            <button
              onClick={() => handleChangeSearchParams("rejected")}
              className={`py-2 hover:cursor-pointer hover:bg-(--card-hover) border-b transition-colors duration-300 ease-in-out  ${searchParams.has("status", "rejected") ? "border-b-2 border-b-blue-500 text-blue-600" : "border-b-gray-200"}`}
            >
              Rejected
            </button>
          </div>
          <div className="pb-20 overflow-auto flex-1 mt-5">
            <div className=" lg:grid grid-cols-2 flex flex-col gap-x-2">
              {leaves?.map((el) => (
                <PhoneLeaveCard
                  key={el._id}
                  role={user?.role}
                  id={el._id}
                  createdAt={el.createdAt}
                  status={el.status}
                  reason={el.reason}
                  name={el.name}
                  batch={el.batch}
                  type={el.type}
                  from={el.from}
                  to={el.to}
                  days={el.days}
                  setShowLeaveDetails={setShowLeaveDetails}
                  profileImage={el?.user?.profileImage}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {showLeaveDetails.show && (
        <div className="overflow-auto pb-20 h-screen fixed p-5 bg-(--bg-main) w-full top-0 left-0">
          <button
            onClick={() => {
              if (!show) setShowLeaveDetails({ show: false, details: {} });
              else {
                setShowLeaveDetails({ show: false, details: {} });
                handleChangeSearchParams("");
              }
            }}
            className="flex items-center hover:cursor-pointer gap-5 p-2 rounded-md hover:bg-gray-200 mb-5"
          >
            <IoArrowBackOutline />
            Leave Request Details
          </button>
          <div className="lg:flex flex-col items-center lg:w-full">
            <div
              className={`border lg:w-1/2 border-(--border) p-4 rounded-md flex items-center gap-5 ${showLeaveDetails.details.status === "rejected" && "bg-red-500/5 border-red-500/20"} ${showLeaveDetails.details.status === "accepted" && "bg-green-500/5 border-green-500/20"} ${showLeaveDetails.details.status === "pending" && "bg-yellow-500/5 border-yellow-500/20"}`}
            >
              <div className="">
                <div
                  className={`p-4  rounded-full borde ${showLeaveDetails.details.status === "rejected" && "bg-red-500/20 text-red-700"} ${showLeaveDetails.details.status === "accepted" && "bg-green-500/20 text-green-700"} ${showLeaveDetails.details.status === "pending" && "bg-yellow-500/20 text-yellow-700"}`}
                >
                  {showLeaveDetails.details.status === "rejected" && (
                    <RxCross2 />
                  )}
                  {showLeaveDetails.details.status === "accepted" && (
                    <FaCheck />
                  )}
                  {showLeaveDetails.details.status === "pending" && <FaClock />}
                </div>
              </div>
              <div>
                <h1
                  className={`${showLeaveDetails.details.status === "rejected" && "text-red-600"} ${showLeaveDetails.details.status === "accepted" && "text-green-600"} ${showLeaveDetails.details.status === "pending" && "text-yellow-600"} font-bold flex items-center gap-5`}
                >
                  {showLeaveDetails.details.status}
                </h1>
                <p className="text-sm text-gray-700">
                  {showLeaveDetails.details.status === "pending" &&
                    "Waiting for approval"}
                </p>
                <p className="text-sm text-gray-700">
                  {showLeaveDetails.details.status === "rejected" &&
                    "your request was rejected"}
                </p>
                <p className="text-sm text-gray-700">
                  {showLeaveDetails.details.status === "accepted" &&
                    "your request was accepted"}
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 mt-5">
              <div className="relative bg-(--card) flex gap-8 items-center border border-gray-300 rounded-md p-3 py-4">
                <div className="min-h-15 min-w-15 overflow-hidden flex justify-center items-center relative rounded-full bg-(--bg-tertiary)/50">
                  {!showLeaveDetails.details?.profileImage && <FaUser className="text-2xl" />}
                  {showLeaveDetails.details?.profileImage && (
                    <Image fill src={showLeaveDetails.details.profileImage} alt="profile photo" />
                  )}
                </div>
                <div className="flex flex-col text-xs w-full gap-1">
                  <h1 className="font-bold text-lg">
                    {showLeaveDetails.details.name
                      .split(" ")
                      .slice(1)
                      .join(" ")}
                  </h1>
                  {/* <p
                    className={`px-2 py-1 rounded-md ${showLeaveDetails.details.status === "rejected" && "bg-red-500"} ${showLeaveDetails.details.status === "accepted" && "bg-green-500"} ${showLeaveDetails.details.status === "pending" && "bg-yellow-500"} text-white absolute right-2 top-2`}
                  >
                    {showLeaveDetails.details.status}
                  </p> */}
                  {showLeaveDetails.details?.batch && (
                    <h1 className="text-gray-600 ml-1 flex items-center gap-1 font-semibold">
                      <FiUsers className="text-sm" />
                      batch - {showLeaveDetails.details.batch}
                    </h1>
                  )}
                  <h1 className="text-amber-800 flex items-center gap-1 font-semibold">
                    <CiCalendar className="text-lg" />
                    Requested on{" "}
                    {format(showLeaveDetails.details.createdAt, "dd MMM, yyy")}
                  </h1>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4 lg:w-1/2">
              {/* Info Cards */}
              <div className="rounded-xl p-2 grid grid-cols-2 bg-(--card)">
                <div className=" border-r border-b border-gray-200 flex items-center gap-3 p-6 px-3">
                  <p className="p-2 bg-orange-500/7 rounded-md h-fit">
                    <MdOutlineNotes className="text-lg text-amber-600" />
                  </p>

                  <div>
                    <p className="text-xs text-gray-500">Leave Type</p>
                    <h3 className="font-semibold text-sm capitalize">
                      {showLeaveDetails.details.type}
                    </h3>
                  </div>
                </div>

                <div className=" border-b border-gray-200 flex items-center gap-3 p-6 px-3">
                  <p className="p-2 bg-green-500/10 rounded-md h-fit">
                    <GoClock className="text-lg text-green-600" />
                  </p>

                  <div>
                    <p className="text-xs text-gray-500">Total Days</p>
                    <h3 className="font-semibold text-sm">
                      {showLeaveDetails.details.days} Day
                    </h3>
                  </div>
                </div>

                <div className=" border-r border-gray-200 flex items-center gap-3 p-6 px-3">
                  <p className="p-2 bg-blue-500/10 rounded-md h-fit">
                    <CiCalendar className="text-lg text-blue-600" />
                  </p>

                  <div>
                    <p className="text-xs text-gray-500">From Date</p>
                    <h3 className="font-semibold text-xs">
                      {format(showLeaveDetails.details.from, "dd MMM, yyyy")}
                    </h3>
                  </div>
                </div>

                <div className="  border-gray-200 flex items-center gap-3 p-6 px-3">
                  <p className="p-2 bg-indigo-500/10 rounded-md h-fit">
                    <CiCalendar className="text-lg text-indigo-600" />
                  </p>

                  <div>
                    <p className="text-xs text-gray-500">To Date</p>
                    <h3 className="font-semibold text-xs">
                      {format(showLeaveDetails.details.to, "dd MMM, yyyy")}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Reason Card */}
              <div className="bg-(--card) border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="p-4 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <CiChat1 className="text-2xl text-blue-600" />
                </div>

                <div className="bg-blue-50 w-full rounded-md p-2 border border-blue-100">
                  <h3 className="font-semibold text-sm mb-1 text-blue-700">
                    Reason
                  </h3>
                  <p className="text-sm text-gray-600">
                    {showLeaveDetails.details.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 mt-5 bg-(--card)  rounded-md p-3 text-xs shadow-(--shadow-sm) border border-gray-200">
              <div className="flex items-center gap-5 border-b pb-3 border-gray-200">
                <p className="p-2 rounded-full bg-purple-100">
                  <GoClock />
                </p>
                <p>Approval history</p>
              </div>

              <div className="mt-5 pl-1 space-y-4">
                <div>
                  <h1
                    className={`${showLeaveDetails.details.status === "rejected" && "text-red-500"} ${showLeaveDetails.details.status === "accepted" && "text-green-500"} ${showLeaveDetails.details.status === "pending" && "text-yellow-500"} font-bold flex items-center gap-5`}
                  >
                    <div
                      className={`relative h-3 w-3 rounded-full ${showLeaveDetails.details.status === "rejected" && "bg-red-500"} ${showLeaveDetails.details.status === "accepted" && "bg-green-500"} ${showLeaveDetails.details.status === "pending" && "bg-yellow-500"}`}
                    >
                      <p
                        className={`absolute left-1/2 top-full -translate-x-1/2  h-9 w-1 rounded-full ${showLeaveDetails.details.status === "rejected" && "bg-red-500"} ${showLeaveDetails.details.status === "accepted" && "bg-green-500"} ${showLeaveDetails.details.status === "pending" && "bg-yellow-500"}`}
                      ></p>
                    </div>
                    {showLeaveDetails.details.status}
                  </h1>
                  <p className="ml-8 text-gray-600">
                    {showLeaveDetails.details.status === "pending" &&
                      "Waiting for approval"}
                  </p>
                  <p className="ml-8 text-gray-600">
                    {showLeaveDetails.details.status === "rejected" &&
                      "your request was rejected"}
                  </p>
                  <p className="ml-8 text-gray-600">
                    {showLeaveDetails.details.status === "accepted" &&
                      "your request was accepted"}
                  </p>
                </div>
                <div>
                  <h1 className=" flex items-center gap-5">
                    <p
                      className={`h-3 w-3 rounded-full ${showLeaveDetails.details.status === "rejected" && "bg-red-500"} ${showLeaveDetails.details.status === "accepted" && "bg-green-500"} ${showLeaveDetails.details.status === "pending" && "bg-yellow-500"}`}
                    ></p>
                    Requested
                  </h1>
                  <p className="ml-8 flex items-center gap-1">
                    <CiCalendar />
                    {format(showLeaveDetails.details.createdAt, "dd MMM, yyy")}
                  </p>
                </div>
              </div>
            </div>

            {user?.role === "admin" &&
              showLeaveDetails.details.status === "pending" && (
                <div className="mt-5 grid grid-cols-2 lg:w-1/2 gap-5 pb-20">
                  <button
                    onClick={() => handleUpdate("rejected")}
                    className="flex items-center justify-center gap-2 shadow-(--shadow-md) hover:bg-red-500 hover:text-white duration-300 transition-all ease-in-out hover:cursor-pointer w-full border-red-500 border text-red-500 py-3 rounded-md"
                  >
                    <FaBan /> Reject
                  </button>
                  <button
                    onClick={() => handleUpdate("accepted")}
                    className="flex justify-center items-center gap-2 shadow-(--shadow-md) hover:bg-green-600 duration-300 transition-all ease-in-out hover:cursor-pointer w-full bg-green-500 text-white rounded-md"
                  >
                    <FaCheck /> Accept
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveCardsContainer;

function PhoneLeaveCard({
  role,
  id,
  type,
  from,
  createdAt,
  to,
  days,
  status,
  name,
  batch,
  title,
  reason,
  setShowLeaveDetails,
  profileImage,
}) {
  const src = role !== 'admin' && profileImage
  return (
    <div
      onClick={() =>
        setShowLeaveDetails({
          show: true,
          details: {
            id,
            type,
            name,
            from,
            to,
            batch,
            reason,
            days,
            createdAt,
            status,
            profileImage
          },
        })
      }
      className="pb-4 lg:border-r lg:border-r-gray-300 bg-(--card) hover:bg-(--card-hover) duration-300 transition-all ease-in-out hover:cursor-pointer relative p-3 flex items-center gap-5 border-b  border-gray-200 "
    >
      <div className="h-15 w-15 overflow-hidden flex justify-center items-center relative rounded-full bg-(--bg-tertiary)/50">
        {!profileImage && <FaUser className="text-2xl" />}
        {profileImage && <Image fill src={profileImage} alt="profile photo" />}
      </div>
      <div className="text-sm space-y-1">
        <p className="text-sm font-bold">{role !== "admin" ? `${type} leave` : name}</p>
        <p className="text-amber-700 flex items-center gap-1 font-semibold">
          {" "}
          <span className="p-1 rounded-md bg-(--bg-tertiary)/50">
            <CiCalendar className="text-amber-500" />
          </span>{" "}
          {format(from, "dd MMM")} - {format(to, "dd MMM yyy")}
        </p>
        <p className="text-gray-600 flex items-center gap-1 font-semibold pr-4 text-xs">
          <span className="p-1 rounded-md bg-blue-500/10">
            <GoClock className="text-blue-500" />
          </span>
          <span className="lg:hidden">
            {days} days - {reason.slice(0, 15)}
          </span>
          <span className="hidden lg:block ">
            {days} days - {reason.slice(0, 60)}
          </span>
          <span className="lg:hidden">{reason.length > 15 && "..."}</span>
          <span className="hidden lg:block">{reason.length > 60 && "..."}</span>
        </p>
      </div>
      {/* <p className="absolute right-5 top-2 text-[0.60rem] p-1 px-2 text-white bg-green-500/70 rounded-md">Accepted</p> */}
      <p className="absolute right-3 top-[55%] text-sm -translate-y-1/2 p-2 bg-(--bg-tertiary)/30 rounded-full">
        <IoIosArrowForward />
      </p>
    </div>
  );
}
