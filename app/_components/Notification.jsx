"use client";

import { useEffect, useState } from "react";

import {
  FaCheck,
  FaShield,
  FaArrowLeft,
  FaRotate,
  FaTriangleExclamation,
} from "react-icons/fa6";

import { useUser } from "./providers/UserProvider";

function Notification() {
  const { user } = useUser();
  const [isNotifiedAboutLosingRecording, setIsNotifiedAboutLosingRecording] = useState(null);

  useEffect(() => {
    const notified = localStorage.getItem("isNotifiedAboutLosingRecording");
    setIsNotifiedAboutLosingRecording(notified === "true");
  }, []);

  function handleClose() {
    localStorage.removeItem("recordingsPrivacyNotified");
    localStorage.setItem("isNotifiedAboutLosingRecording","true");
    setIsNotifiedAboutLosingRecording(true);
  }

  if (user?.role === "student") return;

  if (!user?._id || isNotifiedAboutLosingRecording === null) {
    return null;
  }

  if (isNotifiedAboutLosingRecording) {
    return null;
  }

  return (
    <div className=" fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-1 backdrop-blur-[2px]">
      <div className="h-[99%] lg:h-fit overflow-auto w-full lg:w-1/3 rounded-2xl bg-(--card) shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-(--border) px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
            <FaShield size={16} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-(--foreground)">
              Recording Protection
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Your recordings are now safer
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-(--foreground)">
            We’ve received several reports about recordings being accidentally
            lost by clicking the <span className="font-semibold">Back</span>{" "}
            button. We’ve now added protection to help prevent this.
          </p>

          {/* Back Protection */}
          <div className="mt-4 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaArrowLeft size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                Back button protection
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                The Back button in your device and browser is disabled while recording and before
                submitting your recording, helping prevent accidental loss.
              </p>
            </div>
          </div>

          {/* Refresh Protection */}
          <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaRotate size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                Refresh protection
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Refreshing the page during recording or before submitting is
                also protected.
              </p>
            </div>
          </div>

          {/* Leaving Site */}
          <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaTriangleExclamation size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                Accidentally leaving the site?
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                If you accidentally click the browser Home button or try to
                leave the site, a confirmation message will appear. If you leave
                by mistake, simply click your device Back button to return to
                the site without losing your recording.
              </p>
            </div>
          </div>

          {/* Support */}
          <p className="mt-4 text-xs leading-5 text-gray-500">
            If you face any problems or unexpected behavior, please report it to
            the administration so we can investigate and improve the system.
          </p>
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
