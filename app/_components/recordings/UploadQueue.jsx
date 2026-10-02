'use client';
import { FiUploadCloud, FiX, FiRotateCcw } from "react-icons/fi";
import { useAppProvider } from "../providers/AppProvider";
import { IoCloudUploadOutline } from "react-icons/io5";
import useAudioRecorder from "@/app/_hooks/useAudioRecorder";
import { useState } from "react";
import toast from "react-hot-toast";
import RecordingUploadToast from "../toast/RecordingUploadToast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { RxCross1 } from "react-icons/rx";

export default function UploadQueue({onClose}) {
    const {recordingsQueue,setRecordingsQueue} = useAppProvider();
    const [isSubmitting,setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
     async function submitRecording(studentId, name,formattedDuration,audio,slot,id) {
      
       const localAudioType = audio.type;
       setIsSubmitting(true);
       const toastId = "uploading";
       let blob = audio;
      
       try {

         toast.loading("Upload starting...", { id: toastId });

         let data;

         // Step 1: Get signed URL
         for (let i = 0; i < 4; i++) {
           try {
             const res = await api.get(`/recording/signedToken/${name}`);

             data = res.data;
             break;
           } catch (err) {
             if (i === 3) {
               console.error("Signed URL Error:", err);
             }
           }
         }

         // Step 2: Upload to R2
         if (data?.signedUrl) {
           try {
             await axios.put(data.signedUrl, blob, {
               headers: {
                 "Content-Type": localAudioType,
               },
               onUploadProgress: (progress) => {
                 const percent = Math.round(
                   (progress.loaded * 100) / progress.total,
                 );
                 toast.custom(
                   (t) => {
                     return (
                       <RecordingUploadToast
                         totalMB={progress.total / (1024 * 1024)}
                         uploadedMB={progress.loaded / (1024 * 1024)}
                         progress={percent}
                         fileName={data?.key || "unknown"}
                         onClose={() => toast.dismiss(t.id)}
                       />
                     );
                   },
                   { id: toastId },
                 );
               },
             });
             await api.post("/recording/updateStats", { status: "success" });
           } catch (error) {
             toast.loading(`wait...`, {
               id: toastId,
             });

             try {
               const { data: status } = await axios.get(
                 `${process.env.NEXT_PUBLIC_URL}/recording/isUploaded`,
                 { params: { url: data?.url }, withCredentials: true },
               );
               if (status.uploaded)
                 await api.post("/recording/updateStats", {
                   status: "success",
                 });

               if (!status.uploaded) {
                 try {
                   await axios.put(data.signedUrl, blob, {
                     headers: {
                       "Content-Type": localAudioType,
                     },
                     onUploadProgress: (progress) => {
                       const percent = Math.round(
                         (progress.loaded * 100) / progress.total,
                       );
                       toast.custom(
                         (t) => {
                           return (
                             <RecordingUploadToast
                               totalMB={progress.total / (1024 * 1024)}
                               uploadedMB={progress.loaded / (1024 * 1024)}
                               progress={percent}
                               fileName={data?.key || "unknown"}
                               retrying={true}
                               onClose={() => toast.dismiss(t.id)}
                             />
                           );
                         },
                         { id: toastId },
                       );
                     },
                   });
                   await api.post("/recording/updateStats", {
                     status: "success",
                   });
                   
                 } catch (err) {
                   try {
                     await api.post("/recording/updateStats", {
                       status: "fail",
                     });
                   } catch (error2) {
                     console.log(error2);
                   }
                   console.log(err);
                 }
               }
             } catch (err) {
               // toast.error(
               //   "something went wrong but your recording entry will be saved, please report this message to admin",
               //   { duration: 8000 },
               // );
             }
           }
         }

         toast.loading("Almost done...", { id: toastId });

         

         for (let i = 0; i < 4; i++) {
           try {
             await axios.post(
               `${process.env.NEXT_PUBLIC_URL}/recording/create/${studentId}`,
               {
                 isOnline: false,
                 url: data?.url,
                 duration: formattedDuration,
                 slot: slot,
               },
               { withCredentials: true },
             );
             break;
           } catch (err) {
             console.error("Database Save Error:", err);
             if (i === 3) {
               toast.error(
                 "Recording was uploaded, but we couldn't save it. Please report this exact message to your supervisor or the system administrator.",
                 { id: toastId, duration: 8000 },
               );
               await api.post("/recording/updateStats", {
                 status: "saveFailed",
               });
               throw err;
             }
           }
         }

         toast.success("Upload complete!", {
           id: toastId,
         });
         queryClient.invalidateQueries({ queryKey: ["myStudents"] });
         queryClient.invalidateQueries({ queryKey: ["recordings"] });
         setRecordingsQueue(el => el.filter(el => el.id !== id));
         onClose();
       } catch (err) {
         console.error("Submission Error:", err);
         toast.error("Upload Failed!");
       } finally {
         setIsSubmitting(false);
       }
     }
  return (
    <div
      onClick={onClose}
      className="flex items-center justify-center fixed top-0 left-0 z-50 h-screen w-full backdrop-brightness-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-3/4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <p className="absolute right-2 top-2 text-sm" onClick={onClose}><RxCross1 /></p>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiUploadCloud size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Upload Queue
              </h3>

              <p className="text-xs text-gray-500">
                {recordingsQueue.length}{" "}
                {recordingsQueue.length === 1 ? "recording" : "recordings"}{" "}
                
              </p>
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="max-h-80 overflow-y-auto">
          {recordingsQueue.map((item, i) => (
            <div
              key={item.name + " - " + i}
              className="border-b border-gray-100 px-4 py-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                {/* Audio icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                  🎙️
                </div>

                {/* Name + duration */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {Math.ceil(item.duration / 60)} min
                  </p>

                  {/* Upload progress */}
                  {item.status === "uploading" && (
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Uploading {item.progress}%
                      </p>
                    </div>
                  )}

                  {/* Failed */}
                  {item.status === "failed" && (
                    <p className="mt-1 text-[11px] text-red-500">
                      Upload failed
                    </p>
                  )}

                  {/* Waiting */}
                  {item.status === "waiting" && (
                    <p className="mt-1 text-[11px] text-gray-400">
                      Waiting to upload
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {item.status === "failed" && (
                    <button
                      onClick={() => onRetry(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      title="Retry upload"
                    >
                      <FiRotateCcw size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => submitRecording(item.studentId,item.name,item.duration,item.blob,item.slot,item.id)}
                    className="bg-blue-50 flex h-8 w-8 items-center justify-center rounded-lg text-blue-400 transition hover:bg-blue-50 hover:text-blue-500"
                    title="Remove"
                  >
                    <IoCloudUploadOutline size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
