import React, { ChangeEvent } from 'react'

interface Props {
  background_color?: string
  w?: string
  placeholder?: string
  svg?: HTMLElement
  value?: string
  textAlign?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  show?: boolean
}

const Input: React.FC<Props> = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      background_color = 'bg-white',
      placeholder,
      w,
      value,
      textAlign,
      onChange,
      show = true,
    },
    ref
  ) => {
    return (
      <>
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`${background_color} ${w} ${textAlign} rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 py-[2px] border-2`}
        />
      </>
    )
  }
)

Input.displayName = 'Input'

export default Input
