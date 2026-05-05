export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          Monitor system performance and user activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: "1,234", trend: "+12%" },
          { label: "Total Books", value: "5,678", trend: "+5%" },
          { label: "Active Sessions", value: "89", trend: "+2%" },
          { label: "Reports", value: "12", trend: "-3%", urgent: true },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xs"
          >
            <p className="text-sm font-bold text-gray-500 dark:text-neutral-500 uppercase tracking-wider">
              {stat.label}
            </p>
            <div className="flex items-end justify-between mt-4">
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                {stat.value}
              </span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${stat.urgent ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
              >
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
