import { Clock, Sparkles, TestTube2, Download } from "lucide-react";

type ActivityEvent = {
  id: string;
  type: "generated" | "ab_test" | "exported";
  label: string;
  meta: string;
  timestamp: string;
};

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "1",
    type: "generated",
    label: "Summer Sale – Facebook Ad",
    meta: "4 variants generated",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "ab_test",
    label: "Product Launch – Google Search",
    meta: "A/B test started · Variant B winning",
    timestamp: "1 hr ago",
  },
  {
    id: "3",
    type: "exported",
    label: "Black Friday – Instagram Story",
    meta: "Exported to CSV",
    timestamp: "3 hrs ago",
  },
  {
    id: "4",
    type: "generated",
    label: "Email Subject Line – Newsletter",
    meta: "6 variants generated",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    type: "ab_test",
    label: "Retargeting – Meta Carousel",
    meta: "A/B test completed · Variant A won",
    timestamp: "Yesterday",
  },
];

const iconMap = {
  generated: <Sparkles className="w-4 h-4 text-amber-400" />,
  ab_test: <TestTube2 className="w-4 h-4 text-sky-400" />,
  exported: <Download className="w-4 h-4 text-emerald-400" />,
};

const badgeMap = {
  generated: "bg-amber-400/10 text-amber-400",
  ab_test: "bg-sky-400/10 text-sky-400",
  exported: "bg-emerald-400/10 text-emerald-400",
};

const labelMap = {
  generated: "Generated",
  ab_test: "A/B Test",
  exported: "Exported",
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <Clock className="w-4 h-4 text-zinc-400" />
        <h2 className="text-sm font-medium text-zinc-200">Recent Activity</h2>
      </div>

      <ul className="divide-y divide-zinc-800">
        {MOCK_ACTIVITY.map((event) => (
          <li
            key={event.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              {iconMap[event.type]}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">
                {event.label}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{event.meta}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeMap[event.type]}`}
              >
                {labelMap[event.type]}
              </span>
              <span className="text-xs text-zinc-500 w-16 text-right">
                {event.timestamp}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
            }
