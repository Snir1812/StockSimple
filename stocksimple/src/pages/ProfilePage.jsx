import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-blue-100 overflow-hidden flex items-center justify-center bg-blue-50">
                    <span className="text-4xl font-black text-blue-700">{user.initials}</span>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-700 text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                <p className="text-sm text-slate-500">מנהל ראשי</p>
                <div className="mt-4 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  חשבון פעיל
                </div>
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
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none text-right"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">אימייל</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none text-right"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">שם העסק (קריאה בלבד)</label>
                    <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 flex items-center justify-between">
                      <span>{user.business}</span>
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security */}
              <section className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6 text-blue-700">
                  <span className="material-symbols-outlined">security</span>
                  <h3 className="text-lg font-bold">שינוי סיסמה</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">סיסמה נוכחית</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none text-right"
                      name="currentPassword"
                      placeholder="••••••••"
                      type="password"
                      value={form.currentPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">סיסמה חדשה</label>
                    <input
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none text-right"
                      name="newPassword"
                      placeholder="••••••••"
                      type="password"
                      value={form.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400 italic">הסיסמה חייבת להכיל לפחות 8 תווים, כולל מספרים.</p>
              </section>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button className="flex-1 h-12 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-sm active:scale-95">
                  שמור שינויים
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 h-12 bg-white border-2 border-red-600 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">logout</span>
                  התנתק
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />

      <Footer />
    </div>
  )
}
