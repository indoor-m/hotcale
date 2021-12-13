import React from 'react'

interface Props {
  bg_color?: string
  w: string
  placeholder?: string
}

export const Input: React.FC<Props> = (props) => {
  if (props.placeholder === undefined) {
    return (
      <>
        <input
          type="text"
          className={`${props.bg_color} w-${props.w} rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 border-2`}
        />
      </>
    )
  } else {
    return (
      <>
        <input
          type="text"
          placeholder={`${props.placeholder}`}
          className={`${props.bg_color} w-${props.w} rounded-md mr-2 focus:outline-none focus:border-mainColor focus:bg-white px-2 border-2`}
        />
      </>
    )
  }
}
