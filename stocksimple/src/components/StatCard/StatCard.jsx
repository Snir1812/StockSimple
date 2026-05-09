export default function StatCard({ label, value, icon, iconBg = 'bg-blue-50', iconColor = 'text-blue-700' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <h2 className="text-2xl font-bold text-blue-700 mt-1">{value}</h2>
      </div>
      <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  )
}
