import * as React from "react"

interface AlertProps {
  variant?: 'default' | 'destructive'
  className?: string
  children: React.ReactNode
}

const Alert = ({ variant = 'default', className, children }: AlertProps) => {
  return <div className={`p-4 rounded-lg border ${className}`}>{children}</div>
}

const AlertTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <h5 className={`font-medium ${className}`}>{children}</h5>
}

const AlertDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`text-sm ${className}`}>{children}</div>
}

export { Alert, AlertTitle, AlertDescription }
