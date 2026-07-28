'use client';
import { useEffect, useState } from "react";
import { FaBell, FaCloudUploadAlt } from "react-icons/fa";
import { useUser } from "./providers/UserProvider";

function Notification() {
    const [isNotified,setIsNotified] = useState(null);
    const {user} = useUser();
    useEffect(() => {
        const notifiedStatus = localStorage.getItem('notification');
        setIsNotified(notifiedStatus === 'true' ? true : false);
    },[])

    function handleClose(){
        setIsNotified(true);
        localStorage.setItem('notification','true');
    }
    if(!isNotified && user?._id)return (
      <div className="z-999 flex items-center justify-center fixed top-0 left-0 h-full w-full backdrop-brightness-50">
        <div className="w-[90%] rounded-2xl bg-(--card) p-5 shadow-md flex flex-col justify-center">
          {/* Notification Heading */}
          <div className="mb-5 justify-center flex items-center gap-2 border-b border-(--border) pb-3">
            <FaBell className="text-yellow-500" size={20} />
            <h2 className="text-xl font-bold text-(--foreground)">
              Notification
            </h2>
          </div>

          {/* Notification Card */}
          <div className="flex items-start gap-4 rounded-xl border border-amber-500/20 bg-(--card-hover) p-4">
            {/* <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
              <FaCloudUploadAlt size={24} />
            </div> */}

            <div>
              <h3 className="text-lg font-semibold text-(--foreground)">
                Uploading Indicator Added.
              </h3>

              <p className="mt-1 text-xs leading-6 text-(--muted-foreground)">
                A loading indicator will remain visible until your recording is
                uploaded. But there's no need to wait for the upload to finish—you
                can start recording the next class immediately while the upload
                continues in the background.
              </p>
            </div>
          </div>
        <button onClick={handleClose} className="px-3 py-2 rounded-md bg-(image:--gradient-primary) w-fi mt-3 text-white text-sm">close</button>
        </div>
      </div>
    );
}

export default Notification
