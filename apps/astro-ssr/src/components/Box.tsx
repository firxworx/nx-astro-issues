import React from 'react'
import { cn } from '@rfx/react-core'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Rounded box with a light slate background to test React, TailwindCSS, and importing a function from a library.
 */
export function Box({ className, children, ...restProps }: BoxProps): JSX.Element {
  return (
    <div className={cn('p-4 rounded-md bg-slate-200 text-slate-800', className)} {...restProps}>
      {children}
    </div>
  )
}
