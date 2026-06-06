import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateWasteReport, submitWasteReport } from '../lib/waste'

// ── Supabase mock ─────────────────────────────────────────────────────────────

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

import { supabase } from '../lib/supabase'

function makeChain(result) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq:     vi.fn().mockReturnThis(),
    order:  vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    then:   (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    catch:  (reject) => Promise.resolve(result).catch(reject),
  }
  return chain
}

beforeEach(() => vi.clearAllMocks())

const mockProduct = { id: 'p1', name: 'חלב', qty: 10, unit: 'ליטר', min_qty: 5 }

// ── validateWasteReport ───────────────────────────────────────────────────────

describe('validateWasteReport', () => {
  it('returns an error string when no product is selected', () => {
    const err = validateWasteReport({ productId: '', reason: 'נשבר', qty: 1, product: mockProduct })
    expect(err).toBeTruthy()
  })

  it('returns an error string when reason is missing', () => {
    const err = validateWasteReport({ productId: 'p1', reason: '', qty: 1, product: mockProduct })
    expect(err).toBeTruthy()
  })

  it('returns an error when reported qty exceeds current product qty', () => {
    const err = validateWasteReport({ productId: 'p1', reason: 'נשבר', qty: 15, product: mockProduct })
    expect(err).toBeTruthy()
    expect(err).toContain('10') // mentions the actual stock qty
  })

  it('returns null when all fields are valid', () => {
    const err = validateWasteReport({ productId: 'p1', reason: 'פג תוקף', qty: 5, product: mockProduct })
    expect(err).toBeNull()
  })

  it('returns null when qty exactly equals product qty', () => {
    const err = validateWasteReport({ productId: 'p1', reason: 'גניבה', qty: 10, product: mockProduct })
    expect(err).toBeNull()
  })

  it('returns an error when qty is less than 1', () => {
    const err = validateWasteReport({ productId: 'p1', reason: 'נשבר', qty: 0, product: mockProduct })
    expect(err).toBeTruthy()
  })
})

// ── submitWasteReport ─────────────────────────────────────────────────────────

describe('submitWasteReport', () => {
  const baseArgs = {
    productId: 'p1',
    qty: 3,
    reason: 'פג תוקף',
    notes: '',
    userId: 'u1',
    businessId: 'b1',
    currentQty: 10,
  }

  it('decreases the product qty by the reported amount', async () => {
    const okChain = makeChain({ data: null, error: null })
    supabase.from.mockReturnValue(okChain)

    const newQty = await submitWasteReport(baseArgs)

    expect(newQty).toBe(7) // 10 - 3
  })

  it('inserts into waste_reports with the correct payload', async () => {
    const okChain = makeChain({ data: null, error: null })
    supabase.from.mockReturnValue(okChain)

    await submitWasteReport(baseArgs)

    expect(okChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: 'p1', qty: 3, reason: 'פג תוקף' })
    )
  })

  it('throws when the waste_reports insert fails', async () => {
    const failChain = makeChain({ data: null, error: { message: 'Insert failed' } })
    const okChain   = makeChain({ data: null, error: null })

    supabase.from
      .mockReturnValueOnce(failChain) // waste_reports insert
      .mockReturnValueOnce(okChain)   // products update

    await expect(submitWasteReport(baseArgs)).rejects.toMatchObject({ message: 'Insert failed' })
  })

  it('throws when the products update fails', async () => {
    const okChain   = makeChain({ data: null, error: null })
    const failChain = makeChain({ data: null, error: { message: 'Update failed' } })

    supabase.from
      .mockReturnValueOnce(okChain)   // waste_reports insert
      .mockReturnValueOnce(failChain) // products update

    await expect(submitWasteReport(baseArgs)).rejects.toMatchObject({ message: 'Update failed' })
  })

  it('does not allow reported qty to exceed current product qty (validation guard)', () => {
    // validateWasteReport must catch this before submitWasteReport is called
    const err = validateWasteReport({
      productId: 'p1',
      reason: 'נשבר',
      qty: 20,
      product: mockProduct, // qty: 10
    })
    expect(err).not.toBeNull()
  })

  it('requires a reason before submission (validation guard)', () => {
    const err = validateWasteReport({
      productId: 'p1',
      reason: '',
      qty: 3,
      product: mockProduct,
    })
    expect(err).not.toBeNull()
  })
})
