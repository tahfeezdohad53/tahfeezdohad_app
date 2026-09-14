"use client";

import { useRef, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import useCheckIn from "../hooks/useCheckIn";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";

const batches = [
  {
    label: "Yaqoot Rijaal",
    value: "yaqoot_mardo",
  },
  {
    label: "Yaqoot Nisaa",
    value: "yaqoot_bairo",
  },
  {
    label: "Baneen/Banaat",
    value: "atfaal",
  },
  {
    label: "Sigaar",
    value: "sigaar",
  },
  {
    label: "Kibaar",
    value: "kibaar",
  },
  {
    label: "Taheri Hall",
    value: "taheri_hall",
  },
  {
    label: "Online Class",
    value: "online",
  },
];

function isInsideRadius(userLat, userLon, centerLat, centerLon) {
  const R = 6371000; // Earth radius in meters

  const toRad = (deg) => (deg * Math.PI) / 180;

  const φ1 = toRad(userLat);
  const φ2 = toRad(centerLat);

  const Δφ = toRad(centerLat - userLat);
  const Δλ = toRad(centerLon - userLon);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return distance <= 60; // 30m radius = 60m diameter
}

async function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    handleCheckIn,
    () => toast.error("failed to get location!"),
    { enableHighAccuracy: true, timeout: 15000 },
  );
}

function checkIn() {
  toast.success("Checked In");
}

// async function handleCheckIn(selectedBatch) {
//   const lat = location.coords.latitude;
//   const lng = location.coords.longitude;
//   console.log(lat);
//   console.log(lng);
//   console.log(lat, lng);
//   const isAtLocation = isInsideDiameter(
//     lat,
//     lng,
//     22.832540011580914,
//     74.25593716500295,
//   );
//   alert(location.accuracy);
//   if (isAtLocation) await mutate.mutateAsync({batch:selectedBatch});
//   else toast.error("not at location");
// }

function CheckInButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const timeoutRef = useRef(null);
  const watchPositonRef = useRef(null);
  const mutate = useCheckIn();

  const handleCheckIn = async () => {
    if (!selectedBatch) return;
    setIsSubmitting(true);
    if(selectedBatch === 'taheri_hall' || selectedBatch === 'online') {
      try {
        await mutate.mutateAsync({ batch: selectedBatch });
      } catch (err) {
        // toast.error("failed to check in, try again!");
      } finally {
        setIsSubmitting(false);
        setIsOpen(false);
        setSelectedBatch(null);
        return;
      }
    }
      toast.loading("Checking Your GPS Accuracy...", { id: "checkIn" });

      timeoutRef.current = setTimeout(async () => {
        toast.loading('Your GPS Accuracy is Low, checking in...',{id:'checkIn'});
            try {
              await mutate.mutateAsync({ batch: selectedBatch });
            } catch (err) {
              toast.error("failed to check in, try again!", { id: "checkIn" });
            } finally {
              setIsSubmitting(false);
              setIsOpen(false);
              setSelectedBatch(null);
              // if(timeoutRef.current) clearTimeout(timeoutRef.current);
              if (watchPositonRef.current !== 'null') navigator.geolocation.clearWatch(watchPositonRef.current);
               timeoutRef.current = null;
               watchPositonRef.current = null;
            }
            
      }, 11000);
      
      watchPositonRef.current = navigator.geolocation.watchPosition(async lo => {
        if(lo.coords.accuracy <= 40){
          toast.loading('Verifying Location...',{id:'checkIn'});
          const lat = lo.coords.latitude;
          const lng = lo.coords.longitude
          const isAtLocation = isInsideDiameter(
            lat,
            lng,
            22.83266222,
            74.2558682,
          );
          if (isAtLocation) {
            navigator.geolocation.clearWatch(watchPositonRef.current);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
            watchPositonRef.current = null;
            try {
              await mutate.mutateAsync({ batch: selectedBatch });
            } catch (err) {
              toast.error("failed to check in, try again!");
            } finally {
              setIsSubmitting(false);
              setIsOpen(false);
              setSelectedBatch(null);
            }
          }

          else {
            navigator.geolocation.clearWatch(watchPositonRef.current);
            clearTimeout(timeoutRef.current);
            toast.error("not at location", { id: "checkIn" });
            setIsSubmitting(false);
          }
        }
      },() => {
        toast.loading("Your GPS is not giving reliable location", { id: "checkIn" });
        // if(timeoutRef.current) clearTimeout(timeoutRef.current);
        if(watchPositonRef.current !== 'null') navigator.geolocation.clearWatch(watchPositonRef.current);
        setIsSubmitting(false);
      },{enableHighAccuracy:true,timeout:10000,maximumAge:0})
  };

  return (
    <>
      {/* Check In Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-(--primary) px-3 py-3 text-xs text-white shadow-(--shadow-sm)"
      >
        <IoIosLogOut />
        Check In
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                Select Batch
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Select the batch you are checking in for.
              </p>
            </div>

            {/* Batches */}
            <div className="grid grid-cols-2 gap-2">
              {batches.map((batch) => (
                <button
                  key={batch.label}
                  onClick={() => setSelectedBatch(batch.value)}
                  className={`${batch.value === 'online' && 'col-span-2'} rounded-lg border px-3 py-3 text-xs font-medium transition truncate ${
                    selectedBatch === batch.value
                      ? "border-(--primary) bg-(--primary)/10 text-(--primary)"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {batch.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedBatch(null);
                }}
                className="flex-1 rounded-md border border-gray-200 px-3 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCheckIn}
                disabled={!selectedBatch || isSubmitting}
                className="relative flex-1 rounded-md bg-(--primary) px-3 py-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className={`${mutate.isPending ? 'opacity-0' : 'opacity-100'}`}>Check In</span>
                <span className={`${mutate.isPending ? 'opacity-100':'opacity-0'} animate-spin absolute top-1/2 left-1/2 -translate-1/2`}><ImSpinner2 /></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CheckInButton;
