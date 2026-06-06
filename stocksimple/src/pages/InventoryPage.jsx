import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getStatus } from '../lib/inventory'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Badge from '../components/Badge/Badge'

export default function InventoryPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('name')

      if (error) {
        setError('שגיאה בטעינת המוצרים. נסה לרענן את הדף.')
      } else {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = products.filter(p =>
    p.name.includes(search) || (p.sku ?? '').includes(search)
  )

  const updateQty = async (product, delta) => {
    const newQty = Math.max(0, product.qty + delta)
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, qty: newQty } : p))

    const { error } = await supabase
      .from('products')
      .update({ qty: newQty })
      .eq('id', product.id)

    if (error) {
      // Revert on failure
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, qty: product.qty } : p))
    }
  }

  return (
    <div className="bg-background text-on-background">
      <SideNavBar />
      <TopAppBar />

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
          {/* Desktop add button */}
          <button
            onClick={() => navigate('/inventory/add')}
            className="hidden md:flex items-center gap-2 h-12 px-5 bg-blue-700 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            הוסף מוצר
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Product List */}
        <div className="px-4 py-4 space-y-3">

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center animate-pulse">
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-8 bg-slate-100 rounded w-full mt-2" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-5xl block mb-2">search_off</span>
              <p className="text-sm">לא נמצאו מוצרים</p>
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-3xl">inventory_2</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-right min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {p.categories?.name ?? 'ללא קטגוריה'}
                  </p>

                  {/* Bottom row: badge + qty controls */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant={getStatus(p)} />

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(p, -1)}
                        disabled={p.qty === 0}
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold text-slate-800 min-w-[56px] text-center">
                        {p.qty} {p.unit}
                      </span>
                      <button
                        onClick={() => updateQty(p, +1)}
                        className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors font-bold text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      <Link
        to="/inventory/add"
        className="fixed bottom-20 left-6 w-14 h-14 bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-transform active:scale-90 md:hidden"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <BottomNavBar />
    </div>
  )
}
