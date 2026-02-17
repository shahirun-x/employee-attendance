import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCalendar, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { fetchHistory, fetchMonthlySummary } from '../store/slices/attendanceSlice'
import { getMonthName, formatStatusLabel } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import CalendarView from '../components/attendance/CalendarView'
import TableView from '../components/attendance/TableView'

export default function Attendance() {
  let dispatch = useDispatch()
  let { history, monthlySummary, loading } = useSelector(s => s.attendance)

  let [view, setView] = useState('calendar')
  let now = new Date()
  let [year, setYear] = useState(now.getFullYear())
  let [month, setMonth] = useState(now.getMonth() + 1)

  let range = useMemo(() => {
    let start = new Date(year, month - 1, 1)
    let end = new Date(year, month, 0)
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }
  }, [year, month])

  useEffect(() => {
    dispatch(fetchHistory({ ...range, limit: 31 }))
    dispatch(fetchMonthlySummary({ year, month }))
  }, [dispatch, range, year, month])

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  let isCurrent = year === now.getFullYear() && month === now.getMonth() + 1

  // summary stats for quick glance
  let summaryData = monthlySummary?.data || monthlySummary || null
  let statItems = summaryData ? [
    { key: 'present', label: 'Present', value: summaryData.present || 0 },
    { key: 'late', label: 'Late', value: summaryData.late || 0 },
    { key: 'half-day', label: 'Half Day', value: summaryData.halfDay || 0 },
    { key: 'absent', label: 'Absent', value: summaryData.absent || 0 }
  ] : []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendance History</h1>
          <p className="page-subtitle">View and track your attendance records</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl shadow-md border border-indigo-100 p-1">
          <button 
            onClick={() => setView('calendar')}
            className={`rounded-lg px-3 py-2 transition-all duration-200 font-semibold ${
              view === 'calendar' 
                ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm border border-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </div>
          </button>
          <button 
            onClick={() => setView('table')}
            className={`rounded-lg px-3 py-2 transition-all duration-200 font-semibold ${
              view === 'table' 
                ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm border border-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiList className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </div>
          </button>
        </div>
      </div>

      {/* Monthly Summary Stats */}
      {statItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {statItems.map(item => {
            let clr = STATUS_COLORS[item.key] || STATUS_COLORS.absent
            return (
              <div key={item.key} className={`rounded-lg px-4 py-4 border ${clr.bg} border-opacity-50`}>
                <p className={`text-xs font-semibold ${clr.text} opacity-70 uppercase tracking-wide mb-1`}>
                  {item.label}
                </p>
                <p className={`text-3xl font-bold ${clr.text}`}>{item.value}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Calendar/Table Card */}
      <Card>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 px-6 py-5 border-b border-indigo-100">
          <button 
            onClick={prevMonth} 
            className="rounded-lg p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900 min-w-max">
            {getMonthName(month)} {year}
          </h2>
          <button 
            onClick={nextMonth} 
            disabled={isCurrent}
            className="rounded-lg p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* View Content */}
        <div className="px-6 pb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : view === 'calendar' ? (
            <CalendarView year={year} month={month} records={history.records} />
          ) : (
            <TableView records={history.records} />
          )}
        </div>
      </Card>
    </div>
  )
}
