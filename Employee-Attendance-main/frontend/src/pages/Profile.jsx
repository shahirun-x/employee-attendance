import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiMail, FiHash, FiBriefcase, FiShield } from 'react-icons/fi'
import { fetchProfile } from '../store/slices/authSlice'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'

export default function Profile() {
  let dispatch = useDispatch()
  let { user, loading } = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  if (loading && !user) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account and personal information</p>
      </div>

      {/* Account Information Card */}
      <Card title="Account Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <FiUser className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <FiMail className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
            </div>
          </div>

          {/* Employee ID */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <FiHash className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Employee ID</p>
              <p className="text-sm font-medium text-slate-900">{user?.employeeId}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <FiShield className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Role</p>
              <p className="text-sm font-medium text-slate-900 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex gap-4 md:col-span-2">
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiBriefcase className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Department</p>
              <p className="text-sm font-medium text-slate-900">{user?.department}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
