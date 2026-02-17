import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'
import { fetchTeamCalendar } from '../store/slices/attendanceSlice'
import { DEPARTMENTS, STATUS_COLORS } from '../utils/constants'
import { getMonthName, formatStatusLabel } from '../utils/formatters'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function TeamCalendar() {
  let dispatch = useDispatch()
  let { teamCalendar, loading } = useSelector(s => s.attendance)

  let now = new Date()
  let [year, setYear] = useState(now.getFullYear())
  let [month, setMonth] = useState(now.getMonth() + 1)
  let [dept, setDept] = useState('')

  useEffect(() => {
    let params = { year, month }
    if (dept) params.department = dept
    dispatch(fetchTeamCalendar(params))
  }, [dispatch, year, month, dept])

  function goBack() {
    if (month === 1) { setMonth(12); setYear(year - 1) }
    else setMonth(month - 1)
  }
  function goForward() {
    if (month === 12) { setMonth(1); setYear(year + 1) }
    else setMonth(month + 1)
  }

  // figure out days in the month
  let totalDays = new Date(year, month, 0).getDate()
  let days = Array.from({ length: totalDays }, (_, i) => i + 1)

  let employees = teamCalendar?.employees || []

  // build attendance lookup per employee: { empId -> { day -> status } }
  let lookup = useMemo(() => {
    let map = {}
    for (let emp of employees) {
      let dayMap = {}
      for (let rec of emp.records) {
        let d = new Date(rec.date).getDate()
        dayMap[d] = rec.status
      }
      map[emp.user.employeeId] = dayMap
    }
    return map
  }, [employees])

  // short status labels for grid cells
  function shortLabel(status) {
    if (!status) return ''
    let labels = { present: 'P', absent: 'A', late: 'L', 'half-day': 'H' }
    return labels[status] || status[0].toUpperCase()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Team Calendar</h1>
        <p className="page-subtitle">Monthly attendance overview for all team members</p>
      </div>

      <Card>
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="rounded-lg p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-900 min-w-[160px] text-center">
              {getMonthName(month)} {year}
            </h2>
            <button onClick={goForward} className="rounded-lg p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
          <Select value={dept} onChange={e => setDept(e.target.value)}
            options={DEPARTMENTS} placeholder="All Departments" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6 text-xs">
          {Object.entries(STATUS_COLORS).map(([st, clr]) => (
            <span key={st} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded ${clr.dot}`} />
              <span className="font-medium text-slate-600">{formatStatusLabel(st)}</span>
            </span>
          ))}
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-slate-200" />
            <span className="font-medium text-slate-600">No Record</span>
          </span>
        </div>

        {loading ? <Spinner /> : employees.length === 0 ? (
          <EmptyState icon={<FiCalendar className="h-12 w-12" />}
            title="No data" description="No attendance records found for this period." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="table-header">
                  <th className="table-cell text-left font-semibold text-slate-600 sticky left-0 bg-slate-100 z-10 min-w-[140px]">Employee</th>
                  {days.map(d => (
                    <th key={d} className="px-2 py-3 text-center font-semibold text-slate-600 uppercase text-xs tracking-widest min-w-[32px]">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  let empDays = lookup[emp.user.employeeId] || {}
                  return (
                    <tr key={emp.user.employeeId} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 sticky left-0 bg-white hover:bg-indigo-50 whitespace-nowrap z-10">
                        <div>{emp.user.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{emp.user.employeeId}</div>
                      </td>
                      {days.map(d => {
                        let st = empDays[d]
                        let clr = st ? STATUS_COLORS[st] : null
                        return (
                          <td key={d} className="px-1 py-2 text-center">
                            {st ? (
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition-all ${clr.bg} ${clr.text}`}
                                title={`${formatStatusLabel(st)} - Day ${d}`}>
                                {shortLabel(st)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-400">-</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
