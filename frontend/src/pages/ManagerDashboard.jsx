import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle } from 'react-icons/fi'
import { fetchManagerDashboard } from '../store/slices/managerSlice'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'

export default function ManagerDashboard() {
  let dispatch = useDispatch()
  let { dashboard, loading } = useSelector(s => s.manager)

  useEffect(() => {
    dispatch(fetchManagerDashboard())
  }, [dispatch])

  if (loading && !dashboard) return <Spinner size="lg" />

  let today = dashboard?.todayStats || {}
  let weekly = dashboard?.weeklyTrend || []
  let deptStats = dashboard?.departmentStats || []
  let absentList = dashboard?.absentEmployees || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="page-subtitle">Monitor your team's attendance and performance metrics</p>
      </div>

      {/* top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Employees" value={dashboard?.totalEmployees || 0}
          color="indigo" icon={<FiUsers className="h-6 w-6" />} />
        <StatCard label="Present Today" value={today.present || 0}
          color="emerald" icon={<FiCheckCircle className="h-6 w-6" />} />
        <StatCard label="Absent Today" value={today.absent || 0}
          color="red" icon={<FiXCircle className="h-6 w-6" />} />
        <StatCard label="Late Today" value={today.late || 0}
          color="amber" icon={<FiClock className="h-6 w-6" />} />
        <StatCard label="Half Day" value={today.halfDay || 0}
          color="orange" icon={<FiAlertCircle className="h-6 w-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <Card title="Weekly Attendance Trend">
          {weekly.length > 0 ? (
            <div className="space-y-4">
              {weekly.map(day => {
                let total = dashboard?.totalEmployees || 1
                let pct = Math.round((day.present / total) * 100)
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 w-12">{day.day}</span>
                    <div className="flex-1 bg-indigo-50 rounded-full h-8 relative overflow-hidden shadow-sm">
                      <div className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-3"
                        style={{ width: `${Math.max(day.present, 8) / (dashboard?.totalEmployees || 1) * 100}%`, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}>
                        <span className="text-xs font-semibold text-white">{day.present}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-12 text-right">{Math.round((day.present / (dashboard?.totalEmployees || 1)) * 100)}%</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-600 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Department-wise Attendance */}
        <Card title="Department-wise Attendance">
          {deptStats.length > 0 ? (
            <div className="space-y-4">
              {deptStats.map(dept => {
                let pct = dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0
                return (
                  <div key={dept.department} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-900 w-28 truncate">{dept.department}</span>
                    <div className="flex-1 bg-indigo-50 rounded-full h-8 relative overflow-hidden shadow-sm">
                      <div className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-3"
                        style={{ width: `${Math.max(pct, 8)}%`, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}>
                        <span className="text-xs font-semibold text-white">{dept.present}/{dept.total}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-12 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-600 text-center py-8">No data available</p>
          )}
        </Card>
      </div>

      {/* Absent Employees Table */}
      <Card title="Absent Employees Today">
        {absentList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Name</th>
                  <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Employee ID</th>
                  <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Department</th>
                  <th className="table-cell text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absentList.map(emp => (
                  <tr key={emp._id} className="table-row">
                    <td className="table-cell text-slate-900 font-medium">{emp.name}</td>
                    <td className="table-cell table-cell-muted">{emp.employeeId}</td>
                    <td className="table-cell table-cell-muted">{emp.department}</td>
                    <td className="table-cell"><Badge status="absent" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-emerald-600 text-center py-8 font-medium">✓ All employees are present today!</p>
        )}
      </Card>
    </div>
  )
}
