import React from 'react'

interface Props {
  background_color?: string
  text_color?: string
  text?: string
  p?: string
  bold?: boolean
  onClick?: () => void
}

export const Button: React.FC<Props> = ({
  background_color = 'bg-captionColor',
  text_color = 'text-white',
  text,
  p,
  bold,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${background_color} ${text_color} rounded-md px-7 text-sm ${p} ${
        bold && 'font-bold'
      }`}
    >
      {text}
    </button>
  )
}
