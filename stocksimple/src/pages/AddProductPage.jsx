import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

export default function AddProductPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    barcode: '',
    category: '',
    qty: 0,
    minQty: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleQty = (delta) => setForm({ ...form, qty: Math.max(0, form.qty + delta) })

  const handleSubmit = () => navigate('/inventory')

  return (
    <div className="bg-surface text-on-surface">
      <SideNavBar />

      <TopAppBar />

      <main className="md:pr-[240px] pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-slate-500 text-xs">
            <Link to="/inventory" className="hover:text-blue-700 transition-colors">ניהול מלאי</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span className="text-blue-700 font-medium">הוספת מוצר חדש</span>
          </div>

          {/* Page Header */}
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">מוצר קיים</h2>
            <p className="text-slate-500">מלא את פרטי המוצר החדש ולחץ שמור להוספתו למערכת.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <section className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">פרטי מוצר בסיסיים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">שם מוצר</label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none"
                    name="name"
                    placeholder="לדוגמה: נייר צילום A4"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">ברקוד</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 px-4 pl-12 rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none"
                      name="barcode"
                      placeholder="סרוק או הקלד ברקוד"
                      type="text"
                      value={form.barcode}
                      onChange={handleChange}
                    />
                    <button className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-blue-700">barcode_scanner</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">קטגוריה</label>
                  <select
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none appearance-none"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">בחר קטגוריה</option>
                    <option>ירקות ופירות</option>
                    <option>מוצרי קפה</option>
                    <option>מוצרים יבשים</option>
                    <option>ריהוט ועיצוב</option>
                    <option>אחר</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">תמונת מוצר</label>
                  <div className="w-full h-12 border border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined">upload_file</span>
                    <span className="text-sm">העלה תמונה</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Inventory Control */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">ניהול מלאי</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">כמות נוכחית</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQty(1)}
                      className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                    <input
                      className="flex-1 h-12 text-center rounded-lg border border-slate-200 font-bold text-xl outline-none"
                      type="number"
                      value={form.qty}
                      onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                    />
                    <button
                      type="button"
                      onClick={() => handleQty(-1)}
                      className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">כמות מינימום (לתזכורת)</label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 text-right outline-none"
                    name="minQty"
                    placeholder="לדוגמה: 5"
                    type="number"
                    value={form.minQty}
                    onChange={handleChange}
                  />
                  <p className="text-[11px] text-slate-400">המערכת תתריע כאשר המלאי ירד מתחת לכמות זו.</p>
                </div>
              </div>
            </section>

            {/* Visual Preview */}
            <section className="bg-blue-50/50 rounded-xl border border-blue-100 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-sm mb-4">
                <span className="material-symbols-outlined text-blue-200 text-5xl">image</span>
              </div>
              <h4 className="text-lg font-bold text-blue-900 mb-1">תצוגה קדומה</h4>
              <p className="text-xs text-blue-700 max-w-[180px]">התמונה תופיע כאן לאחר העלאת מוצר חדש.</p>
              <div className="mt-6 w-full h-32 rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-5xl">inventory_2</span>
              </div>
            </section>

            {/* Actions */}
            <footer className="md:col-span-2 flex flex-col md:flex-row-reverse gap-4 mt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 md:flex-initial md:px-12 h-12 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-md"
              >
                שמור מוצר
              </button>
              <Link
                to="/inventory"
                className="flex-1 md:flex-initial md:px-12 h-12 border border-blue-700 text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center"
              >
                ביטול
              </Link>
            </footer>
          </div>
        </div>
      </main>

      <BottomNavBar />

      <Footer />
    </div>
  )
}
