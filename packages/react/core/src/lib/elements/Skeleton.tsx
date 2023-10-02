import { cn } from '../utils/style-utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn('animate-pulse rounded-md bg-P-muted-fg', className)} {...props} />
}
