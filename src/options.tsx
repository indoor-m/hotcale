import React from 'react'
import ReactDOM from 'react-dom'

const Options = () => {
  return (
    <div
      style={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}
    >
      This is options
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Options />, container)
