import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'לוח בקרה', icon: 'dashboard', to: '/dashboard' },
  { label: 'מלאי', icon: 'inventory_2', to: '/inventory' },
  { label: 'דיווח פחת', icon: 'delete_sweep', to: '/waste' },
  { label: 'הזמנות וספקים', icon: 'local_shipping', to: '/orders' },
  { label: 'דוחות', icon: 'bar_chart', to: '/reports' },
  { label: 'הגדרות', icon: 'settings', to: '/settings' },
  { label: 'פרופיל', icon: 'person', to: '/profile' },
]

export default function SideNavBar() {
  return (
    <aside className="hidden md:flex flex-col fixed right-0 top-0 h-screen z-50 bg-white w-[240px] border-l border-slate-200 font-['Rubik'] text-right">
      <div className="p-6">
        <span className="text-2xl font-black text-blue-700">StockSimple</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ label, icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
