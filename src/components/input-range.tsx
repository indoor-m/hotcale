import React, { ChangeEvent } from 'react'

interface Props {
  value?: number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const InputRange = React.forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    ref={ref}
    type="range"
    min="0"
    max="100"
    step="10"
    className={'input-range'}
    {...props}
  />
))

InputRange.displayName = 'InputRange'

export default InputRange
