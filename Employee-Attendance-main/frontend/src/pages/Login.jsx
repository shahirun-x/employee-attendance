import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import { validateEmail, validatePassword, validateForm } from '../utils/validators'
import { FiCheckSquare } from 'react-icons/fi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { user, loading, error } = useSelector(s => s.auth)

  let [form, setForm] = useState({ email: '', password: '' })
  let [errors, setErrors] = useState({})

  useEffect(() => { if (user) navigate('/dashboard') }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  function onChange(e) {
    let { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function onSubmit(e) {
    e.preventDefault()
    let result = validateForm(form, { email: validateEmail, password: validatePassword })
    if (!result.isValid) return setErrors(result.errors)
    dispatch(loginUser(form))
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 mx-auto mb-4 shadow-lg">
            <FiCheckSquare className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AttendanceHQ</h1>
          <p className="text-slate-600 mt-2 text-sm">Sign in to access your attendance dashboard</p>
        </div>

        {/* Login Card */}
        <div className="card shadow-md p-8 space-y-6 border border-indigo-100">
          <form onSubmit={onSubmit} className="space-y-5">
            <Input 
              label="Email Address" 
              name="email" 
              type="email"
              value={form.email} 
              onChange={onChange} 
              error={errors.email}
              placeholder="you@company.com" 
              autoComplete="email" 
            />

            <Input 
              label="Password" 
              name="password" 
              type="password"
              value={form.password} 
              onChange={onChange} 
              error={errors.password}
              placeholder="Enter your password" 
              autoComplete="current-password" 
            />

            <Button 
              type="submit" 
              variant="primary" 
              loading={loading} 
              className="w-full py-3 text-base"
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <div className="pt-4 border-t border-indigo-100 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-violet-700 transition-all"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-8">
          © 2026 AttendanceHQ. All rights reserved.
        </p>
      </div>
    </div>
  )
}
