import { cn } from "@/utils"

interface ProgressProps {
  value?: number
  className?: string
  max?: number
  color?: string
}

export function Progress({ value = 0, className = "", max = 100, color }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const barColor = color ?? (
    percentage >= 75 ? 'bg-emerald-500 dark:bg-emerald-400' :
    percentage >= 50 ? 'bg-amber-500 dark:bg-amber-400' :
    'bg-red-500 dark:bg-red-400'
  )

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", barColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}