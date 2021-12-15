import React from 'react'

export const ToggleButton = () => (
  <div className="relative inline-block w-9 align-middle select-none transition duration-200 ease-in">
    <input
      type="checkbox"
      name="scroll"
      id="scroll"
      className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
    />
    <label
      htmlFor="scroll"
      className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
    />
  </div>
)
