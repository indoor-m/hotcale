import React from 'react'

interface Props {
  id?: string
}

export const ToggleButton: React.FC<Props> = ({ id }) => (
  <div className="ml-2 relative inline-block w-9 align-middle select-none transition duration-200 ease-in">
    <input
      type="checkbox"
      id={id}
      className="auto-scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
    />
    <label
      htmlFor={id}
      className={`auto-scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
    />
  </div>
)
