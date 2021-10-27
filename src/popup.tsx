import React from 'react'
import ReactDOM from 'react-dom'

const Popup = () => {

  const scroll = () =>{
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `scroller = setInterval(function(){scrollTo(scrollX, scrollY+1)}, 40);`})
    })
  }

  return (
    <div
      style={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}
      onClick={scroll}
    >
      This is popup
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
