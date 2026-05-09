import { useState } from 'react'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'

const employees = [
  { name: 'ישראל ישראלי', role: 'מנהל ראשי', status: 'פעיל' },
  { name: 'דנה כהן', role: 'סוכנת מכירות', status: 'פעיל' },
]

export default function SettingsPage() {
  const [form, setForm] = useState({
    businessName: 'מוסד נוצצת ישראל בע״מ',
    taxId: '512345678',
    email: 'office@cityware.co.il',
    phone: '03-6543210',
  })

  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailySummary: true,
    supplierAlerts: false,
  })

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const toggleNotif = (key) => setNotifications({ ...notifications, [key]: !notifications[key] })

  return (
    <div className="bg-surface text-on-surface">
      <SideNavBar />

      {/* Top App Bar */}
      <header className="sticky top-0 w-full h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-row-reverse justify-between items-center px-4 md:pr-[256px] z-40">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-blue-700">StockSimple</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 cursor-pointer">notifications</button>
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
            יש
          </div>
        </div>
      </header>

      <main className="min-h-screen pb-24 pt-8 px-4 md:pr-[264px] md:pl-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <section className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">הגדרות מערכת</h1>
            <p className="text-slate-500 mt-1">נהל את פרטי העסק, התראות וצוות העובדים שלך</p>
          </section>

          {/* Business Details */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined">store</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">פרטי עסק</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'שם העסק', name: 'businessName', type: 'text' },
                { label: 'ח.פ / עוסק מורשה', name: 'taxId', type: 'text' },
                { label: 'כתובת דואר אלקטרוני', name: 'email', type: 'email' },
                { label: 'מספר טלפון לצורך קשר', name: 'phone', type: 'tel' },
              ].map(({ label, name, type }) => (
                <div key={name} className="space-y-2">
                  <label className="text-xs text-slate-500 block">{label}</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-right"
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleFormChange}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 active:scale-95 transition-all">
                שמור שינויים
              </button>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">הגדרות התראות</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  key: 'lowStock',
                  title: 'התראת מלאי נמוך',
                  desc: 'קבל התראה כאשר פריט עומד להיגמר',
                },
                {
                  key: 'dailySummary',
                  title: 'סיכום יומי אוטומטי',
                  desc: 'שלח סיכום יומי לפעולות בדואר אלקטרוני',
                },
                {
                  key: 'supplierAlerts',
                  title: 'התראות ספקים',
                  desc: 'עדכון על שינויים בסטטוס הזמנות',
                },
              ].map(({ key, title, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(key)}
                    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-blue-700' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[key] ? 'translate-x-[-20px]' : 'translate-x-[-2px]'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Employee Management */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">ניהול עובדים</h2>
              </div>
              <button className="text-blue-700 font-bold text-sm flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                הוסף עובד
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {employees.map((emp, i) => (
                <div key={i} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-500">person</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{emp.status}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4 text-red-700">
              <span className="material-symbols-outlined">report</span>
              <h2 className="text-lg font-bold">אזור מסוכן</h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-red-600 max-w-[28rem] text-sm">
                מחיקת החשבון תסיר את כל הנתונים, כולל את פרטי העסק והצוות שלך. אין לבטל פעולה זו.
              </p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors whitespace-nowrap">
                מחק חשבון
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNavBar />

      <footer className="w-full py-12 border-t border-slate-100 bg-slate-50 mt-12 md:pr-[240px]">
        <div className="flex flex-col md:flex-row-reverse justify-between items-center px-6 max-w-7xl mx-auto gap-4 text-sm">
          <div className="text-lg font-bold text-slate-800">StockSimple</div>
          <p className="text-slate-500">© 2024 StockSimple - ניהול מלאי חכם</p>
        </div>
      </footer>
    </div>
  )
}
