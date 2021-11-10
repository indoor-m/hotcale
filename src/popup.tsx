import React from 'react'
import ReactDOM from 'react-dom'

const Popup = () => {
  // スクロール処理
  const scroll = () => {
    // 1pxスクロールする処理
    const scroll_1 = () => {
      scrollTo(scrollX, scrollY + 1)
    }

    //タブを取得
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //表示中のタブでスクロールを実行
      chrome.tabs.executeScript(tabs[0].id, {
        // 1pxスクロールをインターバル指定で実行
        code: `scroller = setInterval(${scroll_1.toString()}, 40);`,
      })
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
