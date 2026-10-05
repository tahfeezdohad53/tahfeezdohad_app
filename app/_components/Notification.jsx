"use client";

import { useEffect, useState } from "react";

import {
  FaMicrophone,
  FaCompressAlt,
  FaWifi,
  FaBolt,
  // FaCircleInfo,
  FaCheck,
  FaCloudUploadAlt,
  FaCommentAlt,
} from "react-icons/fa";

import { useUser } from "./providers/UserProvider";
import { CiCircleInfo } from "react-icons/ci";

function Notification() {
  const { user } = useUser();
  const [isNotifiedAboutQueueAndRemarks, setIsNotifiedAboutQueueAndRemarks] = useState(null);

  useEffect(() => {
    const notified = localStorage.getItem("isNotifiedAboutQueueAndRemarks");
    setIsNotifiedAboutQueueAndRemarks(notified === "true");
  }, []);

  function handleClose() {
    localStorage.setItem("isNotifiedAboutQueueAndRemarks","true");
    // localStorage.setItem("isNotifiedAboutBandwithReduced","true");
    // localStorage.setItem("isNotifiedAboutAttendancePage","true");
    setIsNotifiedAboutQueueAndRemarks(true);
  }

  if (user?.role === "student") return;

  if (!user?._id || isNotifiedAboutQueueAndRemarks === null) {
    return null;
  }

  if (isNotifiedAboutQueueAndRemarks) {
    return null;
  }
  if(!user?.contactEmail || !user?.contactNumber) return;

  if(user?.role === 'admin' || user?.role === 'teacher')return <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-1 px-4 backdrop-blur-[2px]">
  <div className="h-fit max-h-[99%] w-full overflow-auto rounded-2xl bg-(--card) shadow-2xl lg:h-fit lg:w-1/3">
    {/* Header */}
    <div className="flex items-center gap-3 border-b border-(--border) px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
        <FaCloudUploadAlt size={17} />
      </div>

      <div>
        <h2 className="text-base font-semibold text-(--foreground)">
          New Features Update
        </h2>

        <p className="mt-0.5 text-xs text-gray-500">
          New tools to make recording follow-ups easier
        </p>
      </div>
    </div>

    {/* Content */}
    <div className="px-5 py-5">
      <p className="text-sm leading-6 text-(--foreground)">
        We’ve added two new features to make managing and following up on your
        <span className="font-semibold"> Class recordings</span> easier and
        more convenient.
      </p>

      {/* Remarks */}
      <div className="mt-5 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
          <FaCommentAlt size={13} />
        </div>

        <div>
          <p className="text-sm font-semibold text-(--foreground)">
            1. Remarks Before Submission
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            You can now add a{" "}
            <span className="font-semibold">remark</span> before submitting a
            class recording. If you enter a remark, an email will automatically
            be sent to the student’s parent.
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            This makes it easier and more convenient to{" "}
            <span className="font-semibold">follow up with parents</span>{" "}
            regarding a student’s class.
          </p>
        </div>
      </div>

      {/* Recording Queue */}
      <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
          <FaCloudUploadAlt size={13} />
        </div>

        <div>
          <p className="text-sm font-semibold text-(--foreground)">
            2. Recording Upload Queue
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            If a recording fails to upload, it will now be automatically added
            to the <span className="font-semibold">recording queue</span>.
            You can open the queue in recordings page and upload the recording again when your
            internet connection is stable.
          </p>

          <div className="mt-2 rounded-lg bg-(--primary)/5 px-3 py-2">
            <p className="text-[11px] leading-5 text-(--foreground)">
              <span className="font-semibold">Important:</span> Recordings
              stored in the queue are temporary. If you completely close or
              refresh the browser, queued recordings will be lost.
            </p>
          </div>
        </div>
      </div>
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
;
}

export default Notification;

// localStorage.setItem("recordingsPrivacyNotified", "true");
