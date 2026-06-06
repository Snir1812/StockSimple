import { describe, it, expect } from 'vitest'
import { computeDashboardStats } from '../lib/dashboard'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const products = [
  { id: '1', name: 'אפס מלאי א', qty: 0,  min_qty: 5  }, // shortage
  { id: '2', name: 'אפס מלאי ב', qty: 0,  min_qty: 3  }, // shortage
  { id: '3', name: 'מלאי נמוך א', qty: 2,  min_qty: 10 }, // warning
  { id: '4', name: 'מלאי נמוך ב', qty: 4,  min_qty: 8  }, // warning
  { id: '5', name: 'תקין א',     qty: 10, min_qty: 5  }, // ok
  { id: '6', name: 'תקין ב',     qty: 20, min_qty: 20 }, // ok (exactly at min)
]

// ── computeDashboardStats ─────────────────────────────────────────────────────

describe('computeDashboardStats', () => {
  it('shortage count equals the number of products where qty = 0', () => {
    const { shortageCount } = computeDashboardStats(products)
    expect(shortageCount).toBe(2)
  })

  it('warning count equals the number of products where qty > 0 and qty < min_qty', () => {
    const { warningCount } = computeDashboardStats(products)
    expect(warningCount).toBe(2)
  })

  it('ok products are excluded from both shortage and warning counts', () => {
    const { shortageCount, warningCount } = computeDashboardStats(products)
    // 6 total, 2 shortage, 2 warning → 2 ok
    expect(shortageCount + warningCount).toBe(4)
  })

  it('total equals the full product count', () => {
    const { total } = computeDashboardStats(products)
    expect(total).toBe(6)
  })

  it('returns zero counts when every product has sufficient stock', () => {
    const okOnly = [
      { id: '1', qty: 10, min_qty: 5 },
      { id: '2', qty: 20, min_qty: 10 },
    ]
    const { shortageCount, warningCount } = computeDashboardStats(okOnly)
    expect(shortageCount).toBe(0)
    expect(warningCount).toBe(0)
  })

  it('counts a product at exactly min_qty as ok, not warning', () => {
    const edge = [{ id: '1', qty: 5, min_qty: 5 }]
    const { shortageCount, warningCount } = computeDashboardStats(edge)
    expect(shortageCount).toBe(0)
    expect(warningCount).toBe(0)
  })

  it('returns all zeros for an empty product list', () => {
    const stats = computeDashboardStats([])
    expect(stats).toEqual({ total: 0, shortageCount: 0, warningCount: 0 })
  })
})
