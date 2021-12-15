import React from 'react'

interface Props {
  background_color?: string
  w?: string
  placeholder?: string
}

export const Input: React.FC<Props> = (props) => {
  return (
    <>
      <input
        type="text"
        placeholder={props.placeholder}
        className={`${props.background_color} ${props.w} rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 border-2`}
      />
    </>
  )
}
