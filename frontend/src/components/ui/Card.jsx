export default function Card({ title, subtitle, children, className = '', headerAction }) {
  return (
    <div className={`card ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-100/50">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
