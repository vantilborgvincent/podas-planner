import * as React from "react"

interface PopoverProps {
  children: React.ReactNode
}

const Popover = ({ children }: PopoverProps) => {
  return <div>{children}</div>
}

const PopoverTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) => {
  return <div>{children}</div>
}

const PopoverContent = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`p-4 bg-white rounded-md shadow-lg ${className}`}>{children}</div>
}

export { Popover, PopoverTrigger, PopoverContent }
