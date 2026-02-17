import { STATUS_COLORS } from '../../utils/constants'
import { formatStatusLabel } from '../../utils/formatters'

export default function Badge({ status, className = '' }) {
  let c = STATUS_COLORS[status] || { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${c.dot}`} />
      {formatStatusLabel(status)}
    </span>
  )
}
