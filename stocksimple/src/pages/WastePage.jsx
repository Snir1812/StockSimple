import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'

export default function WastePage() {
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [qty, setQty] = useState(3)
  const [notes, setNotes] = useState('')

  const handleSubmit = () => navigate('/dashboard')

  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />

      <header className="sticky top-0 w-full h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-row-reverse justify-between items-center px-4 md:pr-[256px] z-40">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">person</span>
          </div>
          <h1 className="text-2xl font-black text-blue-700">StockSimple</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
            notifications
          </button>
        </div>
      </header>

      <aside className="hidden md:flex flex-col fixed right-0 top-0 h-screen z-50 bg-white w-[240px] border-l border-slate-200">
        <SideNavBar />
      </aside>

      <main className="md:pr-[240px] min-h-[calc(100vh-64px)] pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <div className="mb-8 text-right">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">דיווח פחת מוצר</h2>
            <p className="text-slate-500">סרוק ברקוד או חפש פריט מוצר לדיווח על מלאי שנגמר לפני תוקפו</p>
          </div>

          <div className="space-y-6">
            {/* Scanner Box */}
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
                <div className="text-center text-white">
                  <span className="material-symbols-outlined text-[80px] text-slate-400">barcode_scanner</span>
                  <p className="mt-2 text-slate-400">לחץ לפתיחת סורק</p>
                </div>
              </div>
              {/* Scanning UI overlays */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 m-8 rounded-lg"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_red]"></div>
              <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">videocam</span>
                סריקה פעילה...
              </div>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">barcode_scanner</span>
                  צולם מסך
                </button>
              </div>
            </div>

            {/* Detected Product */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg border border-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">inventory_2</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-900">מיכל שמוט עזוז 28%</div>
                  <div className="text-xs text-blue-700/70">ברק׳: 7290000012345</div>
                </div>
              </div>
              <button className="text-blue-700 font-bold text-sm hover:underline">החלף מוצר</button>
            </div>

            {/* Form Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reason */}
              <div className="flex flex-col gap-2 text-right">
                <label className="text-xs text-slate-500 px-1">סיבת הפחת</label>
                <div className="relative">
                  <select
                    className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 pr-10 appearance-none text-slate-900 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="">בחר סיבה...</option>
                    <option>פג תוקף</option>
                    <option>ירידת פריות</option>
                    <option>קלקול / נזק פיזי</option>
                    <option>אחר</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col gap-2 text-right">
                <label className="text-xs text-slate-500 px-1">כמות הפחות</label>
                <div className="flex items-center h-12 bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="flex-1 h-full flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <div className="w-16 h-full flex items-center justify-center border-x border-slate-200 font-bold text-xl">{qty}</div>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex-1 h-full flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2 text-right">
              <label className="text-xs text-slate-500 px-1">הערות נוספות (אופציונלי)</label>
              <textarea
                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-lg p-4 text-slate-900 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none resize-none"
                placeholder="פרט כאן מידע נוסף..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full h-12 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                אשר ושמור
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />

      {/* Footer - Desktop */}
      <footer className="hidden md:block w-full py-12 bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col md:flex-row-reverse justify-between items-center px-6 max-w-7xl mx-auto gap-4">
          <div className="text-lg font-bold text-slate-800">StockSimple</div>
          <p className="text-sm text-slate-500">© 2024 StockSimple - ניהול מלאי חכם</p>
        </div>
      </footer>
    </div>
  )
}
