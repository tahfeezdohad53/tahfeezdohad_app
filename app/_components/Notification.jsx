"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaLock, FaMicrophone } from "react-icons/fa";

import { useUser } from "./providers/UserProvider";

function Notification() {
  const { user } = useUser();

  const [isRecordingNotified, setIsRecordingNotified] = useState(null);

  useEffect(() => {
    const notified = localStorage.getItem("recordingsPrivacyNotified");

    setIsRecordingNotified(notified === "true");
  }, []);

  function handleClose() {
    localStorage.setItem("recordingsPrivacyNotified", "true");
    localStorage.removeItem('ratingDismissed');
    localStorage.removeItem('isAppreciated');
    localStorage.removeItem('isNotified');
    localStorage.removeItem('isNotified2');
    localStorage.removeItem('isRated');
    localStorage.removeItem('isRated2');
    setIsRecordingNotified(true);
  }

  if(user?.role === 'student') return;

  if (!user?._id || isRecordingNotified === null) {
    return null;
  }

  if (isRecordingNotified) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-(--card) shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-(--border) px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
            <FaMicrophone size={16} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-(--foreground)">
              Recordings page
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Listen to your class recordings anytime
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-(--foreground)">
            You can now access the{" "}
            <span className="font-semibold">Recordings</span> page to listen to
            your recorded classes.
          </p>

          {/* Privacy */}
          <div className="mt-4 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaLock size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                Your recordings are private
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                You can only listen to recordings that you have recorded. Other
                teachers will not be able to access or listen to your
                recordings. Administrators have access to your recordings.
              </p>
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
        </div>
      </div>
    </div>
  );
}

export default Notification;
