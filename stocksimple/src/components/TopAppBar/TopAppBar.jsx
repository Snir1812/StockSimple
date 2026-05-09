import { useAuth } from '../../context/AuthContext'

export default function TopAppBar() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 w-full h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-row-reverse justify-between items-center px-4 md:pr-[256px] z-40">
      <div className="flex items-center gap-3">
        <span className="text-xl font-black text-blue-700 font-['Rubik'] md:hidden">StockSimple</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
          notifications
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
          {user.initials}
        </div>
      </div>
    </header>
  )
}
