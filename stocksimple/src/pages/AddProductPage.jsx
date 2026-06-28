import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

export default function AddProductPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const userId = session?.user?.id

  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [businessId, setBusinessId] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category_id: '',
    supplier_id: '',
    qty: 0,
    min_qty: 5,
    unit: 'יח\'',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSupplierName, setNewSupplierName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [addingSupplier, setAddingSupplier] = useState(false)

  useEffect(() => {
    if (!userId) return
    async function fetchData() {
      const [categoriesRes, suppliersRes, profileRes] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('suppliers').select('id, name').order('name'),
        supabase.from('profiles').select('business_id').eq('user_id', userId).single(),
      ])
      if (!categoriesRes.error) setCategories(categoriesRes.data)
      if (!suppliersRes.error) setSuppliers(suppliersRes.data)
      if (!profileRes.error) setBusinessId(profileRes.data.business_id)
      setLoadingData(false)
    }
    fetchData()
  }, [userId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleQty = (delta) =>
    setForm({ ...form, qty: Math.max(0, form.qty + delta) })

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('שם המוצר הוא שדה חובה')
      return
    }
    if (!businessId) {
      setError('שגיאה: לא נמצא מזהה עסק. נסה לרענן את הדף.')
      return
    }

    setSaving(true)
    setError('')

    const usingNewCategory = (categories.length === 0 || addingCategory) && newCategoryName.trim()
    const usingNewSupplier = (suppliers.length === 0 || addingSupplier) && newSupplierName.trim()

    let categoryId = form.category_id || null
    let supplierId = form.supplier_id || null

    if (usingNewCategory) {
      const { data, error: catError } = await supabase
        .from('categories')
        .insert({ name: newCategoryName.trim(), business_id: businessId })
        .select('id')
        .single()
      if (catError) {
        setSaving(false)
        setError(`שגיאה ביצירת קטגוריה: ${catError.message}`)
        return
      }
      categoryId = data.id
    }

    if (usingNewSupplier) {
      const { data, error: supError } = await supabase
        .from('suppliers')
        .insert({ name: newSupplierName.trim(), business_id: businessId })
        .select('id')
        .single()
      if (supError) {
        setSaving(false)
        setError(`שגיאה ביצירת ספק: ${supError.message}`)
        return
      }
      supplierId = data.id
    }

    const { error: insertError } = await supabase.from('products').insert({
      name: form.name.trim(),
      sku: form.sku.trim() || null,
      qty: Number(form.qty),
      min_qty: Number(form.min_qty) || 5,
      unit: form.unit.trim() || 'יח\'',
      category_id: categoryId,
      supplier_id: supplierId,
      business_id: businessId,
    })

    setSaving(false)

    if (insertError) {
      setError(`שגיאה בשמירת המוצר: ${insertError.message}`)
      return
    }

    navigate('/inventory')
  }

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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">הוספת מוצר חדש</h2>
            <p className="text-slate-500">מלא את פרטי המוצר ולחץ שמור להוספתו למערכת.</p>
          </header>

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-right">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Basic Info */}
            <section className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">פרטי מוצר בסיסיים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">
                    שם מוצר <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none"
                    name="name"
                    placeholder="לדוגמה: נייר צילום A4"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                {/* SKU */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">ברקוד / SKU</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 px-4 pl-12 rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none"
                      name="sku"
                      placeholder="סרוק או הקלד ברקוד"
                      type="text"
                      value={form.sku}
                      onChange={handleChange}
                    />
                    <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-blue-700">barcode_scanner</span>
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">קטגוריה</label>
                  {loadingData ? (
                    <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
                  ) : categories.length === 0 || addingCategory ? (
                    <>
                      <input
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none"
                        type="text"
                        placeholder="הכנס שם קטגוריה חדשה"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      {categories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { setAddingCategory(false); setNewCategoryName('') }}
                          className="text-xs text-blue-700 self-start hover:underline"
                        >
                          בחר מהרשימה
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <select
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none appearance-none"
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                      >
                        <option value="">בחר קטגוריה</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setAddingCategory(true)}
                        className="text-xs text-blue-700 self-start hover:underline"
                      >
                        + הוסף חדש
                      </button>
                    </>
                  )}
                </div>

                {/* Supplier */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">ספק</label>
                  {loadingData ? (
                    <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
                  ) : suppliers.length === 0 || addingSupplier ? (
                    <>
                      <input
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none"
                        type="text"
                        placeholder="הכנס שם ספק חדש"
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                      />
                      {suppliers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { setAddingSupplier(false); setNewSupplierName('') }}
                          className="text-xs text-blue-700 self-start hover:underline"
                        >
                          בחר מהרשימה
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <select
                        className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 text-right outline-none appearance-none"
                        name="supplier_id"
                        value={form.supplier_id}
                        onChange={handleChange}
                      >
                        <option value="">בחר ספק</option>
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setAddingSupplier(true)}
                        className="text-xs text-blue-700 self-start hover:underline"
                      >
                        + הוסף חדש
                      </button>
                    </>
                  )}
                </div>

              </div>
            </section>

            {/* Inventory Control */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">ניהול מלאי</h3>
              <div className="flex flex-col gap-6">

                {/* Current Qty */}
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
                      min="0"
                      name="qty"
                      value={form.qty}
                      onChange={(e) => setForm({ ...form, qty: Math.max(0, Number(e.target.value)) })}
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

                {/* Min Qty */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">כמות מינימום (לתזכורת)</label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 text-right outline-none"
                    name="min_qty"
                    placeholder="לדוגמה: 5"
                    type="number"
                    min="0"
                    value={form.min_qty}
                    onChange={handleChange}
                  />
                  <p className="text-[11px] text-slate-400">המערכת תתריע כאשר המלאי ירד מתחת לכמות זו.</p>
                </div>

                {/* Unit */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-500">יחידת מידה</label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-700 text-right outline-none"
                    name="unit"
                    placeholder="יח', ק&quot;ג, ליטר..."
                    type="text"
                    value={form.unit}
                    onChange={handleChange}
                  />
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
                {form.name ? (
                  <span className="text-slate-600 font-bold text-sm px-4 text-center">{form.name}</span>
                ) : (
                  <span className="material-symbols-outlined text-slate-400 text-5xl">inventory_2</span>
                )}
              </div>
            </section>

            {/* Actions */}
            <footer className="md:col-span-2 flex flex-col md:flex-row-reverse gap-4 mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || loadingData}
                className="flex-1 md:flex-initial md:px-12 h-12 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                ) : (
                  'שמור מוצר'
                )}
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
