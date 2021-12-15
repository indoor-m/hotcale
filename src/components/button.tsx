import React from 'react'

interface Props {
  background_color: string
  text_color: string
  text: string
  p?: string
}

export const Button: React.FC<Props> = (props) => (
  <button
    className={`${props.background_color} ${props.text_color} rounded-md px-7 mr-3 ${props.p}`}
  >
    {props.text}
  </button>
)
