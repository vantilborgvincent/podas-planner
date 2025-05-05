import * as React from "react"

interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({ children }: DialogProps) => {
  return <div>{children}</div>
}

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6 bg-white rounded-lg shadow-lg">{children}</div>
}

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>
}

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }
