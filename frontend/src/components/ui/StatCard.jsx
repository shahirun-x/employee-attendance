const iconBoxColors = {
  primary: 'bg-amber-100 text-[#C49A57]',
  gold: 'bg-amber-100 text-[#C49A57]',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
  blue: 'bg-blue-100 text-blue-600',
  teal: 'bg-teal-100 text-teal-600'
}

export default function StatCard({ label, value, icon, color = 'primary', subtitle }) {
  let boxClr = iconBoxColors[color] || iconBoxColors.primary

  return (
    <div className="card p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default border-amber-100/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-5xl font-bold text-gray-900 mt-3 leading-tight">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-3">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl ${boxClr}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
