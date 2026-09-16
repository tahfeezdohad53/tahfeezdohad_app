"use client";

import { useEffect, useState } from "react";

import {
  FaMicrophone,
  FaCompressAlt,
  FaWifi,
  FaBolt,
  // FaCircleInfo,
  FaCheck,
} from "react-icons/fa";

import { useUser } from "./providers/UserProvider";
import { CiCircleInfo } from "react-icons/ci";

function Notification() {
  const { user } = useUser();
  const [isNotifiedAboutBandwithReduced, setIsNotifiedAboutBandwithReduced] = useState(null);

  useEffect(() => {
    const notified = localStorage.getItem("isNotifiedAboutBandwithReduced");
    setIsNotifiedAboutBandwithReduced(notified === "true");
  }, []);

  function handleClose() {
    localStorage.removeItem("isNotifiedAboutLosingRecording");
    localStorage.setItem("isNotifiedAboutBandwithReduced","true");
    // localStorage.setItem("isNotifiedAboutAttendancePage","true");
    setIsNotifiedAboutBandwithReduced(true);
  }

  if (user?.role === "student") return;

  if (!user?._id || isNotifiedAboutBandwithReduced === null) {
    return null;
  }

  if (isNotifiedAboutBandwithReduced) {
    return null;
  }

  if(user?.role === 'teacher' || user?.role === 'admin')return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-1 px-4 backdrop-blur-[2px]">
      <div className="h-fit max-h-[99%] w-full overflow-auto rounded-2xl bg-(--card) shadow-2xl lg:h-fit lg:w-1/3">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-(--border) px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
            <FaMicrophone size={17} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-(--foreground)">
              Recording System Update
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Audio uploads now use significantly less bandwidth
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-(--foreground)">
            We’ve made an improvement to the{" "}
            <span className="font-semibold">audio recording system</span> to
            significantly reduce the bandwidth required to upload your Class
            recordings.
          </p>

          {/* Smaller Files */}
          <div className="mt-5 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaCompressAlt size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                1. Smaller Recording Files
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Recording file sizes have been reduced by more than{" "}
                <span className="font-semibold">50%</span>, helping  recordings easier to upload.
              </p>
            </div>
          </div>

          {/* Less Bandwidth */}
          <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaWifi size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                2. Less Bandwidth Usage
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your recordings now require significantly less internet data,
                which can help improve upload speed and reliability.
              </p>
            </div>
          </div>

          {/* Faster Uploads */}
          <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaBolt size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                3. Faster & More Reliable Uploads
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Smaller files mean faster uploads, especially when using a
                slower or unstable internet connection.
              </p>
            </div>
          </div>

          {/* Important Note */}
          {/* <div className="mt-4 flex gap-2.5 rounded-lg bg-(--primary)/5 px-3.5 py-3">
            <CiCircleInfo
              className="mt-0.5 shrink-0 text-(--primary)"
              size={13}
            />

            <p className="text-xs leading-5 text-(--foreground)">
              <span className="font-semibold">Good to know:</span> This update
              is applied automatically. You do not need to change any settings.
            </p>
          </div> */}
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-5 py-4">
          <button
            onClick={handleClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
          >
            <FaCheck size={12} />
            Got it
          </button>

          <p className="mt-2 text-center text-[10px] text-gray-400">
            Regards, System Administrator
          </p>
        </div>
      </div>
    </div>
  );
}

export default Notification;

// localStorage.setItem("recordingsPrivacyNotified", "true");
