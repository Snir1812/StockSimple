import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = () => {
    login()
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
              className="w-full h-12 bg-blue-700 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 hover:bg-blue-800"
            >
              <span>התחבר</span>
              <span className="material-symbols-outlined text-[20px]">login</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="border-t border-slate-200" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400">
                או המשך עם
              </span>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="h-12 border border-slate-200 rounded-xl bg-white flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="font-black text-blue-700">G</span>
                Google
              </button>
              <button className="h-12 border border-slate-200 rounded-xl bg-white flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[20px] text-blue-700">corporate_fare</span>
                SSO ארגוני
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
