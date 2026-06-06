import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', businessName: '', email: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (form.password !== form.passwordConfirm) {
      setError('הסיסמאות אינן תואמות')
      return
    }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          businessName: form.businessName,
        },
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-blue-700 tracking-tight mb-1">StockSimple</h1>
          <p className="text-base text-slate-500">ניהול מלאי לעסקים קטנים</p>
        </div>

        {/* Register Card */}
        <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 text-center bg-slate-50/30">
            <p className="text-slate-500">צור חשבון ותתחיל לנהל את המלאי שלך מיידית</p>
          </div>

          <div className="px-6 pb-6 pt-4 space-y-4">

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 block" htmlFor="fullName">שם מלא</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute right-3 text-slate-400 text-[20px]">person</span>
                <input
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-lg bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all"
                  id="fullName"
                  name="fullName"
                  placeholder="ישראל ישראלי"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 block" htmlFor="businessName">שם העסק</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute right-3 text-slate-400 text-[20px]">storefront</span>
                <input
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-lg bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all"
                  id="businessName"
                  name="businessName"
                  placeholder="העסק שלי בע״מ"
                  type="text"
                  value={form.businessName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 block" htmlFor="email">אימייל</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute right-3 text-slate-400 text-[20px]">mail</span>
                <input
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-lg bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all"
                  dir="ltr"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 block" htmlFor="password">סיסמה</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute right-3 text-slate-400 text-[20px]">lock</span>
                <input
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-lg bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all"
                  dir="ltr"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 block" htmlFor="passwordConfirm">אישור סיסמה</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute right-3 text-slate-400 text-[20px]">lock_reset</span>
                <input
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-lg bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all"
                  dir="ltr"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  placeholder="••••••••"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-500 text-center px-4">
              בלחיצה על הכפתור, אני מסכים ל
              <button className="text-blue-700 hover:underline mx-1">תנאי השימוש</button>
              ול
              <button className="text-blue-700 hover:underline mx-1">מדיניות הפרטיות</button>
              שלנו.
            </p>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-blue-700 text-white font-bold rounded-lg shadow-md active:scale-95 transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              ) : (
                'צור חשבון'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-sm text-slate-500">
                כבר יש לך חשבון?{' '}
                <Link to="/login" className="text-blue-700 font-bold hover:underline">
                  התחבר כאן
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative footer */}
          <div className="h-24 w-full relative overflow-hidden bg-slate-50 border-t border-slate-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-200 text-[80px]">warehouse</span>
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-8 w-full hidden md:flex justify-center">
        <p className="text-xs text-slate-400">© 2024 StockSimple - ניהול מלאי חכם</p>
      </footer>
    </div>
  )
}
