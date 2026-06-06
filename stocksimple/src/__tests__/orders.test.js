import { describe, it, expect } from 'vitest'
import { groupProductsBySupplier, buildWhatsAppUrl, formatPhoneForWhatsApp } from '../lib/orders'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const supplierA = { id: 's1', name: 'ספק א', phone: '050-1234567' }
const supplierB = { id: 's2', name: 'ספק ב', phone: '052-9876543' }

const products = [
  // supplier A — both below min_qty
  { id: 'p1', name: 'חלב',   qty: 1,  min_qty: 10, unit: 'ליטר',  supplier_id: 's1', suppliers: supplierA },
  { id: 'p2', name: 'לחם',   qty: 2,  min_qty: 20, unit: 'כיכר',  supplier_id: 's1', suppliers: supplierA },
  // supplier B — one short, one ok
  { id: 'p3', name: 'עוף',   qty: 0,  min_qty: 5,  unit: 'ק"ג',   supplier_id: 's2', suppliers: supplierB },
  { id: 'p4', name: 'בשר',   qty: 15, min_qty: 5,  unit: 'ק"ג',   supplier_id: 's2', suppliers: supplierB }, // ok
  // no supplier
  { id: 'p5', name: 'תבלין', qty: 0,  min_qty: 3,  unit: 'קופסה', supplier_id: null, suppliers: null },
]

// ── groupProductsBySupplier ───────────────────────────────────────────────────

describe('groupProductsBySupplier', () => {
  it('returns one group per supplier that has low-stock products', () => {
    const groups = groupProductsBySupplier(products)
    expect(groups).toHaveLength(2)
  })

  it('groups the correct products under each supplier', () => {
    const groups = groupProductsBySupplier(products)
    const groupA = groups.find(g => g.supplier.id === 's1')
    const groupB = groups.find(g => g.supplier.id === 's2')

    expect(groupA).toBeDefined()
    expect(groupA.products).toHaveLength(2)
    expect(groupB).toBeDefined()
    expect(groupB.products).toHaveLength(1) // only עוף; בשר has sufficient stock
  })

  it('excludes products with stock at or above min_qty', () => {
    const groups = groupProductsBySupplier(products)
    const groupB = groups.find(g => g.supplier.id === 's2')
    const names = groupB.products.map(p => p.name)
    expect(names).not.toContain('בשר')
  })

  it('excludes products that have no supplier', () => {
    const groups = groupProductsBySupplier(products)
    const allProductNames = groups.flatMap(g => g.products.map(p => p.name))
    expect(allProductNames).not.toContain('תבלין')
  })

  it('calculates needed qty as min_qty minus current qty', () => {
    const groups = groupProductsBySupplier(products)
    const groupA = groups.find(g => g.supplier.id === 's1')
    const milk = groupA.products.find(p => p.name === 'חלב')
    expect(milk.needed).toBe(9) // min_qty(10) - qty(1)
  })

  it('returns an empty array when all products have sufficient stock', () => {
    const fullStock = [
      { id: 'p1', qty: 10, min_qty: 5, supplier_id: 's1', suppliers: supplierA },
    ]
    expect(groupProductsBySupplier(fullStock)).toHaveLength(0)
  })
})

// ── formatPhoneForWhatsApp ────────────────────────────────────────────────────

describe('formatPhoneForWhatsApp', () => {
  it('converts a 05x Israeli number to the 9725x format', () => {
    expect(formatPhoneForWhatsApp('050-1234567')).toBe('972501234567')
    expect(formatPhoneForWhatsApp('052-9876543')).toBe('972529876543')
  })

  it('strips non-digit characters before converting', () => {
    expect(formatPhoneForWhatsApp('054 123 4567')).toBe('972541234567')
  })

  it('leaves a number already in 972 format unchanged', () => {
    expect(formatPhoneForWhatsApp('972501234567')).toBe('972501234567')
  })
})

// ── buildWhatsAppUrl ──────────────────────────────────────────────────────────

describe('buildWhatsAppUrl', () => {
  const lowStockItems = [
    { name: 'חלב', needed: 9,  unit: 'ליטר' },
    { name: 'לחם', needed: 18, unit: 'כיכר' },
  ]

  it('generates a wa.me URL', () => {
    const url = buildWhatsAppUrl(supplierA, lowStockItems)
    expect(url).toMatch(/^https:\/\/wa\.me\//)
  })

  it('embeds the supplier phone in the URL', () => {
    const url = buildWhatsAppUrl(supplierA, lowStockItems)
    expect(url).toContain('972501234567')
  })

  it('includes every low-stock product in the decoded message', () => {
    const url = buildWhatsAppUrl(supplierA, lowStockItems)
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('חלב')
    expect(decoded).toContain('לחם')
  })

  it('lists each product with its needed qty and unit', () => {
    const url = buildWhatsAppUrl(supplierA, lowStockItems)
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('9 ליטר')
    expect(decoded).toContain('18 כיכר')
  })

  it('includes a Hebrew greeting', () => {
    const url = buildWhatsAppUrl(supplierA, lowStockItems)
    expect(decodeURIComponent(url)).toContain('שלום')
  })
})
