import React from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'

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
      className={'w-60 py-3 px-7'}
      onClick={scroll}
    >
      <div
        className={'py-1'}
      >
        スクロールオプション
      </div>
      <div
        className={'py-1 flex justify-between items-centor'}
        
      >
        <div>
          自動スクロール有効化
        </div>
        <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
          <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
          <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
      </div>

      <div
        className={'py-1'}
      >
        <div>
          戻るときにリロードを行う
        </div>
        
      </div>
      <div
        className={'py-1'}
      >
        スクロールの速さ
      </div>
      
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
