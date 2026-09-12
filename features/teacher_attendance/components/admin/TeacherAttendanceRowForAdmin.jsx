function TeacherAttendanceRowForAdmin({el}) {
    return (
      <div
        key={index}
        className="grid min-w-[650px] grid-cols-[1.3fr_1fr_1fr_1fr_0.8fr_100px] items-center border-b border-gray-100 px-2 py-3 last:border-b-0"
      >
        {/* Teacher */}
        <span className="text-[11px] font-medium text-gray-800">
          {el.teacher}
        </span>

        {/* Date */}
        <span className="text-[11px] text-gray-700">{el.date}</span>

        {/* Check In */}
        <span className="text-[11px] font-medium text-green-600">
          {el.checkIn}
        </span>

        {/* Check Out */}
        <span className="text-[11px] font-medium text-red-500">
          {el.checkOut || "--"}
        </span>

        {/* Total */}
        <div>
          <p className="text-[11px] font-medium text-gray-900">
            {el.totalMin} min
          </p>
          <p className="text-[9px] text-gray-500">({el.duration})</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Verify */}
          {!el.verified && (
            <button className="rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 hover:bg-green-100">
              Verify
            </button>
          )}

          {/* Admin Check Out */}
          {!el.checkOut && (
            <button className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100">
              Check Out
            </button>
          )}

          {/* More */}
          <button className="px-1 text-lg leading-none text-gray-600 hover:text-gray-900">
            ⋮
          </button>
        </div>
      </div>
    );
}

export default TeacherAttendanceRowForAdmin;
