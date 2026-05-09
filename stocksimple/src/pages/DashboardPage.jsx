import { Link } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'
import { useAuth } from '../context/AuthContext'

const recentActivity = [
  { product: 'מיכל שמן זית 3% (1 ליטר)', type: 'ביצוע פחת', qty: '6-', time: 'לפני 12 דק\'' },
  { product: 'קופסת קרטון 1.5 ליטר (תפוז 30)', type: 'ביצוע פחת', qty: '2-', time: 'לפני שעה' },
  { product: 'כוס חד פעמי פלסטיק', type: 'קבלת מלאי', qty: '48+', time: 'לפני 3 שעות' },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />
      <main className="md:pr-[240px] min-h-screen pb-24 md:pb-0">
        <TopAppBar />

        {/* Hero */}
        <section className="bg-primary-container p-6 md:p-8 text-white">
          <div className="max-w-5xl mx-auto flex flex-col gap-1">
            <h1 className="text-2xl font-bold">שלום, {user.name} 👋</h1>
            <p className="text-base opacity-90">{user.business} - סניף מרכז</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm text-slate-500">פריטים במלאי</p>
                <h2 className="text-2xl font-bold text-primary-container">1,284</h2>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm text-slate-500">הזמנות פתוחות</p>
                <h2 className="text-2xl font-bold text-slate-600">12</h2>
              </div>
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm text-slate-500">ערך המלאי</p>
                <h2 className="text-2xl font-bold text-primary-container">₪42,500</h2>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-700">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
          </div>

          {/* Alerts + Quick Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Urgent Alerts */}
            <div className="lg:col-span-2 bg-red-50 text-red-900 rounded-xl p-6 border border-red-200 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">warning</span>
                <h3 className="text-lg font-bold text-red-600">מוצרים חסרים</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'מיכל שמן 3% (1 ליטר)', label: 'חסר לחלוטין' },
                  { name: 'כוסות חלמון L (תפוז 30)', label: '2 יח׳ נותרו' },
                  { name: 'כוס חד פעמי פלסטיק', label: 'חסר לחלוטין' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/40 p-3 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/waste"
                className="w-full h-12 bg-error text-on-error rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">delete_sweep</span>
                דיווח פחת עכשיו
              </Link>
            </div>

            {/* Orders Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2 text-slate-900">הזמנת ספקים</h3>
                <p className="text-sm text-slate-500">ישנן 3 תעודות הפצה שממתינות לאישורך לשליחה לספק.</p>
              </div>
              <div className="relative z-10 mt-8">
                <Link to="/orders" className="text-primary-container font-bold flex items-center gap-1 text-sm">
                  לצפייה בתעודות
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </Link>
              </div>
              <div className="absolute -bottom-4 -left-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">description</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">פעילות אחרונות</h3>
              <Link to="/inventory" className="text-xs text-primary-container hover:underline">הצג הכל</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">פריט</th>
                    <th className="p-4 font-medium">סוג פעולה</th>
                    <th className="p-4 font-medium">כמות</th>
                    <th className="p-4 font-medium">זמן</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {recentActivity.map((row, i) => (
                    <tr key={i}>
                      <td className="p-4 font-medium text-slate-900">{row.product}</td>
                      <td className="p-4">
                        <span className={row.qty.startsWith('+') ? 'text-blue-700' : 'text-red-600'}>
                          {row.type}
                        </span>
                      </td>
                      <td className="p-4">{row.qty}</td>
                      <td className="p-4 text-slate-400">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </main>
      <BottomNavBar />
    </div>
  )
}
