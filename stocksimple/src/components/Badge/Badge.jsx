const variants = {
  ok: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-amber-800',
  error: 'bg-red-100 text-red-700',
}

const labels = {
  ok: 'תקין',
  warning: 'מלאי נמוך',
  error: 'חסר לחלוטין',
}

export default function Badge({ variant = 'ok', label }) {
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${variants[variant]}`}>
      {label || labels[variant]}
    </span>
  )
}
