"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { FiMic, FiClock } from "react-icons/fi";

const data = [
  { label: "Aug 22", duration: 42 },
  { label: "Aug 23", duration: 55 },
  { label: "Aug 24", duration: 38 },
  { label: "Aug 25", duration: 72 },
  { label: "Aug 26", duration: 61 },
  { label: "Aug 27", duration: 84 },
  { label: "Aug 28", duration: 67 },
  { label: "Aug 29", duration: 91 },
  { label: "Aug 30", duration: 76 },
  { label: "Aug 31", duration: 105 },
  { label: "Sep 1", duration: 88 },
  { label: "Sep 2", duration: 112 },
  { label: "Sep 3", duration: 96 },
  { label: "Sep 4", duration: 124 },
  { label: "Sep 5", duration: 108 },
];

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

const totalDuration = data.reduce((total, item) => total + item.duration, 0);

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-(--border) bg-(--card) px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-(--muted-foreground)">{label}</p>

      <div className="flex items-center gap-2">
        <FiClock className="text-(--primary)" />

        <span className="text-sm font-semibold text-(--foreground)">
          {formatDuration(payload[0].value)}
        </span>
      </div>
    </div>
  );
}

export default function RecordingActivityChart() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-(--border) bg-(--card) p-4 sm:p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10">
            <FiMic className="text-base text-(--primary)" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-(--foreground) sm:text-base">
              Recording Activity
            </h2>

            <p className="truncate text-[11px] text-(--muted-foreground) sm:text-xs">
              Last 15 days
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] text-(--muted-foreground) sm:text-xs">
            Total
          </p>

          <p className="text-sm font-semibold text-(--foreground) sm:text-lg">
            {formatDuration(totalDuration)}
          </p>
        </div>
      </div>

      {/* Horizontal scroll area */}
      <div className="w-full overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin">
        <div className="h-[240px] min-w-[650px] sm:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 15,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
                interval={0}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={40}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
                tickFormatter={(value) => `${value}m`}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "var(--border)",
                  strokeDasharray: "4 4",
                }}
              />

              <Line
                type="monotone"
                dataKey="duration"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
