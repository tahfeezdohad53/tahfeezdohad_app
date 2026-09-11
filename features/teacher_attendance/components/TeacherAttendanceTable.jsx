const attendanceRecords = [
  {
    date: "Sep 03, 2026",
    checkIn: "08:32 AM",
    checkOut: "11:45 AM",
    totalMin: 193,
    duration: "3h 13m",
  },
  {
    date: "Sep 03, 2026",
    checkIn: "01:05 PM",
    checkOut: "04:15 PM",
    totalMin: 190,
    duration: "3h 10m",
  },
  {
    date: "Sep 02, 2026",
    checkIn: "08:30 AM",
    checkOut: "12:30 PM",
    totalMin: 240,
    duration: "4h 00m",
  },
  {
    date: "Sep 02, 2026",
    checkIn: "02:00 PM",
    checkOut: "03:00 PM",
    totalMin: 60,
    duration: "1h 00m",
  },
  {
    date: "Sep 01, 2026",
    checkIn: "09:00 AM",
    checkOut: "01:20 PM",
    totalMin: 260,
    duration: "4h 20m",
  },
  {
    date: "Aug 31, 2026",
    checkIn: "08:35 AM",
    checkOut: "11:30 AM",
    totalMin: 175,
    duration: "2h 55m",
  },
  {
    date: "Aug 31, 2026",
    checkIn: "12:00 PM",
    checkOut: "01:05 PM",
    totalMin: 65,
    duration: "1h 05m",
  },
  {
    date: "Aug 30, 2026",
    checkIn: "08:45 AM",
    checkOut: "12:30 PM",
    totalMin: 225,
    duration: "3h 45m",
  },
];

function TeacherAttendanceTable() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Attendance Records
        </h2>

        {/* <button className="flex items-center gap-1 text-xs text-gray-700">
          All Dates
          <span>⌄</span>
        </button> */}
      </div>

      {/* Table */}
      <div className="px-3">
        {/* Table Header */}
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_20px] items-center rounded-md bg-[#f6f3f0] px-2 py-2 text-[10px] font-medium text-gray-600">
          <span>Date</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Total Min</span>
          <span />
        </div>

        {/* Rows */}
        {attendanceRecords.map((record, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.2fr_1fr_1fr_1fr_20px] items-center border-b border-gray-100 px-2 py-3 last:border-b-0"
          >
            {/* Date */}
            <span className="text-[11px] font-medium text-gray-800">
              {record.date}
            </span>

            {/* Check In */}
            <span className="text-[11px] font-medium text-green-600">
              {record.checkIn}
            </span>

            {/* Check Out */}
            <span className="text-[11px] font-medium text-red-500">
              {record.checkOut}
            </span>

            {/* Total */}
            <div>
              <p className="text-[11px] font-medium text-gray-900">
                {record.totalMin} min
              </p>
              <p className="text-[9px] text-gray-500">({record.duration})</p>
            </div>

            {/* Actions */}
            <button className="text-gray-700 hover:text-gray-900">⋮</button>
          </div>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-between items-center w-full text-xs text-gray-600 px-3 py-3 bg-white border border-gray-200">
        <p>
          showing 10 out of 10 pages
        </p>
        {/* <p>showing 1-9 out of 128 entries</p> */}
        <div className="flex items-center gap-3">
          <button
            // onClick={handlePreviousPage}
            className="flex px-3 py-1 items-center justify-center rounded-xl border border-gray-300 text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ←
          </button>

          <div className="flex py-2 items-center justify-center rounded-xl bg-blue-100 px-4 text-sm font-semibold text-blue-700">
            1
          </div>

          <button
            // onClick={handleNextPage}
            className="flex px-3 py-1 items-center justify-center rounded-xl border border-gray-300 text-lg text-gray-600 transition hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceTable;
