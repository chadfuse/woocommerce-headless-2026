// Button styling utilities for Links when asChild is not available

export const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted hover:text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  link: "text-primary underline-offset-4 hover:underline",
}

export const buttonSizes = {
  default: "h-8 gap-1.5 px-2.5 text-sm",
  sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]",
  lg: "h-9 gap-1.5 px-2.5",
  icon: "size-8",
}

export function getButtonClassName(
  variant: keyof typeof buttonVariants = 'default',
  size: keyof typeof buttonSizes = 'default',
  className: string = ''
) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
  
  return `${baseClasses} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim()
}
