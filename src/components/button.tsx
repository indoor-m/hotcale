import React from 'react'

interface Props {
  background_color?: string
  text_color?: string
  text?: string
  p?: string
}

export const Button: React.FC<Props> = ({
  background_color = 'bg-captionColor',
  text_color = 'text-white',
  text,
  p,
}) => {
  return (
    <button
      className={`${background_color} ${text_color} rounded-md px-7 mr-3 ${p}`}
    >
      {text}
    </button>
  )
}
