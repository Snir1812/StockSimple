import { Link } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 w-full h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-row-reverse justify-between items-center px-4 md:px-8 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-blue-700">StockSimple</span>
          <span className="material-symbols-outlined text-blue-700">inventory_2</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-medium text-blue-700 hover:opacity-80 transition-all">
            כבר יש לי חשבון
          </Link>
          <Link
            to="/register"
            className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all"
          >
            התחל בחינם
          </Link>
        </div>
      </header>

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-700 shadow-xl">
              <span className="material-symbols-outlined text-white text-5xl">inventory_2</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] leading-tight font-black text-slate-900 mb-4 tracking-tight">
              StockSimple
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mb-12">
              ניהול מלאי פשוט לעסקים קטנים
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="bg-blue-700 text-white h-12 px-10 rounded-xl font-bold flex items-center justify-center shadow-lg active:scale-98 transition-all"
              >
                התחל בחינם
              </Link>
              <button className="bg-transparent border border-blue-700 text-blue-700 h-12 px-10 rounded-xl font-bold flex items-center justify-center hover:bg-blue-50 active:scale-98 transition-all">
                צפה בסרטון
              </button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="mt-20 w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-blue-200 text-[120px]">inventory_2</span>
                <p className="text-slate-400 font-medium mt-2">מערכת ניהול מלאי מתקדמת</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row-reverse items-center gap-8 hover:shadow-md transition-all duration-300">
                <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-700 text-6xl">barcode_scanner</span>
                </div>
                <div className="w-full md:w-2/3 text-right">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">סריקה מהירה ומדויקת</h3>
                  <p className="text-slate-500">עדכן את המלאי שלך בסריקה אחת בלבד. עובד עם כל סורק ברקוד מקצועי ועם המצלמה שלך.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row-reverse items-center gap-8 hover:shadow-md transition-all duration-300">
                <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-700 text-6xl">notifications_active</span>
                </div>
                <div className="w-full md:w-2/3 text-right">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">התראות על מלאי נמוך</h3>
                  <p className="text-slate-500">לא תתפס יותר בלי מלאי. קבל התראות אוטומטיות כשמוצרים שלך עומדים להיגמר.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row-reverse items-center gap-8 hover:shadow-md transition-all duration-300">
                <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-700 text-6xl">analytics</span>
                </div>
                <div className="w-full md:w-2/3 text-right">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">דוחות וניתוח נתונים</h3>
                  <p className="text-slate-500">עקוב אחרי מגמות המלאי שלך עם גרפים פשוטים ודוחות שעוזרים לך לקבל החלטות נכונות.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto bg-blue-700 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <h2 className="text-white text-3xl font-bold mb-6 relative z-10">
              מוכן להתחיל לנהל את המלאי שלך?
            </h2>
            <div className="flex flex-col items-center gap-4 relative z-10">
              <Link
                to="/register"
                className="bg-white text-blue-700 h-12 px-12 rounded-xl font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                צור חשבון עכשיו בחינם
              </Link>
              <p className="text-white/80 text-sm">ללא דרישת כרטיס אשראי • 14 ימי ניסיון בחינם</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-24 left-6 z-50">
        <Link
          to="/register"
          className="w-14 h-14 bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      </div>
    </div>
  )
}
