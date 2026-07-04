"use client";
import { Playfair_Display } from "next/font/google";
import {
  FaRegClock,
  FaSpinner,
  FaUser,
  FaUserCircle,
  FaVideo,
} from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useCallingFn } from "../socket-listeners/Socket";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import SubmitRecording from "../entry/SubmitRecording";
import useAudioRecorder from "@/app/_hooks/useAudioRecorder";
import { useUser } from "../providers/UserProvider";
import { useParams, usePathname } from "next/navigation";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import SubmitVideoCallRecording from "../video_call/SubmitVideoCallRecording";
import Link from "next/link";
import { IoIosText, IoMdArrowRoundBack } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { useAppProvider } from "../providers/AppProvider";
import { LuMessageCircle } from "react-icons/lu";
import { BiSolidMessageSquareDetail } from "react-icons/bi";

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
function StudentWrapper() {
  const { user } = useUser();
  const { socket } = useSocketContext();
  const { containerRef } = useAppProvider();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params?.id;
  const { startCall } = useCallingFn();
  const {
    onlineClassBlob,
    videoCallSeconds,
    onlineClassBlobUrl,
    onlineClassBlobUrlSize,
    setOnlineClassBlob,
    setOnlineClassBlobUrl,
    setVideoCallSeconds,
  } = useVideoCallContext();
  const {
    actions: { submitRecording },
    states: { isSubmitting },
  } = useAudioRecorder();

  const { data, isFetching } = useQuery({
    queryKey: ["gurfahData"],
    queryFn: handleGetQuery,
    refetchOnWindowFocus: false,
  });

  async function handleGetQuery() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/gurfah/get/${id}`,
        { withCredentials: true },
      );
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
    initialData: [],
    placeholderData: keepPreviousData,
  });
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    // console.log(containerRef.current)
    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current?.scrollHeight;
  }, [containerRef.current]);

  useEffect(() => {
    if (!socket) return;
    console.log("socket attached");
    socket.on("message", ({ message, from, to, createdAt }) => {
      console.log("message recived");
      if (from === id) {
        queryClient.setQueriesData({ queryKey: ["messages"] }, (old) => {
          return [
            ...old,
            {
              sender: from,
              receiver: to,
              message,
              createdAt,
              _id: Date.now(),
            },
          ];
        });
      }
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    });

    return () => socket.off("message");
  }, [socket]);

  async function sendMessage(e) {
    e.preventDefault();
    if (message.length < 1) return;
    queryClient.setQueriesData({ queryKey: ["messages"] }, (old) => {
      return [
        ...old,
        {
          sender: user?._id,
          receiver: id,
          message,
          createdAt: new Date(),
          _id: Date.now(),
        },
      ];
    });
    setMessage("");
    inputRef.current.focus();
    try {
      socket.emit("message", {
        message,
        to: id,
        from: user?._id,
        createdAt: new Date(),
      });
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/message/send`,
        { message, to: id },
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
    }
  }
  async function getMessages(e) {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/message/get?userId=${id}`,
        { withCredentials: true },
      );
      return data.messages;
    } catch (err) {
      console.log("error");
      console.log(err);
      return [];
    }
  }
  if (isFetching)
    return (
      <div>
        <ImSpinner2 className="animate-spin absolute top-1/2 left-1/2 -translate-1/2" />
      </div>
    );
  if (!onlineClassBlob)
    return (
      <div className=" w-full lg:w-[90%] flex flex-col gap-5 items-center  fixed top-0 left-0 lg:left-[10.5%] h-[82.5%]">
        <div className="min-h-17 w-full bg-(--card) flex items-center">
          <div className="flex items-center gap-1 text-sm text-(--text)">
            <button className="duration-300 ease-in-out hover:cursor-pointer transition-all bg-(--card) rounded-lg p-2">
              <Link href={"/gurfah"} className="">
                <IoMdArrowRoundBack className="text-lg" />
              </Link>
            </button>
          </div>

          <div>
            {data?.profileImage && (
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image src={data?.profileImage} alt="user photo" fill />
              </div>
            )}
            {!data?.profileImage && (
              <FaUserCircle className="text-4xl text-amber-950" />
            )}
          </div>

          <div className="ml-3 font-bold">
            <h1 className="text-sm">{data?.user?.name}</h1>
            <p
              className={`text-xs font-thin ${data?.user?.status === "offline" ? "text-red-600" : "text-green-600"}`}
            >
              {data?.user?.status}
            </p>
          </div>

          <div className="ml-auto mr-7 text-lg">
            <button
              onClick={() => startCall(id, user?._id)}
              className="text-(--primary) shadow-(--shadow-md) border border-gray-200 rounded-md duration-300 ease-in-out hover:cursor-pointer transition-all p-3 hover:bg-(--bg-main)"
            >
              <FaVideo />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-auto w-full flex flex-col gap-2 min-h-full px-5 pb-10"
        >
          {messages?.map((el, i, arr) => {
            const date = new Date(el.createdAt);
            if (i === 0)
              console.log(differenceInDays(new Date(), date));
            let prevDate;
            if (i !== 0) {
              prevDate = new Date(arr[i - 1].createdAt);
              // console.log(prevDate.getMonth())
            }
            return (
              <div key={el._id} className="flex flex-col gap-3">
                {i === 0 && (
                  <p
                    // key={el._id}
                    className="bg-(image:--gradient-primary) text-white/90 text-sm w-fit px-4 py-1 rounded-md mx-auto"
                  >
                    {differenceInDays(date, new Date()) > 1 &&
                    differenceInDays(date, new Date()) <= 7
                      ? [
                          "sunday",
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                        ][date.getDay()]
                      : date.getDate() ===
                          new Date().getDate()
                        ? "Today"
                        : date.getDate() ===
                            new Date().getDate() - 1 && "Yesterday"}
                  </p>
                )}
                {i > 0 &&
                  (date.getDate() !== prevDate.getDate() ||
                    date.getMonth() !== prevDate.getMonth() ||
                    date.getFullYear() !== prevDate.getFullYear()) && (
                    <p
                      // key={el._id}
                      className="bg-(image:--gradient-primary) text-white/90 text-sm w-fit px-4 py-1 rounded-md mx-auto"
                    >
                      {differenceInDays(date, new Date()) >
                        1 &&
                      differenceInDays(date, new Date()) <= 7
                        ? [
                            "sunday",
                            "monday",
                            "tuesday",
                            "wednesday",
                            "thursday",
                            "friday",
                            "saturday",
                          ][date.getDay()]
                        : date.getDate() ===
                            new Date().getDate()
                          ? "Today"
                          : date.getDate() ===
                              new Date().getDate() - 1 && "Yesterday"}
                    </p>
                  )}

                <div
                  key={el._id}
                  className={`${el.sender === user?._id ? "ml-auto" : ""} relative max-w-3/4`}
                >
                  <p className="relative bg-(--card) w-fit shadow-(--shadow-md)  px-3 pr-10 rounded-md pt-1 pb-7">
                    {el.message}
                    <span className="absolute right-1 bottom-1 text-xs text-gray-500">
                      {format(el.createdAt, "hh:mm a")}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={sendMessage}
          className="rounded-tl-3xl shadow border border-gray-200 rounded-tr-3xl fixed bottom-0 left-0 lg:left-[10.5%] w-full  bg-(--card) px-4 py-3 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <div className="flex-1 relative rounded-full overflow-hidden">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Type a message..."
                className="pl-13 duration-300 w-full ease-in-out rounded-full bg-(--background-main) px-5 py-3 text-sm text-black placeholder:text-gray-400 outline-none border border-gray-300 ring-1 ring-transparent transition-all focus:ring-gray-400"
              />
              <div className="text-lg absolute top-1/2 -translate-y-1/2 bg-gray-200 w-[10%] justify-center flex items-center h-full">
                <BiSolidMessageSquareDetail className="text-(--primary-light) " />
              </div>
            </div>

            <button className="flex duration-300 ease-in-out hover:cursor-pointer hover:bg-(--primary-dark) h-12 w-12 items-center justify-center rounded-full bg-(--primary) text-white transition-all active:scale-95">
              <IoSend size={20} />
            </button>
          </div>
        </form>
      </div>
    );
  if (onlineClassBlob && user?.role !== "student")
    return (
      <SubmitVideoCallRecording
        videoCallSeconds={videoCallSeconds}
        onlineClassBlobUrl={onlineClassBlobUrl}
        setvideoCallSeconds={setVideoCallSeconds}
        onlineClassBlob={onlineClassBlob}
        onlineClassBlobUrlSize={onlineClassBlobUrlSize}
        studentId={id}
        setOnlineClassBlob={setOnlineClassBlob}
        setOnlineClassBlobUrl={setOnlineClassBlobUrl}
        setVideoCallSeconds={setVideoCallSeconds}
      />
      // <SubmitRecording
      // setVideoCallSeconds={setVideoCallSeconds}
      //   setOnlineClassBlob={setOnlineClassBlob}
      //   setOnlineClassBlobUrl={setOnlineClassBlobUrl}
      //   audioSize={onlineClassBlobUrlSize}
      //   clientAudioUrl={onlineClassBlobUrl}
      //   studentId={id}
      //   submitRecording={submitRecording}
      //   isSubmitting={isSubmitting}
      // />
    );
}

export default StudentWrapper;
