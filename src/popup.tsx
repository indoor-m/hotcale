import React from 'react'
import ReactDOM from 'react-dom'

const Popup = () => {
  return (
    <div
      style={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}
    >
      This is popup
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
