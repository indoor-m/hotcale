import React from 'react'

interface Props {
  background_color?: string
  w?: string
  placeholder?: string
}

export const Input: React.FC<Props> = ({
  background_color = 'bg-white',
  placeholder,
  w,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        className={`${background_color} ${w} rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 border-2`}
      />
    </>
  )
}
