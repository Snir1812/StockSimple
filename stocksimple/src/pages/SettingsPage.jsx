import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

const NOTIF_KEY = 'ss_notifications'
const NOTIF_DEFAULTS = { lowStock: true, dailySummary: true, supplierAlerts: false }

const ROLE_BADGE = {
  admin:    'bg-blue-100 text-blue-700',
  employee: 'bg-green-100 text-green-700',
}
const ROLE_LABELS = { admin: 'מנהל', employee: 'עובד' }

function loadNotifState() {
  try { return { ...NOTIF_DEFAULTS, ...JSON.parse(localStorage.getItem(NOTIF_KEY)) } }
  catch { return NOTIF_DEFAULTS }
}

function StatusMsg({ msg }) {
  if (!msg.text) return null
  return (
    <div className={`mt-3 p-3 rounded-lg text-sm text-right ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {msg.text}
    </div>
  )
}

export default function SettingsPage() {
  const { session } = useAuth()
  const userId = session?.user?.id

  const [business, setBusiness] = useState({ name: '', address: '', vat_number: '' })
  const [businessId, setBusinessId] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loadingBusiness, setLoadingBusiness] = useState(true)
  const [savingBusiness, setSavingBusiness] = useState(false)
  const [businessMsg, setBusinessMsg] = useState({ type: '', text: '' })

  const [notifications, setNotifications] = useState(loadNotifState)

  useEffect(() => {
    if (!userId) return
    async function fetchData() {
      const { data, error } = await supabase
        .from('business')
        .select('id, name, address, vat_number')
        .eq('owner_id', userId)
        .single()

      if (error || !data) {
        setLoadingBusiness(false)
        return
      }

      setBusinessId(data.id)
      setBusiness({ name: data.name, address: data.address ?? '', vat_number: data.vat_number ?? '' })

      // Fetch employees for this business
      const { data: empData } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('business_id', data.id)

      if (empData) setEmployees(empData)
      setLoadingBusiness(false)
    }
    fetchData()
  }, [userId])

  const handleSaveBusiness = async () => {
    if (!business.name.trim()) {
      setBusinessMsg({ type: 'error', text: 'שם העסק הוא שדה חובה' })
      return
    }
    setSavingBusiness(true)
    setBusinessMsg({ type: '', text: '' })

    const { error } = await supabase
      .from('business')
      .update({ name: business.name.trim(), address: business.address.trim(), vat_number: business.vat_number.trim() })
      .eq('id', businessId)

    setSavingBusiness(false)
    setBusinessMsg(error
      ? { type: 'error',   text: `שגיאה בשמירה: ${error.message}` }
      : { type: 'success', text: 'פרטי העסק עודכנו בהצלחה!' }
    )
  }

  const toggleNotif = (key) => {
    setNotifications(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(NOTIF_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="bg-surface text-on-surface">
      <SideNavBar />
      <TopAppBar />

      <main className="min-h-screen pb-24 pt-8 px-4 md:pr-[264px] md:pl-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Page Header */}
          <section>
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
                { label: 'שם העסק', field: 'name',        type: 'text' },
                { label: 'ח.פ / עוסק מורשה', field: 'vat_number', type: 'text' },
                { label: 'כתובת', field: 'address',     type: 'text', colSpan: true },
              ].map(({ label, field, type, colSpan }) => (
                <div key={field} className={`space-y-2 ${colSpan ? 'md:col-span-2' : ''}`}>
                  <label className="text-xs text-slate-500 block">{label}</label>
                  {loadingBusiness ? (
                    <div className="h-11 bg-slate-100 rounded-lg animate-pulse" />
                  ) : (
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-right"
                      type={type}
                      value={business[field]}
                      onChange={e => setBusiness({ ...business, [field]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>

            <StatusMsg msg={businessMsg} />

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveBusiness}
                disabled={savingBusiness || loadingBusiness}
                className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingBusiness
                  ? <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  : 'שמור שינויים'}
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
                { key: 'lowStock',       title: 'התראת מלאי נמוך',       desc: 'קבל התראה כאשר פריט עומד להיגמר' },
                { key: 'dailySummary',   title: 'סיכום יומי אוטומטי',    desc: 'שלח סיכום יומי לפעולות בדואר אלקטרוני' },
                { key: 'supplierAlerts', title: 'התראות ספקים',          desc: 'עדכון על שינויים בסטטוס הזמנות' },
              ].map(({ key, title, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <button
                    onClick={() => toggleNotif(key)}
                    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[key] ? 'bg-blue-700' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[key] ? '-translate-x-[22px]' : '-translate-x-[2px]'}`} />
                  </button>
                  <div className="text-right mr-3">
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400 text-right">הגדרות ההתראות נשמרות מקומית בדפדפן.</p>
          </section>

          {/* Employee Management */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button className="text-blue-700 font-bold text-sm flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                הוסף עובד
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">ניהול עובדים</h2>
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
            </div>

            {loadingBusiness ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />)}
              </div>
            ) : employees.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">לא נמצאו עובדים</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <div key={emp.id} className="py-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_BADGE[emp.role] ?? ROLE_BADGE.employee}`}>
                      {ROLE_LABELS[emp.role] ?? emp.role}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium text-slate-900">{emp.full_name || '—'}</p>
                        <p className="text-xs text-slate-500">{emp.email || '—'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">
                        {emp.full_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      <Footer />
    </div>
  )
}
