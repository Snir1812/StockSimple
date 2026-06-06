import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

const ROLE_LABELS = { admin: 'מנהל ראשי', employee: 'עובד' }
const ROLE_BADGE  = { admin: 'bg-blue-100 text-blue-700', employee: 'bg-green-100 text-green-700' }

function StatusMsg({ msg }) {
  if (!msg.text) return null
  return (
    <div className={`mt-3 p-3 rounded-lg text-sm text-right ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {msg.text}
    </div>
  )
}

export default function ProfilePage() {
  const { user, session, logout } = useAuth()
  const navigate = useNavigate()
  const userId = session?.user?.id

  const [profile, setProfile] = useState({ full_name: '', email: '', role: '' })
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [newPassword, setNewPassword]       = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savingProfile,  setSavingProfile]  = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg,  setProfileMsg]  = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!userId) return
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, role')
        .eq('user_id', userId)
        .single()
      if (!error && data) setProfile(data)
      setLoadingProfile(false)
    }
    fetchProfile()
  }, [userId])

  const handleSaveProfile = async () => {
    if (!profile.full_name.trim()) {
      setProfileMsg({ type: 'error', text: 'שם מלא הוא שדה חובה' })
      return
    }
    setSavingProfile(true)
    setProfileMsg({ type: '', text: '' })

    const [profileRes, metaRes] = await Promise.all([
      supabase.from('profiles').update({ full_name: profile.full_name.trim() }).eq('user_id', userId),
      supabase.auth.updateUser({ data: { full_name: profile.full_name.trim() } }),
    ])

    setSavingProfile(false)
    if (profileRes.error || metaRes.error) {
      setProfileMsg({ type: 'error', text: `שגיאה בשמירה: ${(profileRes.error ?? metaRes.error).message}` })
    } else {
      setProfileMsg({ type: 'success', text: 'הפרטים עודכנו בהצלחה!' })
    }
  }

  const handleSavePassword = async () => {
    setPasswordMsg({ type: '', text: '' })
    if (!newPassword) {
      setPasswordMsg({ type: 'error', text: 'יש להזין סיסמה חדשה' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'הסיסמה חייבת להכיל לפחות 6 תווים' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'הסיסמאות אינן תואמות' })
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) {
      setPasswordMsg({ type: 'error', text: `שגיאה בשינוי הסיסמה: ${error.message}` })
    } else {
      setPasswordMsg({ type: 'success', text: 'הסיסמה שונתה בהצלחה!' })
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = user?.initials ?? '?'
  const displayName = profile.full_name || user?.name || '—'

  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />
      <TopAppBar />

      <main className="md:pr-[240px] pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">פרופיל משתמש</h2>
            <p className="text-slate-500">נהל את פרטי המשתמש והגדרות החשבון שלך</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-blue-100 flex items-center justify-center bg-blue-50">
                    <span className="text-4xl font-black text-blue-700">{initials}</span>
                  </div>
                </div>
                {loadingProfile ? (
                  <div className="space-y-2 w-full">
                    <div className="h-5 bg-slate-100 rounded animate-pulse mx-auto w-32" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse mx-auto w-20" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-slate-900">{displayName}</h3>
                    <p className="text-sm text-slate-500 mt-1">{profile.email}</p>
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${ROLE_BADGE[profile.role] ?? ROLE_BADGE.employee}`}>
                      {ROLE_LABELS[profile.role] ?? profile.role}
                    </div>
                    <div className="mt-3 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      חשבון פעיל
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic Info */}
              <section className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6 text-blue-700">
                  <span className="material-symbols-outlined">contact_page</span>
                  <h3 className="text-lg font-bold">פרטים אישיים</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">שם מלא</label>
                    {loadingProfile ? (
                      <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                    ) : (
                      <input
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none text-right"
                        type="text"
                        value={profile.full_name}
                        onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      אימייל <span className="text-slate-400">(קריאה בלבד)</span>
                    </label>
                    <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 flex items-center justify-between">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>
                      <span dir="ltr">{profile.email || session?.user?.email || '—'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">שם העסק (קריאה בלבד)</label>
                    <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 flex items-center justify-between">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>
                      <span>{user?.business || '—'}</span>
                    </div>
                  </div>
                </div>
                <StatusMsg msg={profileMsg} />
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile || loadingProfile}
                  className="mt-5 w-full h-11 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingProfile
                    ? <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                    : 'שמור שינויים'}
                </button>
              </section>

              {/* Password */}
              <section className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6 text-blue-700">
                  <span className="material-symbols-outlined">security</span>
                  <h3 className="text-lg font-bold">שינוי סיסמה</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">סיסמה חדשה</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none"
                      placeholder="••••••••"
                      type="password"
                      dir="ltr"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">אישור סיסמה חדשה</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none"
                      placeholder="••••••••"
                      type="password"
                      dir="ltr"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">הסיסמה חייבת להכיל לפחות 6 תווים.</p>
                <StatusMsg msg={passwordMsg} />
                <button
                  onClick={handleSavePassword}
                  disabled={savingPassword}
                  className="mt-5 w-full h-11 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingPassword
                    ? <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                    : 'עדכן סיסמה'}
                </button>
              </section>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full h-12 bg-white border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                התנתק מהמערכת
              </button>

            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />
      <Footer />
    </div>
  )
}
