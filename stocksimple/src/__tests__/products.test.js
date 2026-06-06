import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStatus, fetchProducts, addProduct, updateProductQty } from '../lib/inventory'

// ── Supabase mock ─────────────────────────────────────────────────────────────

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

import { supabase } from '../lib/supabase'

/**
 * Builds a chainable Supabase query mock that resolves to `result`.
 * Every builder method returns the same chain object, making it awaitable
 * both directly (Promise.all) and via .single().
 */
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

// ── getStatus ─────────────────────────────────────────────────────────────────

describe('getStatus', () => {
  it('returns "error" when qty is 0', () => {
    expect(getStatus({ qty: 0, min_qty: 5 })).toBe('error')
  })

  it('returns "warning" when qty > 0 but qty < min_qty', () => {
    expect(getStatus({ qty: 2, min_qty: 5 })).toBe('warning')
    expect(getStatus({ qty: 1, min_qty: 100 })).toBe('warning')
  })

  it('returns "ok" when qty equals min_qty', () => {
    expect(getStatus({ qty: 5, min_qty: 5 })).toBe('ok')
  })

  it('returns "ok" when qty exceeds min_qty', () => {
    expect(getStatus({ qty: 20, min_qty: 5 })).toBe('ok')
  })
})

// ── fetchProducts ─────────────────────────────────────────────────────────────

describe('fetchProducts', () => {
  it('returns an array of products', async () => {
    const mockData = [
      { id: '1', name: 'חלב', qty: 10, min_qty: 5 },
      { id: '2', name: 'לחם', qty: 2,  min_qty: 10 },
    ]
    supabase.from.mockReturnValue(makeChain({ data: mockData, error: null }))

    const result = await fetchProducts()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('חלב')
  })

  it('queries the products table', async () => {
    supabase.from.mockReturnValue(makeChain({ data: [], error: null }))
    await fetchProducts()
    expect(supabase.from).toHaveBeenCalledWith('products')
  })

  it('throws when Supabase returns an error', async () => {
    supabase.from.mockReturnValue(makeChain({ data: null, error: { message: 'DB unavailable' } }))
    await expect(fetchProducts()).rejects.toMatchObject({ message: 'DB unavailable' })
  })
})

// ── addProduct ────────────────────────────────────────────────────────────────

describe('addProduct', () => {
  it('calls insert with the product data', async () => {
    const newProduct = { name: 'עגבנייה', qty: 20, min_qty: 5, business_id: 'b1' }
    const chain = makeChain({ data: null, error: null })
    supabase.from.mockReturnValue(chain)

    await addProduct(newProduct)

    expect(chain.insert).toHaveBeenCalledWith(newProduct)
  })

  it('increases the list count after adding', async () => {
    const existingProducts = [{ id: '1', name: 'חלב', qty: 10, min_qty: 5 }]
    const newProduct       = { id: '2', name: 'לחם', qty: 5,  min_qty: 3  }

    supabase.from
      .mockReturnValueOnce(makeChain({ data: null, error: null }))          // insert
      .mockReturnValueOnce(makeChain({ data: [...existingProducts, newProduct], error: null })) // fetch

    await addProduct(newProduct)
    const products = await fetchProducts()

    expect(products).toHaveLength(2)
  })

  it('throws when insert fails', async () => {
    supabase.from.mockReturnValue(makeChain({ data: null, error: { message: 'Duplicate SKU' } }))
    await expect(addProduct({ name: 'X' })).rejects.toMatchObject({ message: 'Duplicate SKU' })
  })
})

// ── updateProductQty ──────────────────────────────────────────────────────────

describe('updateProductQty', () => {
  it('calls update on the products table with the new qty', async () => {
    const chain = makeChain({ data: null, error: null })
    supabase.from.mockReturnValue(chain)

    await updateProductQty('prod-123', 7)

    expect(supabase.from).toHaveBeenCalledWith('products')
    expect(chain.update).toHaveBeenCalledWith({ qty: 7 })
  })

  it('targets the correct product id', async () => {
    const chain = makeChain({ data: null, error: null })
    supabase.from.mockReturnValue(chain)

    await updateProductQty('prod-123', 7)

    expect(chain.eq).toHaveBeenCalledWith('id', 'prod-123')
  })

  it('throws when the update fails', async () => {
    supabase.from.mockReturnValue(makeChain({ data: null, error: { message: 'Update failed' } }))
    await expect(updateProductQty('id-1', 5)).rejects.toMatchObject({ message: 'Update failed' })
  })
})
