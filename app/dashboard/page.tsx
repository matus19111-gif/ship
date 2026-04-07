import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// Type definitions for metrics
interface Metrics {
  mrr: number;
  mrrChange: number;
  activeUsers: number;
  usersChange: number;
  conversions: number;
  conversionsChange: number;
  churnRate: number;
  churnChange: number;
}

interface Activity {
  user: string;
  action: string;
  time: string;
}

export default async function Dashboard() {
  // Simulated data (replace with your real data fetch)
  const metrics: Metrics = {
    mrr: 12480,
    mrrChange: 12.3,
    activeUsers: 1842,
    usersChange: 8.7,
    conversions: 143,
    conversionsChange: -2.1,
    churnRate: 2.4,
    churnChange: -0.3,
  };

  const recentActivity: Activity[] = [
    { user: "alex@saas.com", action: "Upgraded to Pro", time: "2 min ago" },
    { user: "jordan@startup.io", action: "New subscription", time: "1 hour ago" },
    { user: "taylor@agency.co", action: "Cancelled trial", time: "3 hours ago" },
    { user: "casey@dev.com", action: "Added payment method", time: "5 hours ago" },
    { user: "riley@design.studio", action: "Generated invoice", time: "yesterday" },
  ];

  const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueData: number[] = [42, 58, 62, 71, 84, 94];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-800">
              dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              key metrics & activity · minimalist view
            </p>
          </div>
          <ButtonAccount />
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* MRR Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              <span>💰</span> MRR
            </div>
            <div className="text-2xl font-semibold text-slate-800">
              ${metrics.mrr.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className={metrics.mrrChange >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                {metrics.mrrChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.mrrChange)}%
              </span>
              <span className="text-slate-400 text-xs">vs last month</span>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              <span>👥</span> Active users
            </div>
            <div className="text-2xl font-semibold text-slate-800">
              {metrics.activeUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-emerald-600">↑ {metrics.usersChange}%</span>
              <span className="text-slate-400 text-xs">vs last month</span>
            </div>
          </div>

          {/* Conversions Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              <span>📈</span> Conversions
            </div>
            <div className="text-2xl font-semibold text-slate-800">
              {metrics.conversions}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className={metrics.conversionsChange >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                {metrics.conversionsChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.conversionsChange)}%
              </span>
              <span className="text-slate-400 text-xs">vs last month</span>
            </div>
          </div>

          {/* Churn Rate Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              <span>⚠️</span> Churn rate
            </div>
            <div className="text-2xl font-semibold text-slate-800">
              {metrics.churnRate}%
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-emerald-600">↓ {Math.abs(metrics.churnChange)}%</span>
              <span className="text-slate-400 text-xs">improvement</span>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend - Minimal bar chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="mb-4">
              <h3 className="text-base font-medium text-slate-700">revenue trend</h3>
              <p className="text-xs text-slate-400">last 6 months · minimalist view</p>
            </div>
            <div className="h-64 w-full flex items-end gap-3 pt-4">
              {revenueData.map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-indigo-100 rounded-lg transition-all duration-300 hover:bg-indigo-200" 
                    style={{ height: `${height * 2}px` }}
                  />
                  <span className="text-[11px] text-slate-400 font-mono">
                    {months[index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
              <span>📈 +18.3% growth · projected $14.2k MRR next quarter</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-medium text-slate-700 flex items-center gap-2">
                <span>⚡</span> recent activity
              </h3>
              <p className="text-xs text-slate-400 mt-1">live user events</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 px-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">{activity.user}</span>
                    <span className="text-xs text-slate-500">{activity.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{activity.time}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
              <span>⚡ syncs in real-time</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-[11px] text-slate-400 border-t border-slate-100">
          <span>private dashboard · secure session</span>
        </div>
      </div>
    </main>
  );
          }
