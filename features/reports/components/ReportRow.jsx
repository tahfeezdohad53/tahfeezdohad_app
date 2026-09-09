import { CiCalendar } from "react-icons/ci";

const colors = [
    "",
  "bg-green-100 text-green-600",
  "bg-red-100 text-red-600",
  "bg-purple-100 text-purple-600",
  "bg-yellow-100 text-yellow-600",
  "bg-blue-100 text-blue-600",
  "bg-red-100 text-red-600",
  "bg-yellow-100 text-yellow-600",
  "bg-rose-100 text-rose-600",
  "bg-gray-100 text-gray-600",
];
function ReportRow({show}) {
  const i = Math.round(Math.random() * 9) + 1;
  const i2 = Math.round(Math.random() * 9) + 1;
  const i3 = Math.round(Math.random() * 9) + 1;
  return (
    <div onClick={() => show(el => !el)} className="grid grid-cols-7 text-xs border-b p-3 border-gray-300 bg-(--card) gap-3">
      <p className="flex items-center gap-2">
        <span className="lg:block hidden p-2 rounded-md bg-orange-100 w-fit">
          <CiCalendar className="text-orange-600" />
        </span>
        <div className="flex flex-col">
          <span className="font-semibold">3 sep 2025</span>{" "}
          <span className="text-gray-600 text-[0.65rem]">10:00 am</span>
        </div>
      </p>
      <h1 className="col-span-2 flex items-center gap-2 font-bold">
        <p className={`p-1 rounded-full ${colors[i]} font-bold w-fit px-2`}>
          H
        </p>{" "}
        hasan bhai hakimuddin bhai pitolwala
      </h1>
      <p className="col-span-2 font-semibold flex items-center">
        Huzifa bhai asgar bhai ratlamwala
      </p>
      <p
        className={`bg-purple-100 ${colors[i2]} text-purple-600 w-fit p-1 px-3 flex items-center justify-center rounded-md font-bold`}
      >
        t2
      </p>
      <div className="flex justify-between">
        <p
          className={`bg-purple-100 ${colors[i3]} text-purple-600 w-fit p-1 px-3 flex items-center justify-center rounded-md font-bold`}
        >
          in-person
        </p>
        <button className="text-lg"> &gt; </button>
      </div>
    </div>
  );
}

export default ReportRow;
