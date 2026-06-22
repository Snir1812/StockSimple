import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://stock-simple-beige.vercel.app/dashboard' },
    })
    if (error) setError('שגיאה בהתחברות עם Google')
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('כתובת האימייל או הסיסמה שגויים')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex">

      {/* Blue sidebar — first child = rightmost in RTL flex */}
      <div className="hidden lg:flex w-[38%] flex-shrink-0 bg-blue-700 flex-col items-center justify-center px-10 py-12 text-white text-center">
        <span className="material-symbols-outlined text-[96px] opacity-[0.85] mb-6">inventory_2</span>
        <h3 className="text-[28px] font-black mb-4">ניהול מלאי חכם</h3>
        <p className="text-base leading-relaxed opacity-90 max-w-[280px]">
          עקוב אחרי רשרת האספקה שלך בזמן אמת ומנע חוסרים שיפגעו בעסק שלך.
        </p>
        <div className="mt-10 w-full h-[180px] rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[72px] opacity-30">warehouse</span>
        </div>
      </div>

      {/* Form area — second child = leftmost in RTL flex */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-8">
        <div className="w-full max-w-[420px]">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-black text-blue-700 mb-1.5">StockSimple</div>
            <div className="text-sm text-slate-500">מערכת ניהול מלאי לעסקים קטנים</div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-center text-slate-900 mb-6">התחברות למערכת</h2>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-xs text-slate-500 font-medium mb-1.5">
                כתובת אימייל
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                <input
                  dir="ltr"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-xl bg-slate-50 text-[15px] outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="text-xs text-slate-500 font-medium">סיסמה</label>
                <Link to="/forgot-password" className="text-xs text-blue-700 no-underline hover:underline">
                  שכחת סיסמה?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                <input
                  dir="ltr"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full h-12 pr-10 pl-4 border border-slate-200 rounded-xl bg-slate-50 text-[15px] outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 mb-5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-blue-700"
              />
              <label htmlFor="remember" className="text-[13px] text-slate-500">זכור אותי בדפדפן זה</label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-blue-700 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>התחבר</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="border-t border-slate-200" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400">
                או המשך עם
              </span>
            </div>

            {/* Social buttons */}
            <div className="mb-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full h-12 border border-slate-200 rounded-xl bg-white flex items-center justify-center gap-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                התחבר עם Google
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500">
              אין לך חשבון?{' '}
              <Link to="/register" className="text-blue-700 font-bold no-underline hover:underline">
                הירשם עכשיו
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2024 StockSimple. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </div>
  )
}
