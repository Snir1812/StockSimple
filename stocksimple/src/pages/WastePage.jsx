import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

const REASONS = ['פג תוקף', 'נשבר', 'תקלה', 'גניבה', 'אחר']

export default function WastePage() {
  const { session } = useAuth()
  const userId = session?.user?.id

  const [products, setProducts] = useState([])
  const [businessId, setBusinessId] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  const [selectedProductId, setSelectedProductId] = useState('')
  const [reportQty, setReportQty] = useState(1)
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    console.log('[WastePage] userId:', userId)
    if (!userId) return
    async function fetchData() {
      const [productsRes, profileRes] = await Promise.all([
        supabase.from('products').select('id, name, unit, qty').order('name'),
        supabase.from('profiles').select('business_id').eq('user_id', userId).single(),
      ])

      console.log('[WastePage] productsRes:', productsRes)
      console.log('[WastePage] profileRes:', profileRes)

      if (productsRes.error) {
        console.error('[WastePage] products fetch error:', productsRes.error)
        setFetchError('שגיאה בטעינת המוצרים. נסה לרענן.')
      } else {
        setProducts(productsRes.data)
      }

      if (profileRes.error) {
        console.error('[WastePage] profile fetch error:', profileRes.error)
        setFetchError('שגיאה בטעינת פרופיל המשתמש. נסה לרענן.')
      } else {
        console.log('[WastePage] businessId set to:', profileRes.data.business_id)
        setBusinessId(profileRes.data.business_id)
      }

      setLoadingData(false)
    }
    fetchData()
  }, [userId])

  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null

  const changeProduct = (id) => {
    setSelectedProductId(id)
    setReportQty(1)
    setValidationError('')
  }

  const changeReportQty = (delta) => {
    setReportQty(prev => {
      const next = prev + delta
      if (next < 1) return 1
      if (selectedProduct && next > selectedProduct.qty) return selectedProduct.qty
      return next
    })
    setValidationError('')
  }

  const resetForm = () => {
    setSelectedProductId('')
    setReportQty(1)
    setReason('')
    setNotes('')
    setValidationError('')
    setSubmitError('')
  }

  const handleSubmit = async () => {
    setValidationError('')
    setSubmitError('')

    if (!selectedProductId) {
      setValidationError('יש לבחור מוצר')
      return
    }
    if (!reason) {
      setValidationError('יש לבחור סיבת פחת')
      return
    }
    if (reportQty < 1) {
      setValidationError('הכמות חייבת להיות לפחות 1')
      return
    }
    if (selectedProduct && reportQty > selectedProduct.qty) {
      setValidationError(`הכמות המדווחת (${reportQty}) עולה על המלאי הקיים (${selectedProduct.qty} ${selectedProduct.unit})`)
      return
    }

    if (!businessId) {
      setSubmitError('שגיאה: לא נמצא מזהה עסק. נסה לרענן את הדף.')
      console.error('[WastePage] businessId is null — cannot insert')
      return
    }

    setSaving(true)
    const newQty = Math.max(0, selectedProduct.qty - reportQty)

    const payload = {
      product_id: selectedProductId,
      qty: reportQty,
      reason,
      notes: notes || null,
      reported_by: userId,
      business_id: businessId,
    }
    console.log('[WastePage] Inserting waste_report:', payload)

    const [reportRes, updateRes] = await Promise.all([
      supabase.from('waste_reports').insert(payload),
      supabase.from('products').update({ qty: newQty }).eq('id', selectedProductId),
    ])

    console.log('[WastePage] waste_reports insert result:', reportRes)
    console.log('[WastePage] products update result:', updateRes)

    setSaving(false)

    if (reportRes.error || updateRes.error) {
      const err = reportRes.error ?? updateRes.error
      console.error('[WastePage] save error:', err)
      setSubmitError(`שגיאה בשמירת הדיווח: ${err.message}`)
      return
    }

    // Update local products state so qty reflects immediately
    setProducts(prev =>
      prev.map(p => p.id === selectedProductId ? { ...p, qty: newQty } : p)
    )

    setSuccess(true)
    resetForm()
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />
      <TopAppBar />

      <main className="md:pr-[240px] min-h-[calc(100vh-64px)] pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto p-4 md:p-8">

          <div className="mb-8 text-right">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">דיווח פחת מוצר</h2>
            <p className="text-slate-500">סרוק ברקוד או בחר מוצר לדיווח על מלאי שנגמר לפני תוקפו</p>
          </div>

          {/* Success banner */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              הדיווח נשמר בהצלחה! המלאי עודכן.
            </div>
          )}

          {/* Fetch error */}
          {fetchError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {fetchError}
            </div>
          )}

          <div className="space-y-6">
            {/* Scanner Box */}
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
                <div className="text-center text-white">
                  <span className="material-symbols-outlined text-[80px] text-slate-400">barcode_scanner</span>
                  <p className="mt-2 text-slate-400">לחץ לפתיחת סורק</p>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 m-8 rounded-lg" />
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_red]" />
              <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">videocam</span>
                סריקה פעילה...
              </div>
            </div>

            {/* Product Selector */}
            <div className="flex flex-col gap-2 text-right">
              <label className="text-xs text-slate-500 px-1">בחר מוצר</label>
              {loadingData ? (
                <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                <div className="relative">
                  <select
                    className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 pr-4 appearance-none text-slate-900 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                    value={selectedProductId}
                    onChange={(e) => changeProduct(e.target.value)}
                  >
                    <option value="">-- בחר מוצר --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (מלאי: {p.qty} {p.unit})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              )}
            </div>

            {/* Selected Product Card */}
            {selectedProduct && (
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-600">inventory_2</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-900">{selectedProduct.name}</div>
                    <div className="text-xs text-blue-700/70">
                      מלאי נוכחי: <span className="font-bold">{selectedProduct.qty} {selectedProduct.unit}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => changeProduct('')}
                  className="text-blue-700 font-bold text-sm hover:underline"
                >
                  החלף
                </button>
              </div>
            )}

            {/* Form Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reason */}
              <div className="flex flex-col gap-2 text-right">
                <label className="text-xs text-slate-500 px-1">סיבת הפחת</label>
                <div className="relative">
                  <select
                    className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 pr-4 appearance-none text-slate-900 focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="">בחר סיבה...</option>
                    {REASONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex flex-col gap-2 text-right">
                <label className="text-xs text-slate-500 px-1">
                  כמות הפחות
                  {selectedProduct && (
                    <span className="text-slate-400 mr-1">(מקס׳: {selectedProduct.qty} {selectedProduct.unit})</span>
                  )}
                </label>
                <div className="flex items-center h-12 bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => changeReportQty(+1)}
                    disabled={selectedProduct ? reportQty >= selectedProduct.qty : false}
                    className="flex-1 h-full flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <div className="w-16 h-full flex items-center justify-center border-x border-slate-200 font-bold text-xl select-none">
                    {reportQty}
                  </div>
                  <button
                    onClick={() => changeReportQty(-1)}
                    disabled={reportQty <= 1}
                    className="flex-1 h-full flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-40"
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

            {/* Validation / Submit error */}
            {(validationError || submitError) && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {validationError || submitError}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={saving || loadingData}
                className="w-full h-12 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    אשר ושמור
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />
      <Footer />
    </div>
  )
}
