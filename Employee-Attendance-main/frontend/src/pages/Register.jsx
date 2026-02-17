import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import { validateEmail, validatePassword, validateName, validateRequired, validateForm } from '../utils/validators'
import { DEPARTMENTS, ROLES } from '../utils/constants'
import { FiCheckSquare } from 'react-icons/fi'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'

export default function Register() {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { user, loading, error } = useSelector(s => s.auth)

  let [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', role: ''
  })
  let [errors, setErrors] = useState({})

  useEffect(() => { if (user) navigate('/dashboard') }, [user, navigate])
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  function handleChange(e) {
    let { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    let validation = validateForm(form, {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: v => v !== form.password ? 'Passwords do not match' : '',
      department: v => validateRequired(v, 'Department'),
      role: v => validateRequired(v, 'Role')
    })

    if (!validation.isValid) return setErrors(validation.errors)

    // strip confirmPassword before sending
    let { confirmPassword: _, ...data } = form
    dispatch(registerUser(data))
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50">
      <div className="w-full max-w-lg">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 mx-auto mb-4 shadow-lg">
            <FiCheckSquare className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AttendanceHQ</h1>
          <p className="text-slate-600 mt-2 text-sm">Create your admin account</p>
        </div>

        {/* Register Card */}
        <div className="card shadow-md p-8 border border-indigo-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <Input 
              label="Full Name" 
              name="name" 
              value={form.name}
              onChange={handleChange} 
              error={errors.name} 
              placeholder="John Doe" 
            />

            {/* Email */}
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              value={form.email}
              onChange={handleChange} 
              error={errors.email} 
              placeholder="you@company.com" 
            />

            {/* Department & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select 
                label="Department" 
                name="department" 
                value={form.department}
                onChange={handleChange} 
                error={errors.department} 
                options={DEPARTMENTS}
                placeholder="Select department" 
              />
              <Select 
                label="Role" 
                name="role" 
                value={form.role}
                onChange={handleChange} 
                error={errors.role}
                options={[
                  { value: ROLES.EMPLOYEE, label: 'Employee' }, 
                  { value: ROLES.MANAGER, label: 'Manager' }
                ]}
                placeholder="Select role" 
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Password" 
                name="password" 
                type="password" 
                value={form.password}
                onChange={handleChange} 
                error={errors.password} 
                placeholder="Min 6 characters" 
              />
              <Input 
                label="Confirm Password" 
                name="confirmPassword" 
                type="password"
                value={form.confirmPassword} 
                onChange={handleChange} 
                error={errors.confirmPassword}
                placeholder="Re-enter password" 
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading} 
              className="w-full py-3 text-base"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="pt-4 border-t border-indigo-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-violet-700 transition-all"
              >
                Sign in
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
