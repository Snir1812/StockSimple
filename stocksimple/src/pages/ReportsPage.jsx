import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

const summaryCards = [
  { label: 'סה״כ פחת', value: '₪14,250', trend: '+8.2% לעומת חודש שעבר', trendColor: 'text-red-600', trendIcon: 'trending_up' },
  { label: 'פריטים חסרים', value: '24', trend: '3 קטגוריות נפגעו', trendColor: 'text-orange-600', trendIcon: 'warning' },
  { label: 'יעילות מלאי', value: '94.8%', trend: '2.1%+ שיפור', trendColor: 'text-green-600', trendIcon: 'trending_up' },
  { label: 'זמן ממוצע למחזור', value: '12 ימים', trend: 'ממוצע שנתי', trendColor: 'text-slate-500', trendIcon: 'schedule' },
]

const reports = [
  { name: 'סיכום מלאי חודשי - מאי', date: '31/05/2024', format: 'הערות והמלצות', status: 'הושלם' },
  { name: 'דוח פחת שבועי', date: '24/05/2024', format: 'גרף', status: 'הושלם' },
  { name: 'ניתוח ביצועי ספקים Q2', date: '15/05/2024', format: 'הערות והמלצות', status: 'מעובד...' },
]

const barData = [
  { label: 'פירות', h: 70 },
  { label: 'ירקות', h: 40 },
  { label: 'מוצרי חלב', h: 90 },
  { label: 'שימורים', h: 25 },
  { label: 'אחר', h: 55 },
  { label: 'קפאים', h: 35 },
]

export default function ReportsPage() {
  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />

      <TopAppBar />

      <main className="md:pr-[240px] pb-24 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Date Selector Tabs */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          <div className="flex bg-slate-100 rounded-xl p-1 shrink-0">
            {['שנה', 'רבעון', 'חודש', 'שבוע', 'יום'].map((t, i) => (
              <button
                key={t}
                className={`px-6 py-2 rounded-lg text-sm transition-all ${i === 2 ? 'bg-white shadow-sm text-blue-700 font-bold' : 'text-slate-500 hover:text-blue-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center text-slate-500 text-xs">
            <span className="material-symbols-outlined text-sm ml-1">calendar_today</span>
            <span>1 מאי 2024 - 31 מאי 2024</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm border border-slate-200 p-4 rounded-xl flex flex-col">
              <span className="text-sm text-slate-500">{card.label}</span>
              <span className="text-2xl font-bold mt-1 text-slate-900">{card.value}</span>
              <div className={`flex items-center mt-2 text-xs ${card.trendColor}`}>
                <span className="material-symbols-outlined text-sm">{ card.trendIcon}</span>
                <span className="mr-1">{card.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts + Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">פחת לפי קטגוריות</h2>
              <button className="material-symbols-outlined text-slate-500">more_vert</button>
            </div>
            <div className="flex-grow flex items-end justify-between px-4 pb-8 relative gap-4">
              {barData.map(({ label, h }, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-blue-100 rounded-t-lg relative group h-48">
                    <div
                      className="absolute bottom-0 w-full bg-blue-700 rounded-t-lg transition-all group-hover:opacity-80"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-slate-400 pr-2">
                <span>10k</span><span>7.5k</span><span>5k</span><span>2.5k</span><span>0</span>
              </div>
            </div>
          </div>

          {/* Insight Card */}
          <div className="lg:col-span-1 rounded-xl overflow-hidden relative group bg-blue-700 flex flex-col justify-end p-6">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="material-symbols-outlined text-white text-[200px]">analytics</span>
            </div>
            <div className="relative z-10">
              <span className="text-white/70 text-xs">תובנה שבועית</span>
              <h3 className="text-white text-lg font-bold mt-2">
                שיפור של 12% בדיוק מעת פחת מתוצרי חלב שנמדד בדוח החודשי האחרון
              </h3>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
            <h2 className="text-lg font-bold text-slate-900">דוחות אחרונות</h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-sm">search</span>
              <input
                className="pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-700 outline-none"
                placeholder="חפש דוח..."
                type="text"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs">שם הדוח</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs">תאריך הפקה</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs">נוצר ע״י</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs">סטטוס</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{r.date}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{r.format}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'הושלם' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button className="material-symbols-outlined text-blue-600 hover:text-blue-800 text-[20px]">visibility</button>
                      <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 text-[20px]">download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <BottomNavBar />

      <Footer />
    </div>
  )
}
