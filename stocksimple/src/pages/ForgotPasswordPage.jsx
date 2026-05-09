import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => setSent(true)

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-[480px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Brand Header */}
        <div className="p-6 text-center bg-slate-50/30">
          <h1 className="text-2xl font-black text-blue-700 tracking-tight mb-1">StockSimple</h1>
          <p className="text-base text-slate-500">צור חשבון ותתחיל לנהל את המלאי שלך מיידית</p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 pt-4">
          {!sent ? (
            <div id="reset-form-container">
              <div className="flex items-center gap-2 mb-6">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-500">arrow_forward</span>
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">שכחת סיסמה</h2>
              </div>

              <p className="text-slate-500 mb-6 leading-relaxed">
                לא נורא, זה קורה לכולם. הכנס את כתובת האימייל שלך ונשלח קישור לאיפוס הסיסמה.
              </p>

              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-900" htmlFor="email">כתובת אימייל</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 px-4 pr-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all placeholder:text-slate-400 text-right"
                      id="email"
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition-all active:scale-[0.98]"
                >
                  שלח קישור לאיפוס
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-xs text-blue-700 hover:underline">
                    חזרה להתחברות
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">הקישור נשלח בהצלחה!</h2>
              <p className="text-slate-500 mb-6">
                שלחנו הוראות לאיפוס הסיסמה לכתובת האימייל שלך. אנא בדוק את תיבת הדואר שלך ופעל לפי ההוראות המופיעות במייל.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-green-200 text-right mb-6">
                <p className="text-xs text-green-800">
                  <strong>שים לב:</strong> הקישור תקף ל-30 דקות בלבד מרגע שליחתו.
                </p>
              </div>
              <Link
                to="/login"
                className="block w-full h-12 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-all leading-[48px] text-center"
              >
                חזרה להתחברות
              </Link>
            </div>
          )}
        </div>

        {/* Illustration */}
        <div className="mt-4 hidden md:flex justify-center pb-6">
          <div className="w-64 h-32 bg-slate-100 rounded-xl flex items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-slate-400 text-[80px]">lock</span>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-8 w-full hidden md:flex justify-center">
        <p className="text-xs text-slate-400">© 2024 StockSimple - ניהול מלאי חכם</p>
      </footer>
    </div>
  )
}
