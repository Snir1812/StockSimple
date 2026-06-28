import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { groupProductsBySupplier } from '../lib/orders'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'
import StatCard from '../components/StatCard/StatCard'

function formatRelativeTime(dateStr) {
  const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (minutes < 1) return 'הרגע'
  if (minutes < 60) return `לפני ${minutes} דק'`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `לפני ${hours} שעות`
  return `לפני ${Math.floor(hours / 24)} ימים`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [pendingSupplierCount, setPendingSupplierCount] = useState(0)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, qty, min_qty, unit, supplier_id, suppliers(id, name, phone)')

      if (error) {
        setError('שגיאה בטעינת הנתונים. נסה לרענן את הדף.')
      } else {
        setProducts(data)
        setPendingSupplierCount(groupProductsBySupplier(data).length)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    async function fetchRecentActivity() {
      const { data, error } = await supabase
        .from('waste_reports')
        .select('id, qty, created_at, products(name, unit)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (!error) setRecentActivity(data)
    }
    fetchRecentActivity()
  }, [])

  const totalProducts = products.length
  const shortageProducts = products.filter(p => p.qty === 0)
  const warningProducts = products.filter(p => p.qty > 0 && p.qty < p.min_qty)
  // Alert list: out-of-stock first, then low stock
  const alertProducts = [
    ...shortageProducts,
    ...warningProducts,
  ]

  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />
      <main className="md:pr-[240px] min-h-screen pb-24 md:pb-0">
        <TopAppBar />

        {/* Hero */}
        <section className="bg-primary-container p-6 md:p-8 text-white">
          <div className="max-w-5xl mx-auto flex flex-col gap-1">
            <h1 className="text-2xl font-bold">שלום, {user?.name} 👋</h1>
            <p className="text-base opacity-90">{user?.business || 'העסק שלי'}</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">

          {/* Error banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Stats Row */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 h-[88px] animate-pulse">
                  <div className="h-3 w-24 bg-slate-100 rounded mb-3" />
                  <div className="h-7 w-16 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="סה״כ מוצרים"
                value={totalProducts}
                icon="inventory_2"
                iconBg="bg-primary-fixed"
                iconColor="text-primary-container"
              />
              <StatCard
                label="חוסרים"
                value={shortageProducts.length}
                icon="remove_circle"
                iconBg="bg-red-50"
                iconColor="text-red-600"
              />
              <StatCard
                label="אזהרות מלאי"
                value={warningProducts.length}
                icon="warning"
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
              />
            </div>
          )}

          {/* Alerts + Quick Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Shortage Alerts */}
            <div className="lg:col-span-2 bg-red-50 text-red-900 rounded-xl p-6 border border-red-200 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">warning</span>
                <h3 className="text-lg font-bold text-red-600">מוצרים חסרים</h3>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/40 p-3 rounded-lg h-11 animate-pulse" />
                  ))}
                </div>
              ) : alertProducts.length === 0 ? (
                <div className="bg-white/40 p-4 rounded-lg text-center text-sm text-red-700/70">
                  <span className="material-symbols-outlined text-2xl block mb-1">check_circle</span>
                  אין חוסרים כרגע — המלאי תקין!
                </div>
              ) : (
                <div className="space-y-2">
                  {alertProducts.map(p => (
                    <div key={p.id} className="bg-white/40 p-3 rounded-lg flex justify-between items-center">
                      <span className="font-medium text-sm">{p.name}</span>
                      {p.qty === 0 ? (
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                          חסר לחלוטין
                        </span>
                      ) : (
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          נותרו {p.qty} {p.unit}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/waste"
                className="w-full h-12 bg-error text-on-error rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">delete_sweep</span>
                דיווח פחת עכשיו
              </Link>
            </div>

            {/* Orders Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2 text-slate-900">הזמנת ספקים</h3>
                <p className="text-sm text-slate-500">
                  {pendingSupplierCount > 0
                    ? `ישנם ${pendingSupplierCount} ספקים עם מוצרים שממתינים להזמנה.`
                    : 'אין כרגע מוצרים שממתינים להזמנה מספקים.'}
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <Link to="/orders" className="text-primary-container font-bold flex items-center gap-1 text-sm">
                  לצפייה בתעודות
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </Link>
              </div>
              <div className="absolute -bottom-4 -left-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]">description</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">פעילות אחרונות</h3>
              <Link to="/inventory" className="text-xs text-primary-container hover:underline">הצג הכל</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">פריט</th>
                    <th className="p-4 font-medium">סוג פעולה</th>
                    <th className="p-4 font-medium">כמות</th>
                    <th className="p-4 font-medium">זמן</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">אין פעילות אחרונה</td>
                    </tr>
                  ) : (
                    recentActivity.map(row => (
                      <tr key={row.id}>
                        <td className="p-4 font-medium text-slate-900">{row.products?.name ?? 'מוצר שנמחק'}</td>
                        <td className="p-4">
                          <span className="text-red-600">ביצוע פחת</span>
                        </td>
                        <td className="p-4">-{row.qty} {row.products?.unit ?? ''}</td>
                        <td className="p-4 text-slate-400">{formatRelativeTime(row.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </main>
      <BottomNavBar />
    </div>
  )
}
