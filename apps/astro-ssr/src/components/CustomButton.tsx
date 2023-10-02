import React from 'react'
import { Button } from '@rfx/react-core'

export const CustomButton: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Button variant="outline" onClick={() => alert('hi')}>
    {children ?? 'Click Me'}
  </Button>
)
