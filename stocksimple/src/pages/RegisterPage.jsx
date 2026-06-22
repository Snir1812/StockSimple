import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', businessName: '', email: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGoogleLogin = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://stock-simple-beige.vercel.app/dashboard' },
    })
    if (error) setError('שגיאה בהתחברות עם Google')
  }

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

            {/* Divider */}
            <div className="relative my-1">
              <div className="border-t border-slate-200" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400">
                או המשך עם
              </span>
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              className="w-full h-12 border border-slate-200 rounded-lg bg-white flex items-center justify-center gap-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              התחבר עם Google
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
