import Badge from '../Badge/Badge'

export default function ProductCard({ name, sku, qty, unit = 'יח׳', status }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center transition-all active:scale-[0.98] cursor-pointer">
      <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-slate-400 text-3xl">inventory_2</span>
      </div>
      <div className="flex-1 text-right">
        <h3 className="font-bold text-slate-900">{name}</h3>
        <p className="text-xs text-slate-500">קוד מוצר: {sku}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-slate-700">כמות: {qty} {unit}</span>
          <Badge variant={status} />
        </div>
      </div>
      <span className="material-symbols-outlined text-slate-300">chevron_left</span>
    </div>
  )
}
