type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'warning'
}

export const useToast = () => {
  const toast = (props: ToastProps) => {
    console.log('Toast:', props)
    // This is just a mock implementation
  }

  return { toast }
}

export type { ToastProps }
