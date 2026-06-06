/**
 * Derives dashboard KPIs from a flat products array.
 * Pure function — no Supabase calls.
 */
export function computeDashboardStats(products) {
  return {
    total: products.length,
    shortageCount: products.filter(p => p.qty === 0).length,
    warningCount:  products.filter(p => p.qty > 0 && p.qty < p.min_qty).length,
  }
}
