import * as React from "react"

const Label = React.forwardRef
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none ${className || ''}`}
      {...props}
    />
  )
})
Label.displayName = "Label"

export { Label }
