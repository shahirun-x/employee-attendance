import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FiCheckCircle, FiXCircle, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'
import { fetchDashboard, checkIn, checkOut } from '../store/slices/attendanceSlice'
import { formatTime, formatHours, formatShortDate, formatStatusLabel } from '../utils/formatters'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'

export default function Dashboard() {
  let dispatch = useDispatch()
  let { user } = useSelector(s => s.auth)
  let { dashboard, loading } = useSelector(s => s.attendance)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  async function doCheckIn() {
    let res = await dispatch(checkIn())
    if (checkIn.fulfilled.match(res)) {
      toast.success('Checked in!')
      dispatch(fetchDashboard())
    } else {
      toast.error(res.payload)
    }
  }

  async function doCheckOut() {
    let res = await dispatch(checkOut())
    if (checkOut.fulfilled.match(res)) {
      toast.success('Checked out!')
      dispatch(fetchDashboard())
    } else {
      toast.error(res.payload)
    }
  }

  if (loading && !dashboard) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  let today = dashboard?.today
  let stats = dashboard?.monthStats
  let recent = dashboard?.recentAttendance || []

  let checkedIn = !!today?.checkInTime
  let checkedOut = !!today?.checkOutTime

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}. Here&apos;s your attendance overview.</p>
      </div>

      {/* Today's Status Card */}
      <Card title="Today's Attendance" subtitle="Current check-in/out status">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center pb-6">
          <div className="border-r border-slate-200 last:border-r-0">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Status</p>
            {today ? <Badge status={today.status} /> : <span className="text-sm text-slate-600">Not checked in</span>}
          </div>
          <div className="border-r border-slate-200 last:border-r-0">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Check In</p>
            <p className="text-lg font-bold text-slate-900">{formatTime(today?.checkInTime)}</p>
          </div>
          <div className="border-r border-slate-200 last:border-r-0">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Check Out</p>
            <p className="text-lg font-bold text-slate-900">{formatTime(today?.checkOutTime)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Hours Worked</p>
            <p className="text-lg font-bold text-slate-900">{formatHours(today?.totalHours)}</p>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-6 border-t border-slate-200">
          <Button variant="success" disabled={checkedIn} onClick={doCheckIn}>
            <FiCheckCircle className="h-4 w-4" /> Check In
          </Button>
          <Button variant="danger" disabled={!checkedIn || checkedOut} onClick={doCheckOut}>
            <FiXCircle className="h-4 w-4" /> Check Out
          </Button>
        </div>
      </Card>

      {/* Monthly Statistics */}
      {stats && (
        <div className="space-y-8">
          <div>
            <h2 className="section-title">Monthly Statistics</h2>
            <p className="section-subtitle">Your attendance breakdown for this month</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard label="Present" value={stats.present} color="emerald" icon={<FiCheckCircle className="h-6 w-6" />} />
            <StatCard label="Late" value={stats.late} color="amber" icon={<FiClock className="h-6 w-6" />} />
            <StatCard label="Half Day" value={stats.halfDay} color="orange" icon={<FiAlertCircle className="h-6 w-6" />} />
            <StatCard label="Absent" value={stats.absent} color="red" icon={<FiXCircle className="h-6 w-6" />} />
            <StatCard label="Total Hours" value={formatHours(stats.totalHours)} color="primary"
              icon={<FiTrendingUp className="h-6 w-6" />} />
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      {recent.length > 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="section-title">Recent Attendance</h2>
            <p className="section-subtitle">Last 7 days of attendance records</p>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Date</th>
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Check In</th>
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Check Out</th>
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Hours</th>
                    <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map(rec => (
                    <tr key={rec._id} className="table-row">
                      <td className="table-cell text-slate-900 font-medium">{formatShortDate(rec.date)}</td>
                      <td className="table-cell table-cell-muted">{formatTime(rec.checkInTime)}</td>
                      <td className="table-cell table-cell-muted">{formatTime(rec.checkOutTime)}</td>
                      <td className="table-cell table-cell-muted font-medium">{formatHours(rec.totalHours)}</td>
                      <td className="table-cell"><Badge status={rec.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
