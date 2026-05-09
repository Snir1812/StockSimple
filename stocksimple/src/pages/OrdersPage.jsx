import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

const suppliers = [
  {
    id: 1,
    name: 'אמיגוס קפה בע״מ',
    phone: '052-4455889',
    active: true,
    shortages: 4,
    items: ['פולי קפה ערביקה (10 ק״ג)', 'כוס שוקולד שוויצרי (24 יח׳)', 'כוסיות נייר L (500 יח׳)', 'סוכר לבן שקיקים'],
  },
  {
    id: 2,
    name: 'מופלאות השלמה',
    phone: '03-9988776',
    active: true,
    shortages: 2,
    items: ['קרמיקות ורוד (50 יח׳)', 'כוס ממוחזת אפרם (20 יח׳)'],
  },
  {
    id: 3,
    name: 'פיסיוק השיר',
    phone: '054-1234567',
    active: false,
    shortages: 0,
    items: [],
  },
]

export default function OrdersPage() {
  return (
    <div className="bg-background text-on-background">
      <SideNavBar />

      <TopAppBar />

      <main className="md:pr-[240px] pb-32 pt-6 px-4 max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900">ניהול הזמנות</h1>
            <p className="text-sm text-slate-500">מעקב אחרי חוסרים והזמנות רשומות לפי ספקים</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-initial h-12 px-6 bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add</span>
              <span>ספק חדש</span>
            </button>
            <button className="flex-1 md:flex-initial h-12 px-6 border border-blue-700 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">filter_list</span>
              <span>סנן</span>
            </button>
          </div>
        </div>

        {/* Supplier Cards */}
        <div className="grid grid-cols-1 gap-4">
          {suppliers.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row-reverse gap-4 hover:border-blue-300 transition-all shadow-sm ${!s.active ? 'opacity-70' : ''}`}
            >
              <div className="flex-1 flex flex-col md:flex-row-reverse gap-6">
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-blue-700">{s.name}</h3>
                    {s.active ? (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        פעיל
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">cancel</span>
                        לא בשימוש
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span className="text-xs">{s.phone}</span>
                  </div>
                  {s.shortages > 0 && (
                    <div className="mt-2 flex gap-2">
                      <div className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        {s.shortages} פריטים חסרים
                      </div>
                    </div>
                  )}
                  {s.shortages === 0 && (
                    <div className="mt-2 flex gap-2">
                      <div className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        אין חוסרים
                      </div>
                    </div>
                  )}
                </div>

                {s.items.length > 0 && (
                  <div className="flex-1 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-bold mb-2 border-b border-slate-100 pb-2">רשימת חוסרים:</p>
                    <ul className="text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      {s.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-1">{i > 0 && '•'} {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.items.length === 0 && (
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 italic text-slate-400">
                    <p className="text-sm">אין פריטים חסרים לספק זה כרגע.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end md:w-[160px]">
                <button
                  disabled={!s.active}
                  className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${s.active ? 'bg-green-500 text-white hover:opacity-90' : 'bg-slate-300 text-white cursor-not-allowed'}`}
                >
                  <span className="material-symbols-outlined">send</span>
                  <span>שלח הזמן</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavBar />

      <Footer />
    </div>
  )
}
