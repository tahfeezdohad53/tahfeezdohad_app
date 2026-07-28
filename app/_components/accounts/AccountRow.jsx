import { formatName } from "@/helpers";

export default function AccountRow({ user, index }) {
  const formattedName = formatName(user.name)
  return (
    <div className="grid grid-cols-[60px_2fr_1.2fr_1fr_1fr] items-center border-b border-gray-100 px-6 py-4 transition hover:bg-gray-50">
      <div className="text-sm text-gray-600">{index + 1}</div>

      <div className="font-medium text-gray-900">{formattedName}</div>

      <div className="text-gray-700">{user.its}</div>

      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            user.role === "Admin"
              ? "bg-violet-100 text-violet-700"
              : user.role === "Teacher"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {user.role}
        </span>
      </div>

      <div className="text-gray-700">{user.batch || "-"}</div>
    </div>
  );
}
