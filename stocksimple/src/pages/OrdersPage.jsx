import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { formatPhoneForWhatsApp, buildWhatsAppUrl } from '../lib/orders'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

export default function OrdersPage() {
  const { session } = useAuth()
  const userId = session?.user?.id

  const [supplierGroups, setSupplierGroups] = useState([])
  const [businessId, setBusinessId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creatingOrder, setCreatingOrder] = useState(null)
  const [successOrders, setSuccessOrders] = useState(new Set())

  useEffect(() => {
    if (!userId) return
    async function fetchData() {
      const [productsRes, profileRes] = await Promise.all([
        supabase
          .from('products')
          .select('id, name, qty, min_qty, unit, supplier_id, suppliers(id, name, phone)')
          .order('name'),
        supabase.from('profiles').select('business_id').eq('user_id', userId).single(),
      ])

      if (productsRes.error) {
        setError(`שגיאה בטעינת המוצרים: ${productsRes.error.message}`)
        setLoading(false)
        return
      }
      if (!profileRes.error) setBusinessId(profileRes.data.business_id)

      // Filter to only low/out-of-stock products that have a supplier
      const lowStock = productsRes.data
        .filter(p => p.qty < p.min_qty && p.supplier_id && p.suppliers)
        .map(p => ({ ...p, needed: p.min_qty - p.qty }))

      // Group by supplier
      const groupMap = new Map()
      for (const p of lowStock) {
        const sid = p.supplier_id
        if (!groupMap.has(sid)) {
          groupMap.set(sid, { supplier: p.suppliers, products: [] })
        }
        groupMap.get(sid).products.push(p)
      }

      setSupplierGroups([...groupMap.values()])
      setLoading(false)
    }
    fetchData()
  }, [userId])

  const handleCreateOrder = async (supplier, products) => {
    if (!businessId) {
      setError('שגיאה: לא נמצא מזהה עסק. נסה לרענן.')
      return
    }
    setCreatingOrder(supplier.id)
    setError('')

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ supplier_id: supplier.id, status: 'draft', business_id: businessId, created_by: userId })
      .select('id')
      .single()

    if (orderError) {
      setError(`שגיאה ביצירת ההזמנה: ${orderError.message}`)
      setCreatingOrder(null)
      return
    }

    const items = products.map(p => ({
      order_id: orderData.id,
      product_id: p.id,
      qty: Math.max(1, p.needed),
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(items)

    setCreatingOrder(null)

    if (itemsError) {
      setError(`שגיאה בשמירת פריטי ההזמנה: ${itemsError.message}`)
      return
    }

    setSuccessOrders(prev => new Set([...prev, supplier.id]))
    setTimeout(() => {
      setSuccessOrders(prev => {
        const next = new Set(prev)
        next.delete(supplier.id)
        return next
      })
    }, 5000)
  }

  return (
    <div className="bg-background text-on-background">
      <SideNavBar />
      <TopAppBar />

      <main className="md:pr-[240px] pb-32 pt-6 px-4 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900">ניהול הזמנות</h1>
            <p className="text-sm text-slate-500">מוצרים עם מלאי נמוך, מקובצים לפי ספק</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-right">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="h-5 w-40 bg-slate-100 rounded mb-3" />
                <div className="h-3 w-28 bg-slate-100 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-8 bg-slate-100 rounded" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && supplierGroups.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="text-xl font-bold text-slate-700 mb-2">כל המלאי תקין</h2>
            <p className="text-slate-400 text-sm">אין מוצרים עם מלאי נמוך כרגע.</p>
          </div>
        )}

        {/* Supplier Cards */}
        {!loading && (
          <div className="grid grid-cols-1 gap-4">
            {supplierGroups.map(({ supplier, products }) => {
              const isCreating = creatingOrder === supplier.id
              const isSuccess = successOrders.has(supplier.id)
              const outOfStock = products.filter(p => p.qty === 0).length
              const lowStock = products.filter(p => p.qty > 0).length

              return (
                <div
                  key={supplier.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm hover:border-blue-200 transition-all"
                >
                  {/* Supplier header */}
                  <div className="flex flex-row-reverse justify-between items-start gap-4">
                    <div className="text-right">
                      <h3 className="font-bold text-lg text-blue-700">{supplier.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs justify-end">
                        <span>{supplier.phone}</span>
                        <span className="material-symbols-outlined text-[16px]">call</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {outOfStock > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">warning</span>
                          {outOfStock} חסרים לחלוטין
                        </span>
                      )}
                      {lowStock > 0 && (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">trending_down</span>
                          {lowStock} מלאי נמוך
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product list */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-slate-500 mb-2 pb-2 border-b border-slate-100 text-right">
                      רשימת חוסרים:
                    </p>
                    <ul className="space-y-1.5">
                      {products.map(p => (
                        <li key={p.id} className="flex flex-row-reverse justify-between items-center text-sm">
                          <span className="font-medium text-slate-800">{p.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">
                              יש: {p.qty} / מינ׳: {p.min_qty} {p.unit}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.qty === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              חסר {p.needed} {p.unit}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success banner */}
                  {isSuccess && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm text-center flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                      ההזמנה נוצרה בהצלחה ונשמרה במערכת!
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row-reverse gap-3">
                    <a
                      href={buildWhatsAppUrl(supplier, products)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-12 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      שלח הזמנה בוואטסאפ
                    </a>
                    <button
                      onClick={() => handleCreateOrder(supplier, products)}
                      disabled={isCreating || isSuccess}
                      className="flex-1 h-12 bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                          צור הזמנה
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNavBar />
      <Footer />
    </div>
  )
}
