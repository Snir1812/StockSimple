import { supabase } from './supabase'

/**
 * Returns a Hebrew error string if the report is invalid, or null if valid.
 */
export function validateWasteReport({ productId, reason, qty, product }) {
  if (!productId) return 'יש לבחור מוצר'
  if (!reason) return 'יש לבחור סיבת פחת'
  if (qty < 1) return 'הכמות חייבת להיות לפחות 1'
  if (product && qty > product.qty) {
    return `הכמות המדווחת (${qty}) עולה על המלאי הקיים (${product.qty} ${product.unit})`
  }
  return null
}

/**
 * Inserts a waste report and decrements the product qty atomically.
 * Returns the new product qty on success, throws on error.
 */
export async function submitWasteReport({ productId, qty, reason, notes, userId, businessId, currentQty }) {
  const newQty = Math.max(0, currentQty - qty)

  const [reportRes, updateRes] = await Promise.all([
    supabase.from('waste_reports').insert({
      product_id: productId,
      qty,
      reason,
      notes: notes || null,
      reported_by: userId,
      business_id: businessId,
    }),
    supabase.from('products').update({ qty: newQty }).eq('id', productId),
  ])

  if (reportRes.error) throw reportRes.error
  if (updateRes.error) throw updateRes.error
  return newQty
}
