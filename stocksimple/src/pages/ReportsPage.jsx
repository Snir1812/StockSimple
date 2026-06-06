import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TopAppBar from '../components/TopAppBar/TopAppBar'
import SideNavBar from '../components/SideNavBar/SideNavBar'
import BottomNavBar from '../components/BottomNavBar/BottomNavBar'
import Footer from '../components/Footer/Footer'

const TABS = [
  { key: 'week',  label: 'השבוע' },
  { key: 'month', label: 'החודש' },
  { key: 'all',   label: 'הכל' },
]

const REASON_COLORS = {
  'פג תוקף': 'bg-orange-100 text-orange-700',
  'נשבר':    'bg-red-100 text-red-700',
  'תקלה':    'bg-yellow-100 text-yellow-700',
  'גניבה':   'bg-purple-100 text-purple-700',
  'אחר':     'bg-slate-100 text-slate-600',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function filterByTab(reports, tab) {
  const now = new Date()
  return reports.filter(r => {
    const d = new Date(r.created_at)
    if (tab === 'week') {
      return now - d <= 7 * 24 * 60 * 60 * 1000
    }
    if (tab === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }
    return true
  })
}

function exportCSV(reports) {
  const headers = ['תאריך', 'מוצר', 'כמות', 'יחידה', 'סיבה', 'הערות']
  const rows = reports.map(r => [
    formatDate(r.created_at),
    r.products?.name ?? '',
    r.qty,
    r.products?.unit ?? '',
    r.reason ?? '',
    r.notes ?? '',
  ])
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `waste-report-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const { user, session } = useAuth()
  const userId = session?.user?.id

  const [allReports, setAllReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('month')

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from('waste_reports')
        .select('id, qty, reason, notes, created_at, reported_by, products(name, unit, categories(name))')
        .order('created_at', { ascending: false })

      if (error) {
        setError(`שגיאה בטעינת הדוחות: ${error.message}`)
      } else {
        setAllReports(data)
      }
      setLoading(false)
    }
    fetchReports()
  }, [])

  const filtered = useMemo(() => filterByTab(allReports, activeTab), [allReports, activeTab])

  // ── Summary computations ──────────────────────────────────────────────────
  const totalReports = filtered.length
  const totalQty = filtered.reduce((sum, r) => sum + r.qty, 0)

  const topProduct = useMemo(() => {
    const map = {}
    for (const r of filtered) {
      const name = r.products?.name ?? 'לא ידוע'
      map[name] = (map[name] || 0) + r.qty
    }
    const entries = Object.entries(map).sort(([, a], [, b]) => b - a)
    return entries[0] ? { name: entries[0][0], qty: entries[0][1] } : null
  }, [filtered])

  // ── Bar chart: group by category ─────────────────────────────────────────
  const categoryBars = useMemo(() => {
    const map = {}
    for (const r of filtered) {
      const cat = r.products?.categories?.name ?? 'ללא קטגוריה'
      map[cat] = (map[cat] || 0) + r.qty
    }
    const entries = Object.entries(map).sort(([, a], [, b]) => b - a)
    const max = Math.max(...entries.map(([, v]) => v), 1)
    return entries.map(([label, qty]) => ({ label, qty, pct: Math.round((qty / max) * 100) }))
  }, [filtered])

  const summaryCards = [
    {
      label: 'דיווחי פחת',
      value: loading ? '—' : totalReports,
      sub: activeTab === 'month' ? 'החודש הנוכחי' : activeTab === 'week' ? 'השבוע הנוכחי' : 'סה"כ',
      icon: 'receipt_long',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
    },
    {
      label: 'סה"כ יחידות שנפחתו',
      value: loading ? '—' : totalQty,
      sub: 'יחידות מלאי',
      icon: 'trending_down',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'המוצר הכי מבוזבז',
      value: loading ? '—' : (topProduct?.name ?? '—'),
      sub: topProduct ? `${topProduct.qty} יחידות` : 'אין נתונים',
      icon: 'emoji_food_beverage',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="bg-background text-on-surface">
      <SideNavBar />
      <TopAppBar />

      <main className="md:pr-[240px] pb-24 p-4 md:p-8 max-w-7xl mx-auto w-full">

        {/* Header + Export */}
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">דוחות פחת</h1>
            <p className="text-sm text-slate-500">ניתוח מלאי שנפחת לפי תקופה וקטגוריה</p>
          </div>
          <button
            onClick={() => exportCSV(filtered)}
            disabled={loading || filtered.length === 0}
            className="flex items-center gap-2 h-10 px-5 rounded-xl border border-slate-200 text-slate-600 bg-white text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            ייצא CSV
          </button>
        </div>

        {/* Date Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 w-fit mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-lg text-sm transition-all ${activeTab === tab.key ? 'bg-white shadow-sm text-blue-700 font-bold' : 'text-slate-500 hover:text-blue-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-right">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {summaryCards.map((card, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div className="text-right flex-1 min-w-0">
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5 truncate">{card.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 min-h-[300px] flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-6">פחת לפי קטגוריות</h2>

            {loading ? (
              <div className="flex-1 flex items-end gap-4 pb-6">
                {[60, 40, 85, 30, 55].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-t-lg animate-pulse" style={{ height: `${h}%`, minHeight: 20 }} />
                    <div className="h-2 w-10 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : categoryBars.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                אין נתוני פחת לתקופה הנבחרת
              </div>
            ) : (
              <div className="flex-1 flex items-end gap-3 pb-6">
                {categoryBars.map(({ label, qty, pct }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {qty}
                    </span>
                    <div className="w-full bg-blue-50 rounded-t-lg relative" style={{ height: 160 }}>
                      <div
                        className="absolute bottom-0 w-full bg-blue-700 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insight Card */}
          <div className="lg:col-span-1 rounded-xl overflow-hidden relative bg-blue-700 flex flex-col justify-end p-6 min-h-[200px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-white text-[200px]">analytics</span>
            </div>
            <div className="relative z-10 text-right">
              <span className="text-white/70 text-xs">סיכום תקופה</span>
              {loading ? (
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-white/20 rounded animate-pulse" />
                  <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse" />
                </div>
              ) : totalReports === 0 ? (
                <h3 className="text-white text-lg font-bold mt-2">אין דיווחי פחת לתקופה הנבחרת 🎉</h3>
              ) : (
                <h3 className="text-white text-lg font-bold mt-2">
                  {totalReports} דיווחים נרשמו עם {totalQty} יחידות שנפחתו
                  {topProduct && `. המוצר ${topProduct.name} הוביל עם ${topProduct.qty} יחידות.`}
                </h3>
              )}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-row-reverse justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">היסטוריית דיווחים</h2>
            <span className="text-xs text-slate-400">{filtered.length} רשומות</span>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
              <p className="text-sm">אין דיווחי פחת לתקופה הנבחרת</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50">
                  <tr>
                    {['תאריך', 'מוצר', 'קטגוריה', 'כמות', 'סיבה', 'מדווח ע"י'].map(h => (
                      <th key={h} className="px-5 py-3 text-slate-500 font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900 text-sm">
                        {r.products?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        {r.products?.categories?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-800 text-sm">
                        {r.qty} {r.products?.unit ?? ''}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${REASON_COLORS[r.reason] ?? 'bg-slate-100 text-slate-600'}`}>
                          {r.reason ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        {r.reported_by === userId ? (user?.name ?? 'אני') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <BottomNavBar />
      <Footer />
    </div>
  )
}
