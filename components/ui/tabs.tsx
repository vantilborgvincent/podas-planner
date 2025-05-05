import * as React from "react"

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

const Tabs = ({ defaultValue, value, onValueChange, className, children }: TabsProps) => {
  return <div className={className}>{children}</div>
}

const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return <div className={`flex mb-4 ${className}`}>{children}</div>
}

const TabsTrigger = ({ 
  value, 
  className, 
  children 
}: { 
  value: string, 
  className?: string, 
  children: React.ReactNode 
}) => {
  return <button className={`px-4 py-2 ${className}`}>{children}</button>
}

const TabsContent = ({ 
  value, 
  className, 
  children 
}: { 
  value: string, 
  className?: string, 
  children: React.ReactNode 
}) => {
  return <div className={className}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
