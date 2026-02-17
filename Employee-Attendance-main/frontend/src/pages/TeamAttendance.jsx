import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUsers, FiSearch } from 'react-icons/fi'
import { fetchTeamAttendance } from '../store/slices/attendanceSlice'
import { DEPARTMENTS, ATTENDANCE_STATUS } from '../utils/constants'
import { formatTime, formatHours } from '../utils/formatters'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Select from '../components/ui/Select'

export default function TeamAttendance() {
  let dispatch = useDispatch()
  let { teamRecords, loading } = useSelector(s => s.attendance)

  let [date, setDate] = useState(new Date().toISOString().split('T')[0])
  let [dept, setDept] = useState('')
  let [status, setStatus] = useState('')
  let [search, setSearch] = useState('')
  let [searchDebounce, setSearchDebounce] = useState('')

  // debounce the search input
  useEffect(() => {
    let timer = setTimeout(() => setSearchDebounce(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let params = { date }
    if (dept) params.department = dept
    if (status) params.status = status
    if (searchDebounce.trim()) params.employee = searchDebounce.trim()
    dispatch(fetchTeamAttendance(params))
  }, [dispatch, date, dept, status, searchDebounce])

  let statusOptions = Object.values(ATTENDANCE_STATUS).map(s => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Team Attendance</h1>
        <p className="page-subtitle">View and monitor attendance records for your team</p>
      </div>

      {/* Filter Card */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="form-group">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="input-field" />
          </div>
          <Select label="Department" value={dept} onChange={e => setDept(e.target.value)}
            options={DEPARTMENTS} placeholder="All Departments" />
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value)}
            options={statusOptions} placeholder="All Statuses" />
          <div className="form-group">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Search Employee</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Name or ID..." className="input-field pl-9" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">{teamRecords.total} records</span>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        {loading ? <div className="flex justify-center py-12"><Spinner /></div> : teamRecords.records.length === 0 ? (
          <EmptyState icon={<FiUsers className="h-12 w-12" />}
            title="No records found" description="No attendance records match your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  {['Employee', 'ID', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'].map(h => (
                    <th key={h} className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamRecords.records.map(rec => (
                  <tr key={rec._id} className="table-row">
                    <td className="table-cell font-semibold text-slate-900">{rec.user?.name}</td>
                    <td className="table-cell text-slate-600 font-mono text-xs">{rec.user?.employeeId}</td>
                    <td className="table-cell table-cell-muted">{rec.user?.department}</td>
                    <td className="table-cell table-cell-muted">{formatTime(rec.checkInTime)}</td>
                    <td className="table-cell table-cell-muted">{formatTime(rec.checkOutTime)}</td>
                    <td className="table-cell table-cell-muted">{formatHours(rec.totalHours)}</td>
                    <td className="table-cell"><Badge status={rec.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
