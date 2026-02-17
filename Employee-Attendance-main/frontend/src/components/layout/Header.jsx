import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi'
import { logout } from '../../store/slices/authSlice'

export default function Header({ onMenuClick }) {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { user } = useSelector(s => s.auth)

  function doLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/30 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Menu Button - Mobile Only */}
        <button 
          onClick={onMenuClick} 
          className="rounded-lg p-2 text-gray-600 hover:bg-amber-50 hover:text-amber-600 lg:hidden transition-colors"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Welcome Text - Desktop Only */}
        <div className="hidden lg:block">
          <p className="text-sm text-gray-600">
            Welcome back, <span className="font-semibold text-[#C49A57]">{user?.name}</span>
          </p>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Employee ID Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-200">
            <FiUser className="h-4 w-4 text-[#C49A57]" />
            <span className="text-sm font-medium text-gray-900">{user?.employeeId}</span>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={doLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
