import { formatName } from "@/helpers";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaMicrophone } from "react-icons/fa6";

function IkhtebaarForm({
  studentId,
  studentName,
  audioSize,
  clientAudioUrl,
  submitIkhtebaarRecording,
  isSubmitting,
  setIsRecorded,
  setClientAudioUrl,
  setAudio,
  setTotalSeconds,
  setIsPause,
  setIsRecording,
}) {

    const [rec,setRec] = useState({url:'',duration:0,isUploaded:false});
    const [isTriedUploadingAudio,setIsTriedUploadingAudio] = useState(false);
    const router = useRouter();
    async function handleSubmitAudio(){
        try{
            const {url,classDuration} = await submitIkhtebaarRecording(studentId,studentName);
            setRec({url,duration:classDuration,isUploaded:true});
        }catch(err){
            toast.error('failed to upload audio, please try again! if the problem persists please download the audio and submit details',{duration:8000});
            console.log(err);
        }finally{
          setIsTriedUploadingAudio(true);
        }
    }
  async function handleDetailsSubmit(e) {
    e.preventDefault();

    if(!isTriedUploadingAudio) return toast.error('Please upload audio recording first!');
    const formData = new FormData(e.currentTarget);

    const details = {
      student:studentId,
      juz: formData.get("juz"),
      page: formData.get("page"),
      tambeeh: formData.get("tambeeh"),
      talqeen: formData.get("talqeen"),
      questions: formData.get("questions"),
      from: formData.get("from"),
      to: formData.get("to"),
      makharij: formData.get("makharij"),
      remarks: formData.get("remarks"),
      classMode: "in-person",
      classType:'tm',
    };

    // console.log(details);
    try {
      details.audio = rec.url;
      details.duration = rec.duration;
      await api.post(`/report/create`, details);
      toast.success('ikhtebaar report submitted.');
      setAudio(null);
      setIsRecording(false);
      setIsRecorded(false);
      URL.revokeObjectURL(clientAudioUrl);
      setClientAudioUrl("");
      router.replace('/students');
    } catch (err) {
      toast.error("failed to upload please try again");
    }

    // Handle your details submission here
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-(--border) bg-(--card) shadow-(--shadow-xl) overflow-hidden">
      <div className="p-5 space-y-5">
        {/* ================= AUDIO ================= */}

        <AudioSection
          studentName={studentName}
          clientAudioUrl={clientAudioUrl}
          rec={rec}
          isSubmitting={isSubmitting}
          handleSubmitAudio={handleSubmitAudio}
          audioSize={audioSize}
        />

        {/* ================= DETAILS ================= */}

        <section className="rounded-xl border border-(--border) bg-(--background) p-4">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-xs text-amber-600">
                ✓
              </div>

              <p className="text-sm font-semibold">Ikhtebaar Details</p>
            </div>

            <p className="mt-1 ml-9 text-xs text-(--muted-foreground)">
              Enter the details for this recording
            </p>
          </div>

          <form
            onSubmit={handleDetailsSubmit}
            data-student-id={studentId}
            className="space-y-4"
          >
            {/* Juz + Page */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Currently At Juz
                </label>

                <input
                  required
                  type="number"
                  name="juz"
                  placeholder="Juz"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Currently At Page
                </label>

                <input
                  required
                  type="number"
                  name="page"
                  placeholder="Page"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium">From</label>

                <input
                  max={30}
                  min={1}
                  required
                  type="number"
                  name="from"
                  placeholder="1-30"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">To</label>

                <input
                  max={30}
                  min={1}
                  required
                  type="number"
                  name="to"
                  placeholder="1-30"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>
            </div>

            {/* Tambeeh + Talqeen */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Tambeeh
                </label>

                <input
                  required
                  type="text"
                  name="tambeeh"
                  placeholder="Tambeeh"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  Talqeen
                </label>

                <input
                  required
                  type="text"
                  name="talqeen"
                  placeholder="Talqeen"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>
            </div>

            {/* Questions + Grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  No. of Questions
                </label>

                <input
                  required
                  type="number"
                  name="questions"
                  placeholder="Questions"
                  min="0"
                  className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              
               
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Makharij
              </label>

              <input
                required
                type="text"
                name="makharij"
                placeholder="Makharij"
                className="w-full rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>
            </div>

            {/* Ahkaam */}

            {/* Makharij */}

            {/* Remarks */}
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Remarks
              </label>

              <textarea
                rows={4}
                name="remarks"
                placeholder="Add any remarks..."
                className="w-full resize-none rounded-lg border border-(--border) bg-(--card) px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>

            {/* Submit Details */}
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-[0.99]"
            >
              Submit Ikhtebaar Details
            </button>
          </form>
        </section>

        {/* Privacy */}
        <p className="text-center text-[11px] text-(--muted-foreground)">
          🔒 Your recording and details are securely stored
        </p>
      </div>
    </div>
  );
}

export default IkhtebaarForm;


function AudioSection({studentName,clientAudioUrl,rec,isSubmitting,handleSubmitAudio,audioSize}){
    return (
      <section className="rounded-xl border border-(--border) bg-(--background) p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold">Audio Recording</p>

            <p className="text-xs text-(--muted-foreground) mt-0.5">
              Review your recording before submitting
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <FaMicrophone />
          </div>
        </div>

        {/* Student */}
        <div className="mb-4 rounded-lg border border-(--border) bg-(--card) px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-(--muted-foreground)">
            Student
          </p>

          <p className="mt-1 text-sm font-semibold">
            {formatName(studentName)}
          </p>
        </div>

        {/* Audio */}
        {clientAudioUrl ? (
          <audio controls src={clientAudioUrl} className="w-full" />
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-(--border) py-6 text-xs text-(--muted-foreground)">
            No recording available
          </div>
        )}

        {rec.isUploaded ? (
          <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="text-sm font-semibold">Recording uploaded</p>
                <p className="text-xs text-(--muted-foreground)">
                  Your recording has been submitted successfully.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            disabled={isSubmitting}
            onClick={handleSubmitAudio}
            className="w-full text-center py-2 rounded-md bg-(--primary) disabled:bg-(--primary-light) text-white mt-3"
          >
            {isSubmitting ? "Uploading..." : "Submit Recording"}
          </button>
        )}

        {/* Audio info */}
        {audioSize && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-(--muted-foreground)">Recording size</span>

            <span className="font-medium">
              {Number(audioSize / 1024 / 1024).toFixed(1)} mb
            </span>
          </div>
        )}

        {/* Audio Actions */}
      </section>
    );
}