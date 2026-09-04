import { formatName } from "@/helpers";
import {
  Clock3,
  Headphones,
  BookOpen,
  Bell,
  Volume2,
  Scale,
  Layers3,
  Monitor,
  FileText,
} from "lucide-react";

function IkhtebaarReportCard({ report }) {
  const details = [
    {
      icon: Clock3,
      key: "Duration",
      value: report.duration ? Math.round(report.duration) + ' min' : '?' 
    },
    {
      icon: Headphones,
      key: "Audio",
      value: report.audio ? "Available" : "None",
    },
    {
      icon: Bell,
      key: "Talqeen",
      value: report.talqeen ?? 0,
    },
    {
      icon: Bell,
      key: "Tambeeh",
      value: report.tambeeh ?? 0,
    },
    {
      icon: Volume2,
      key: "Makharij",
      value: report.makharij || "-",
    },
    {
      icon: Scale,
      key: "Class Mode",
      value: report.classMode || "-",
    },
    {
      icon: Layers3,
      key: "Class Type",
      value: report.classType || "-",
    },
    {
      icon: FileText,
      key: "Juz",
      value:
        report.from != null && report.to != null
          ? `${report.from} - ${report.to}`
          : "-",
    },
  ];

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const formattedTime = report.createdAt
    ? new Date(report.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "-";

  return (
    <div className="bg-(--card) p-3 flex flex-col gap-5 border border-(--border) rounded-md shadow-(--shadow-md) font-semibold">
      {/* Top */}
      <div>
        <div className="flex items-center justify-between">
          {/* Student */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              {report.student?.name?.split(" ")[1].charAt(0)?.toUpperCase() ||
                "S"}
            </div>

            <div className="text-xs">
              <h1 className="font-bold">
                {formatName(report.student?.name) || "Unknown Student"}
              </h1>

              <h1 className="text-gray-600 text-[0.60rem]">
                by {formatName(report.teacher?.name) || "Unknown Teacher"}
              </h1>
            </div>
          </div>

          {/* Date */}
          <div className="text-xs text-right">
            <p>{formattedDate}</p>
            <p className="text-gray-600">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* Quran details */}
      <div className="grid grid-cols-4 text-sm border-b border-(--border) pb-2">
        {[
          {
            icon: <BookOpen size={15} />,
            key: "Juz",
            value: report.juz,
          },
          {
            icon: <FileText size={15} />,
            key: "Page",
            value: report.page,
          },
          {
            icon: <Layers3 size={16} />,
            key: "From",
            value: report.from,
          },
          {
            icon: <FileText size={16} />,
            key: "To",
            value: report.to,
          },
        ].map((el, i, arr) => (
          <div
            key={el.key}
            className={`
              px-3
              flex
              items-center
              justify-center
              gap-2
              ${arr.length !== i + 1 ? "border-r" : ""}
              border-(--border)
            `}
          >
            {el.icon}

            <div className="flex flex-col items-center">
              <h1 className="text-xs text-gray-600">{el.key}</h1>

              <h1>{el.value ?? "-"}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* Grade */}
      <div className="grid grid-cols-2 border-b border-(--border) pb-2">
        <div className="text-sm flex items-center gap-2 border-r border-(--border) px-3">
          <Scale size={15} />

          <p className="text-gray-600">Grade</p>

          <p className="p-1 px-2 rounded-md bg-yellow-100 text-yellow-600">
            {report.grade || "-"}
          </p>
        </div>

        <div className="text-sm flex items-center gap-2 px-3">
          <Volume2 size={15} />

          <p className="text-gray-600">Makharij</p>

          <p className="p-1 px-2 rounded-md bg-yellow-100 text-yellow-600">
            {report.makharijGrade || "-"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 text-xs">
        {details.map(({ icon: Icon, key, value }, i) => (
          <div
            key={key}
            className={`
              flex items-center gap-2 py-3 px-3
              border-b
              ${i % 2 === 0 ? "border-r" : ""}
              border-(--border)
            `}
          >
            <Icon size={16} strokeWidth={1.8} className="text-gray-600" />

            <span className="text-gray-600">{key}</span>

            <span>{value}</span>
          </div>
        ))}
      </div>

      {/* Remarks */}
      {report.remarks && (
        <div className="text-xs border-t border-(--border) pt-3">
          <p className="text-gray-600 mb-1">Remarks</p>

          <p>{report.remarks}</p>
        </div>
      )}
    </div>
  );
}

export default IkhtebaarReportCard;
