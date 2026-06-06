export function formatPhoneForWhatsApp(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) return digits
  if (digits.startsWith('0')) return '972' + digits.slice(1)
  return digits
}

export function buildWhatsAppUrl(supplier, products) {
  const lines = products
    .map(p => `- ${p.name}: ${p.needed} ${p.unit}`)
    .join('\n')
  const message = `שלום,\nאני צריך להזמין:\n${lines}`
  const phone = formatPhoneForWhatsApp(supplier.phone ?? '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Filters products to only those below min_qty with a supplier,
 * then groups them into [{ supplier, products }] entries.
 */
export function groupProductsBySupplier(products) {
  const lowStock = products
    .filter(p => p.qty < p.min_qty && p.supplier_id && p.suppliers)
    .map(p => ({ ...p, needed: p.min_qty - p.qty }))

  const groupMap = new Map()
  for (const p of lowStock) {
    const sid = p.supplier_id
    if (!groupMap.has(sid)) groupMap.set(sid, { supplier: p.suppliers, products: [] })
    groupMap.get(sid).products.push(p)
  }

  return [...groupMap.values()]
}
