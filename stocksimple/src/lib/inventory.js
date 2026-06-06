import { supabase } from './supabase'

export function getStatus(product) {
  if (product.qty === 0) return 'error'
  if (product.qty < product.min_qty) return 'warning'
  return 'ok'
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('name')
  if (error) throw error
  return data
}

export async function addProduct(product) {
  const { error } = await supabase.from('products').insert(product)
  if (error) throw error
}

export async function updateProductQty(productId, newQty) {
  const { error } = await supabase
    .from('products')
    .update({ qty: newQty })
    .eq('id', productId)
  if (error) throw error
}
