import { cn } from '../utils/style-utils'

export interface ContainerProps {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
}

export function Container({ className, as, children }: ContainerProps): JSX.Element {
  const ContainerComponent = as ?? 'div'
  return (
    <ContainerComponent className={cn('container mx-auto px-4 sm:px-6 max-w-6xl', className)}>
      {children}
    </ContainerComponent>
  )
}
