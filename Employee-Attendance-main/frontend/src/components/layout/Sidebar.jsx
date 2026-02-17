import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiHome, FiClock, FiBarChart2, FiX, FiUser, FiCheckSquare, FiUsers, FiCalendar, FiDownload } from 'react-icons/fi'
import { ROLES } from '../../utils/constants'

const employeeLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/mark-attendance', label: 'Mark Attendance', icon: FiCheckSquare },
  { to: '/attendance', label: 'My Attendance', icon: FiClock },
  { to: '/profile', label: 'Profile', icon: FiUser }
]

const managerLinks = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/manager/attendance', label: 'All Attendance', icon: FiUsers },
  { to: '/manager/calendar', label: 'Team Calendar', icon: FiCalendar },
  { to: '/manager/reports', label: 'Reports', icon: FiDownload },
  { to: '/profile', label: 'Profile', icon: FiUser }
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useSelector(s => s.auth)

  let links = user?.role === ROLES.MANAGER ? managerLinks : employeeLinks

  function linkCls({ isActive }) {
    let base = 'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl mx-3'
    return isActive
      ? `${base} bg-[#C49A57] text-white shadow-md`
      : `${base} text-gray-300 hover:text-white hover:bg-white/10`
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" 
          onClick={onClose} 
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0F1115] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto overflow-y-auto border-r border-gray-700 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C49A57]">
              <FiCheckSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">AttendanceHQ</h1>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1 text-gray-400 hover:text-white lg:hidden transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 mt-6 px-2">
          {links.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={linkCls} 
              onClick={onClose}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4">
          <div className="rounded-xl bg-gray-800 p-4 border border-gray-700">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-[#C49A57]/20 text-[#C49A57] text-xs font-medium capitalize">
                {user?.role}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {user?.employeeId}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
