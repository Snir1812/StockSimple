import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'בית', icon: 'home', to: '/dashboard' },
  { label: 'מלאי', icon: 'inventory_2', to: '/inventory' },
  { label: 'הזמנות', icon: 'shopping_cart', to: '/orders' },
  { label: 'דוחות', icon: 'bar_chart', to: '/reports' },
]

export default function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex flex-row-reverse justify-around items-center h-16 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 font-['Rubik']">
      {navItems.map(({ label, icon, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-blue-700' : 'text-slate-400'}`
          }
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="text-[10px] font-medium mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
