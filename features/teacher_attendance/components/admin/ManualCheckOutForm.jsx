'use state';

import { FaRightFromBracket } from "react-icons/fa6";
import { Modal } from "../TeacherAttendanceFilter"
import { FaCheck } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import useManualCheckOut from "../../hooks/useManualCheckOut";

function ManualCheckOutForm({onClose,el}) {
    const [checkoutHour, setCheckoutHour] = useState("");
    const [checkoutMinute, setCheckoutMinute] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mutate = useManualCheckOut();

    async function handleSubmit() {
      if (!checkoutHour || !checkoutMinute) return;

      const now = new Date();
      const checkedInDate = new Date(el.checkedIn);

      const currentHour = now.getHours();
      const currentMin = now.getMinutes();

      const checkedInHour = checkedInDate.getHours();
      const checkedInMin = checkedInDate.getMinutes();

      const hour = Number(checkoutHour);
      const minute = Number(checkoutMinute);

      // Cannot checkout in the future
      if (hour > currentHour) {
        return toast.error("You cannot set hour greater than current hour!");
      }

      if (hour === currentHour && minute > currentMin) {
        return toast.error(
          "You cannot set minute greater than current minute!",
        );
      }

      // Cannot checkout before check-in
      if (hour < checkedInHour) {
        return toast.error("You cannot set hour smaller than check-in hour!");
      }

      if (hour === checkedInHour && minute < checkedInMin) {
        return toast.error(
          "You cannot set minute smaller than check-in minute!",
        );
      }

      const checkOutDate =
        `${now.getFullYear()}-` +
        `${String(now.getMonth() + 1).padStart(2, "0")}-` +
        `${String(now.getDate()).padStart(2, "0")}T` +
        `${String(hour).padStart(2, "0")}:` +
        `${String(minute).padStart(2, "0")}:00+05:30`;

      try {
        setIsSubmitting(true);

        await mutate.mutateAsync({
          checkOutDate,
          teacherId: el.teacher,
          attendanceId: el._id,
        });

        onClose();
      } catch (err) {
        console.log(err);
      } finally {
        setIsSubmitting(false);
      }
    }
    return (
      <Modal onClose={onClose}>
        <div className="flex items-center gap-3 border-b border-(--border) px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
            <FaRightFromBracket size={16} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-(--foreground)">
              Manual Check-Out
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Complete the attendance record manually
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          {/* Check-in Information */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-(--border) bg-(--card-hover) px-3.5 py-3">
            <div>
              <p className="text-[11px] text-gray-500">Checked in</p>

              <p className="mt-0.5 text-sm font-medium text-(--foreground)">
                {format(new Date(el.checkedIn), "dd MMM · HH:mm")}
              </p>
            </div>

            <div className="h-8 w-px bg-(--border)" />

            <div>
              <p className="text-[11px] text-gray-500">Check-out</p>

              <p className="mt-0.5 text-sm font-medium text-gray-400">
                Not recorded
              </p>
            </div>
          </div>

          {/* Time Selection */}
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-(--foreground)">
              Check-out time
            </p>

            <div className="flex items-center gap-3">
              {/* Hour */}
              <div className="flex-1">
                <label className="mb-1.5 block text-xs text-gray-500">
                  Hour
                </label>

                <select
                  value={checkoutHour}
                  onChange={(e) => setCheckoutHour(e.target.value)}
                  className="
                          w-full rounded-lg
                          border border-(--border)
                          bg-(--card-hover)
                          px-3 py-2
                          text-sm text-(--foreground)
                          outline-none
                          transition
                          focus:border-(--primary)
                        "
                >
                  <option value="">Select hour</option>

                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <span className="mt-6 text-lg font-semibold text-gray-400">
                :
              </span>

              {/* Minute */}
              <div className="flex-1">
                <label className="mb-1.5 block text-xs text-gray-500">
                  Minute
                </label>

                <select
                  value={checkoutMinute}
                  onChange={(e) => setCheckoutMinute(e.target.value)}
                  className="
                          w-full rounded-lg
                          border border-(--border)
                          bg-(--card-hover)
                          px-3 py-2
                          text-sm text-(--foreground)
                          outline-none
                          transition
                          focus:border-(--primary)
                        "
                >
                  <option value="">Select minute</option>

                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Warning */}
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 border-t border-(--border) px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
                    flex-1 rounded-lg
                    border border-(--border)
                    px-4 py-2.5
                    text-sm font-medium
                    text-(--foreground)
                    transition
                    hover:bg-(--card-hover)
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              checkoutHour === "" || checkoutMinute === "" || isSubmitting
            }
            className="
                    flex flex-1 items-center justify-center gap-2
                    rounded-lg
                    bg-(--primary)
                    px-4 py-2.5
                    text-sm font-medium text-white
                    transition
                    hover:opacity-90
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
          >
            <FaCheck size={12} />

            {isSubmitting ? "Saving..." : "Check-Out"}
          </button>
        </div>
      </Modal>
    );
}

export default ManualCheckOutForm
