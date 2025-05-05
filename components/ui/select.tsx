import * as React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={`h-10 w-full rounded-md border border-input px-3 py-2 text-sm ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

const SelectTrigger = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`flex items-center justify-between ${className}`}>{children}</div>
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <span>{placeholder}</span>
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-white rounded-md shadow-lg p-1 mt-1">{children}</div>
}

const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => {
  return <div className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100">{children}</div>
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
