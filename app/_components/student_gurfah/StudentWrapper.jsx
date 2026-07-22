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
import { useParams, usePathname, useRouter } from "next/navigation";
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
import { useSession } from "next-auth/react";
import { MdMessage } from "react-icons/md";
import toast from "react-hot-toast";

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
function StudentWrapper() {
  const { user,isFetching } = useUser();
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

  const { data, isFetching:isGurfahDataFetching } = useQuery({
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
      // console.log(res.data)
      return res.data;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  const { data: messages,isFetching:isMessageFetching } = useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
    // initialData: [],
    placeholderData: keepPreviousData,
  });
  const inputRef = useRef(null);
  const toastInputRef = useRef(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    // console.log(containerRef.current)
    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [containerRef.current,messages]);

  // useEffect(() => {
  //   // console.log(containerRef.current)
  //   if (containerRef.current)
  //       setTimeout(() => {
  //         containerRef.current.scrollTop = containerRef.current.scrollHeight;
  //       }, 1000);
  // }, [containerRef.current]);

      const router = useRouter();
          const session = useSession();
          useEffect(() => {
              if(session.status === "loading") return;
              if(isFetching) return;
              if(!user?._id) {
                router.replace("/auth");
              }
              
            },[user?.role,session?.status,isFetching])

  //           async function sendMessageFromToast(e,toastId) {
  //             e.preventDefault();
  //             if(toastInputRef.current.value.length < 1) return;
  //             queryClient.setQueriesData({ queryKey: ["messages"] }, (old) => {
  //               return [
  //                 ...old,
  //                 {
  //                   sender: user?._id,
  //                   receiver: id,
  //                   message: toastInputRef.current.value,
  //                   createdAt: new Date(),
  //                   _id: Date.now(),
  //                 },
  //               ];
  //             });

  //             try {
  //               socket.emit("message", {
  //                 senderName: user?.name,
  //                 message: toastInputRef.current.value,
  //                 to: id,
  //                 from: user?._id,
  //                 createdAt: new Date(),
  //               });
  //               const { data } = await axios.post(
  //                 `${process.env.NEXT_PUBLIC_URL}/message/send`,
  //                 { message: toastInputRef.current.value, to: id },
  //                 { withCredentials: true },
  //               );
  //               toast.dismiss(toastId)
  //             } catch (err) {
  //               console.log(err);
  //             }
  //           }

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("message", ({ message, from, to, createdAt, senderName }) => {
  //      if(from === id)toast(
  //        (t) => (
  //          <div className="relative w-90 rounded-2xl bg-white p-4 shadow-xl border border-gray-200">
  //            {/* Dismiss */}
  //            <button
  //              onClick={() => toast.dismiss(t.id)}
  //              className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
  //            >
  //              ✕
  //            </button>

  //            {/* Header */}
  //            <div className="flex items-start gap-3">
  //              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
  //                <MdMessage size={22} />
  //              </div>

  //              <div className="min-w-0 flex-1 pr-6">
  //                <p className="text-sm font-semibold text-gray-900">
  //                  {senderName.split(' ').slice(1).join(' ')}
  //                </p>

  //                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
  //                  {message}
  //                </p>
  //              </div>
  //            </div>

  //            {/* Reply */}
  //            <form onSubmit={(e) => sendMessageFromToast(e,t.id)} className="mt-4 flex gap-2">
  //              <input
  //              ref={toastInputRef}
  //                type="text"
  //                placeholder="Reply..."
  //                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  //              />

  //              <button className="rounded-lg bg-(image:--gradient-primary) px-4 py-2 text-sm font-medium text-white transition hover:scale-105 active:scale-95">
  //                Send
  //              </button>
  //            </form>
  //          </div>
  //        ),
  //        {
  //          duration: Infinity,
  //          position: "top-center",
  //          style: {
  //            padding: 0,
  //            background: "transparent",
  //            boxShadow: "none",
  //            maxWidth: "none",
  //          },
  //        },
  //      );
  //     if (from === id) {
  //       queryClient.setQueriesData({ queryKey: ["messages"] }, (old) => {
  //         return [
  //           ...old,
  //           {
  //             sender: from,
  //             receiver: to,
  //             message,
  //             createdAt,
  //             _id: Date.now(),
  //           },
  //         ];
  //       });
  //     }
  //   });

  //   return () => socket.off("message");
  // }, [socket]);

  // useEffect(() => {
  //   if(!containerRef.current) return;
  //   containerRef.current.scrollTop = containerRef.current.scrollHeight;
  // },[messages.length,containerRef.current])

  // useEffect(() => {
  //   if(!containerRef.current) return;
  //   containerRef.current.scrollTop = containerRef.current.scrollHeight;
  // },[containerRef])
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
          profileImage:user.profileImage,
          createdAt: new Date(),
          _id: Date.now(),
        },
      ];
    });
    setMessage("");
    inputRef.current.focus();
    try {
      socket.emit("message", {
        senderName:user?.name,
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
  if (isGurfahDataFetching)
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
            {data?.user?.profileImage && (
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image src={data?.user?.profileImage} alt="user photo" fill />
              </div>
            )}
            {!data?.user?.profileImage && (
              <FaUserCircle className="text-4xl text-amber-950" />
            )}
          </div>

          <div className="ml-3 font-semibold mr-2">
            <h1 className="text-xs">
              {data?.user?.name.split(" ").slice(1, data?.user?.name.split(" ").length).join(" ")}
            </h1>
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
            // if (i === 0)
            // console.log(differenceInDays(new Date(), date));
            let prevDate;
            if (i !== 0) {
              prevDate = new Date(arr[i - 1].createdAt);
              // console.log(prevDate.getMonth())
            }

            return (
              <div key={el._id} className="flex flex-col gap-3">
                {i === 0 && differenceInDays(new Date(), date) < 7 && (
                  <p
                    // key={el._id}
                    className="bg-(image:--gradient-primary) text-white/90 text-sm w-fit px-4 py-1 rounded-md mx-auto"
                  >
                    {differenceInDays(new Date(), date) > 1 &&
                    differenceInDays(new Date(), date) <= 7
                      ? [
                          "sunday",
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                        ][date.getDay()]
                      : date.getDate() === new Date().getDate()
                        ? "Today"
                        : date.getDate() === new Date().getDate() - 1 &&
                          "Yesterday"}
                  </p>
                )}
                {i === 0 && differenceInDays(new Date(), date) >= 7 && (
                  <p
                    // key={el._id}
                    className="bg-(image:--gradient-primary) text-white/90 text-sm w-fit px-4 py-1 rounded-md mx-auto"
                  >
                    {format(date, "do MMMM yyyy")}
                  </p>
                )}
                {i > 0 &&
                  differenceInDays(new Date(), date) < 7 &&
                  (date.getDate() !== prevDate.getDate() ||
                    date.getMonth() !== prevDate.getMonth() ||
                    date.getFullYear() !== prevDate.getFullYear()) && (
                    <p
                      // key={el._id}
                      className="bg-(image:--gradient-primary) text-white/90 text-sm w-fit px-4 py-1 rounded-md mx-auto"
                    >
                      {differenceInDays(new Date(), date) > 1 &&
                      differenceInDays(new Date(), date) <= 7
                        ? [
                            "sunday",
                            "monday",
                            "tuesday",
                            "wednesday",
                            "thursday",
                            "friday",
                            "saturday",
                          ][date.getDay()]
                        : date.getDate() === new Date().getDate()
                          ? "Today"
                          : date.getDate() === new Date().getDate() - 1 &&
                            "Yesterday"}
                    </p>
                  )}
                {i > 0 &&
                  differenceInDays(new Date(), date) >= 7 &&
                  (date.getDate() !== prevDate.getDate() ||
                    date.getMonth() !== prevDate.getMonth() ||
                    date.getFullYear() !== prevDate.getFullYear()) && (
                    <p
                      // key={el._id}
                      className="bg-(image:--gradient-primary) text-white/90 text-sm w-fit px-4 py-1 rounded-md mx-auto"
                    >
                      {format(date, "do MMMM yyyy")}
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
                className="pl-[15%] duration-300 w-full ease-in-out rounded-full bg-(--background-main) px-5 py-3 text-sm text-black placeholder:text-gray-400 outline-none border border-gray-300 ring-1 ring-transparent transition-all focus:ring-gray-400"
              />
              <div className="text-lg absolute top-1/2 -translate-y-1/2 bg-gray-200 w-[13%] lg:w-[10%] justify-center flex items-center h-full">
                <BiSolidMessageSquareDetail className="text-(--primary-light) text-sm" />
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
