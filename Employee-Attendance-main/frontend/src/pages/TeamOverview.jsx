import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiUsers } from 'react-icons/fi'
import { fetchTeamSummary } from '../store/slices/attendanceSlice'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'

export default function TeamOverview() {
  let dispatch = useDispatch()
  let { teamSummary, loading } = useSelector(s => s.attendance)

  useEffect(() => { dispatch(fetchTeamSummary()) }, [dispatch])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Team Overview</h1>
        <p className="page-subtitle">Real-time attendance summary across your entire team</p>
      </div>

      {loading ? <Spinner /> : teamSummary ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard label="Present" value={teamSummary.present} color="emerald" icon={<FiCheckCircle className="h-6 w-6" />} />
            <StatCard label="Late" value={teamSummary.late} color="amber" icon={<FiClock className="h-6 w-6" />} />
            <StatCard label="Half Day" value={teamSummary.halfDay} color="orange" icon={<FiAlertCircle className="h-6 w-6" />} />
            <StatCard label="Absent" value={teamSummary.absent} color="red" icon={<FiXCircle className="h-6 w-6" />} />
            <StatCard label="Total Records" value={teamSummary.total} color="indigo" icon={<FiUsers className="h-6 w-6" />} />
          </div>

          {/* Summary Card */}
          <Card title="Attendance Distribution Summary">
            <div className="text-center py-12">
              <FiUsers className="h-16 w-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Team Status</h3>
              <p className="text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Out of <span className="font-bold text-slate-900">{teamSummary.total}</span> total records today,{' '}
                <span className="font-bold text-emerald-600">{teamSummary.present + teamSummary.late}</span> employees are present
                {teamSummary.absent > 0 && (
                  <> and <span className="font-bold text-red-600">{teamSummary.absent}</span> are absent</>
                )}.
              </p>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-center text-slate-600 py-12 font-medium">No data available for today</p>
        </Card>
      )}
    </div>
  )
}
