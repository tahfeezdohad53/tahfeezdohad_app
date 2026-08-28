import { FiUploadCloud, FiX } from "react-icons/fi";

function RecordingUploadToast({
  fileName = "Student_Recording_24.mp3",
  uploadedMB = 12.8,
  totalMB = 20,
  progress = 64,
  retrying=false,
  onClose,
}) {
  return (
    <div className="w-[95%] lg:w-105 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-start gap-3">
        {/* Upload Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FiUploadCloud size={21} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              Uploading recording
            </p>

            <span className="shrink-0 text-xs font-medium text-gray-500">
              {progress}%
            </span>
          </div>

          <p className="mt-0.5 truncate text-xs text-gray-500">{fileName}</p>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Upload Info */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
            <span>{retrying ? 'Retrying' : 'Uploading'}...</span>

            <span>
              {uploadedMB.toFixed(1)} MB / {totalMB.toFixed(1)} MB
            </span>
          </div>
        </div>

        {/* Close */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-gray-400 transition hover:text-gray-700"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default RecordingUploadToast;
