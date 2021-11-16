import React, { useState } from "react"
import ReactDOM from 'react-dom'
import '../static/style.css'

const Popup = () => {

  const [on, setOpen] = useState(false);

  //スクロールの開始と停止
  const handleClick = () => {
    setOpen(!on);
    if(!on){
      /*
      // スクロール機能
      */
      //タブを取得
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //表示中のタブでスクロールを実行
        chrome.tabs.executeScript(tabs[0].id, {
          code: `scroller = setInterval(function(){scrollTo(scrollX, scrollY+1)}, 20);`})
      })
    }else{
      /*
      // スクロール機能
      */
      //タブを取得
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //表示中のタブでスクロールを実行
        chrome.tabs.executeScript(tabs[0].id, {
          code: `clearInterval(scroller)`})
      })
    }
    
  };

  //スピード変更
  const chengeSpeed = () =>{
    
  }

  return (
    <div
      className={'w-60 py-3 px-7'}
    >
      <div
        className={'hint py-1'}
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
          <input type="checkbox" onClick={handleClick} name="auto-scroll" id="auto-scroll" className="auto-scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
          <label htmlFor="auto-scroll" className={`${on ? "is-scrollOn" : ""} auto-scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}></label>
        </div>
      </div>

      <div
        className={'py-1 flex justify-between items-centor'}
        
      >
        <div>
          最下部からスクロールを戻す
        </div>
        <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
          <input type="checkbox" name="scroll" id="scroll" className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
          <label htmlFor="scroll" className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}></label>
        </div>
      </div>
      <div
        className={'py-1 flex justify-between items-centor'}
        
      >
        <div>
          戻す時にリロードを行う
        </div>
        <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
          <input type="checkbox" name="scroll" id="scroll" className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
          <label htmlFor="scroll" className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}></label>
        </div>
      </div>

      <div
      className={'line'}
      >
        <div>スクロールの速さ</div>
        <div className={'scroll-speed pt-1'}>
          <input type="range" id="scroll-speed" min="1" max="100" step="1" />
        </div>
        <div
        className={'pb-1 flex justify-between items-centor'}
        >
          <div>遅い</div>
          <div>速い</div>
        </div>
      </div>
      <hr/>

      <div
        className={'py-1 flex justify-between items-centor'}
      >
        <div className={'hint'}>
          統計
        </div>
      </div>
      <div
        className={'py-1 flex justify-between items-centor'}
      >
        <div>
          レポートを表示
        </div>
      </div>
      <div
        className={'py-1 flex justify-between items-centor'}
      >
        <div>
          https://example.com
        </div>
      </div>

      <hr />

      <div
        className={'py-1 flex justify-between items-centor'}
      >
        <div>
          詳細設定
        </div>
      </div>
      <div
        className={'py-1 flex justify-between items-centor'}
      >
        <div>
          巡回リンクや外部連携を設定
        </div>
      </div>
      
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
