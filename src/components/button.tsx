import React from 'react'

interface Props {
  bg_color: string
  tx_color: string
  text: string
  p?: string
}

export const Button: React.FC<Props> = (props) => (
  <button
    className={`${props.bg_color} ${props.tx_color} rounded-md px-7 mr-3 ${props.p}`}
  >
    {props.text}
  </button>
)
