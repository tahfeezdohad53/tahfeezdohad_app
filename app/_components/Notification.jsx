'use client';
import { useEffect, useState } from "react";
import { FaBell, FaCloudUploadAlt } from "react-icons/fa";
import { useUser } from "./providers/UserProvider";
import { useSocketContext } from "./providers/SocketProvider";
import { formatName } from "@/helpers";

function Notification() {
    const [isNotified,setIsNotified] = useState(null);
    const {user} = useUser();
    const {socket} = useSocketContext();
    useEffect(() => {
        const notifiedStatus = localStorage.getItem('notification');
        setIsNotified(notifiedStatus === 'true' ? true : false);
    },[])

    function handleClose(){
        setIsNotified(true);
        localStorage.setItem('notification','true');
    }
    function handleAnswer(ans){
      socket.emit('to-dev',{isFailed:ans});
      handleClose();
    }
    if (!isNotified && user?._id === "6a57a6bf4a5745965fcc1a85")
      return (
        <div className="z-999 fixed top-0 left-0 flex h-full w-full items-center justify-center backdrop-brightness-50">
          <div className="flex w-[90%] max-w-md flex-col rounded-2xl bg-(--card) p-5 shadow-md">
            {/* Heading */}
            <div className="mb-5 flex items-center justify-center gap-2 border-b border-(--border) pb-3">
              <FaBell className="text-yellow-500" size={20} />
              <h2 className="text-xl font-bold text-(--foreground)">
                Quick Question
              </h2>
            </div>

            {/* Question Card */}
            <div className="rounded-xl border border-amber-500/20 bg-(--card-hover) p-4">
              <p className="text-xs mb-5">{formatName(user?.name)},</p>
              <h3 className=" font-semibold text-(--foreground)">
                Did any of your recordings fail to upload so far?
              </h3>

              <p className="mt-2 text-xs leading-6 text-(--muted-foreground)">
                Please let us know so we can better understand how the recording
                system is performing.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Yes
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 rounded-md bg-(image:--gradient-primary) px-4 py-2 text-sm font-medium text-white"
              >
                No
              </button>
            </div>
          </div>
        </div>
      );
}

export default Notification
