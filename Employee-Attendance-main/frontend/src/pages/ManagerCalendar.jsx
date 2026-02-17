import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { fetchTeamSummary } from '../store/slices/managerSlice'
import { getMonthName } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

export default function ManagerCalendar() {
  let dispatch = useDispatch()
  let { teamSummary, loading } = useSelector(s => s.manager)

  let now = new Date()
  let [year, setYear] = useState(now.getFullYear())
  let [month, setMonth] = useState(now.getMonth() + 1)

  useEffect(() => {
    dispatch(fetchTeamSummary({ year, month }))
  }, [dispatch, year, month])

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  let summary = teamSummary?.summary || []

  // color coding helper
  function getStatusColor(pct) {
    if (pct >= 90) return 'bg-emerald-100 text-emerald-700'
    if (pct >= 70) return 'bg-amber-100 text-amber-700'
    if (pct >= 50) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Team Calendar View</h1>
        <p className="page-subtitle">Monthly attendance overview for each team member</p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevMonth}>
          <FiChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <h2 className="text-xl font-semibold text-slate-900">{getMonthName(month)} {year}</h2>
        <Button variant="outline" onClick={nextMonth}>
          Next <FiChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-6">
        {Object.entries(STATUS_COLORS).map(([status, colors]) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${colors.dot}`} />
            <span className="text-sm text-slate-600 capitalize font-medium">{status.replace('-', ' ')}</span>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <Card>
          {summary.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-12">No employee data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide sticky left-0 bg-slate-100 z-10">Employee</th>
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Department</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-700 uppercase tracking-widest">Present</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-amber-700 uppercase tracking-widest">Late</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-orange-700 uppercase tracking-widest">Half Day</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-red-700 uppercase tracking-widest">Absent</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-widest">Hours</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-widest">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.map(item => {
                    let emp = item.employee
                    return (
                      <tr key={emp._id} className="table-row">
                        <td className="px-6 py-4 sticky left-0 bg-white hover:bg-indigo-50 z-10">
                          <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.employeeId}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{emp.department}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">{item.present}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 text-sm font-bold">{item.late}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 text-orange-700 text-sm font-bold">{item.halfDay}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 text-red-700 text-sm font-bold">{item.absent}</span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-slate-900 font-semibold">{item.totalHours}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(item.attendancePercentage)}`}>
                            {item.attendancePercentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
