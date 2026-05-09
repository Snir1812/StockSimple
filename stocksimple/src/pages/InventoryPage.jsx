import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Badge from '../components/Badge/Badge'

const products = [
  { id: 1, name: 'עגבניות שרי', sku: '100234', qty: 0, unit: 'ק״ג', status: 'error' },
  { id: 2, name: 'שמן זית כתית', sku: '550981', qty: 4, unit: 'ל״ג', status: 'warning' },
  { id: 3, name: 'פיתות (מארז 10)', sku: '322041', qty: 120, unit: 'ל״ג', status: 'ok' },
  { id: 4, name: 'מלפפונים טריים', sku: '100235', qty: 45, unit: 'ק״ג', status: 'ok' },
  { id: 5, name: 'גבינה צהובה 28%', sku: '100236', qty: 8, unit: 'ק״ג', status: 'warning' },
  { id: 6, name: 'לחם אחיד', sku: '100237', qty: 0, unit: 'יח׳', status: 'error' },
]

export default function InventoryPage() {
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    p.name.includes(search) || p.sku.includes(search)
  )

  return (
    <div className="bg-background text-on-background">
      <SideNavBar />

      <header className="sticky top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex flex-row-reverse justify-between items-center px-4 md:pr-[256px]">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500">person</span>
          </div>
          <span className="material-symbols-outlined text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">notifications</span>
        </div>
        <h2 className="text-xl font-black text-blue-700">רשימת מלאי</h2>
      </header>

      <main className="md:pr-[240px] pb-32 min-h-screen">
        {/* Search & Filter Bar */}
        <div className="p-4 bg-white sticky top-16 z-30 flex gap-3 items-center border-b border-slate-100">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-right focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none transition-all"
              placeholder="חפש מוצר..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
            <span className="material-symbols-outlined">barcode_scanner</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>

        {/* Product List */}
        <div className="px-4 py-2 space-y-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-300 text-3xl">inventory_2</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500">קוד מוצר: {p.sku}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-700">כמות: {p.qty} {p.unit}</span>
                  <Badge variant={p.status} />
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_left</span>
            </div>
          ))}
        </div>
      </main>

      {/* FAB */}
      <Link
        to="/inventory/add"
        className="fixed bottom-20 left-6 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-transform active:scale-90"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <BottomNavBar />
    </div>
  )
}
