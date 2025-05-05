import * as React from "react"

interface CalendarProps {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | { from: Date; to: Date }
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
  className?: string
}

const Calendar = ({
  mode = "single",
  selected,
  onSelect,
  initialFocus,
  className,
}: CalendarProps) => {
  return <div className={`p-3 bg-white rounded-md ${className}`}>Calendar Placeholder</div>
}
Calendar.displayName = "Calendar"

export { Calendar }
