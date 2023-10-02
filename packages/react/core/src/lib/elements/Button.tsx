import React, { forwardRef } from 'react'
import clsx from 'clsx'

import { cn } from '../utils/style-utils'
import { Spinner } from '../spinners/Spinner'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'link' | 'toolbar' | 'nav'
  size?: 'sm' | 'md' | 'lg'
  Icon?: React.ReactNode
  isLoading?: boolean
}

const commonButtonClassName = clsx(
  'group inline-flex items-center justify-center rounded-md transition-colors',
  'disabled:opacity-75',
  'outline-none focus:outline-none',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300',
)

const primaryButtonClassName = clsx(
  'px-3 xs:px-4 py-1.5 min-w-fit',
  'font-medium xs:font-semibold text-white shadow-sm',
  'border-2 border-transparent',
  'bg-sky-800 hover:bg-sky-700',
)

const primaryLinkButtonClassName = clsx(
  'px-3 xs:px-4 py-1.5 min-w-fit',
  'font-medium xs:font-semibold text-sky-800 hover:text-sky-700',
  'border-2 border-transparent',
  'bg-transparent',
)

const outlineButtonClassName = clsx(
  'px-3 py-1.5 min-w-fit',
  'border border-slate-300 hover:border-slate-400/50',
  'bg-transparent',
  'font-medium text-slate-700 shadow-sm',
)

const navButtonClassName = clsx(
  'px-2 xs:px-3 py-2 min-w-fit',
  'font-medium uppercase text-sky-800 shadow-sm',
  'border border-slate-300 hover:border-slate-400/50 hover:text-sky-700/80',
  'bg-slate-50',
  'text-xs',
)

const ghostButtonClassName = 'gap-1 p-2 border-2 font-semibold hover:bg-slate-100'

const toolbarButtonClassName = cn(
  ghostButtonClassName,
  'border border-slate-300 hover:border-slate-400/50',
  'hover:bg-slate-50 transform-gpu hover:scale-[1.05] transition-all',
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { type, isLoading, size = 'md', variant = 'primary', className, disabled, Icon, children, ...restProps } = props

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(
        commonButtonClassName,
        {
          [primaryButtonClassName]: variant === 'primary',
          [outlineButtonClassName]: variant === 'outline',
          [ghostButtonClassName]: variant === 'ghost',
          [primaryLinkButtonClassName]: variant === 'link',
          [toolbarButtonClassName]: variant === 'toolbar',
          [navButtonClassName]: variant === 'nav',
          ['text-sm']: size === 'sm' && variant !== 'nav',
          ['text-sm xs:text-base']: size === 'md' && variant !== 'nav',
          ['text-base xs:text-lg']: size === 'lg' && variant !== 'nav',
        },
        className,
      )}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      {...restProps}
    >
      {isLoading ? (
        <Spinner
          size="xs"
          className={cn('mr-2', {
            ['text-slate-200']: variant === 'primary',
          })}
        />
      ) : null}
      {Icon && !isLoading ? Icon : null}
      {children}
    </button>
  )
})
