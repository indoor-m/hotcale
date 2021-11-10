import React from 'react'
import ReactDOM from 'react-dom'

const Popup = () => {

  const scroll = () =>{
    //タブを取得
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //表示中のタブでスクロールを実行
      chrome.tabs.executeScript(tabs[0].id, {
        code: `scroller = setInterval(function(){scrollTo(scrollX, scrollY+1)}, 40);`})
    })
  }

  return (
    <div
      className={'bg-blue-500'}
      onClick={scroll}
    >
      This is popup
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
