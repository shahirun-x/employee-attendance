import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import { fetchTodayStatus, checkIn, checkOut } from '../store/slices/attendanceSlice'
import { formatTime, formatHours } from '../utils/formatters'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function MarkAttendance() {
  let dispatch = useDispatch()
  let { todayStatus, loading } = useSelector(s => s.attendance)

  useEffect(() => {
    dispatch(fetchTodayStatus())
  }, [dispatch])

  async function doCheckIn() {
    let res = await dispatch(checkIn())
    if (checkIn.fulfilled.match(res)) {
      toast.success('Checked in successfully!')
      dispatch(fetchTodayStatus())
    } else {
      toast.error(res.payload)
    }
  }

  async function doCheckOut() {
    let res = await dispatch(checkOut())
    if (checkOut.fulfilled.match(res)) {
      toast.success('Checked out successfully!')
      dispatch(fetchTodayStatus())
    } else {
      toast.error(res.payload)
    }
  }

  if (loading && !todayStatus) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  let checkedIn = !!todayStatus?.checkInTime
  let checkedOut = !!todayStatus?.checkOutTime

  let todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Mark Attendance</h1>
        <p className="page-subtitle">{todayStr}</p>
      </div>

      {/* Check In/Out Actions */}
      <Card>
        <div className="flex flex-col items-center py-12 space-y-8">
          <div className="text-center max-w-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 mx-auto mb-4">
              <FiClock className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {!checkedIn ? 'Ready to start your day?' : checkedOut ? 'You are done for today!' : 'Currently working'}
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              {!checkedIn ? 'Check in to record your attendance' : checkedOut ? 'See you tomorrow!' : 'Don\'t forget to check out when you finish'}
            </p>
            {todayStatus && (
              <div className="flex justify-center">
                <Badge status={todayStatus.status} />
              </div>
            )}
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Button variant="success" disabled={checkedIn} onClick={doCheckIn} className="px-8 py-3 text-base">
              <FiCheckCircle className="h-5 w-5" /> Check In
            </Button>
            <Button variant="danger" disabled={!checkedIn || checkedOut} onClick={doCheckOut} className="px-8 py-3 text-base">
              <FiXCircle className="h-5 w-5" /> Check Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Summary */}
      {todayStatus && (
        <Card title="Today's Summary">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="py-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Check In Time</p>
              <p className="text-xl font-bold text-slate-900">{formatTime(todayStatus.checkInTime) || 'Not yet'}</p>
            </div>
            <div className="border-l border-r border-slate-200 py-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Check Out Time</p>
              <p className="text-xl font-bold text-slate-900">{formatTime(todayStatus.checkOutTime) || 'Not yet'}</p>
            </div>
            <div className="py-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Hours Worked</p>
              <p className="text-xl font-bold text-slate-900">{formatHours(todayStatus.totalHours)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
