import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, type = 'text', id, className = '', ...props }, ref) => {
  let inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-900 mb-2">
          {label}
        </label>
      )}
      <input 
        ref={ref} 
        id={inputId} 
        type={type}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : ''}`}
        {...props} 
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
