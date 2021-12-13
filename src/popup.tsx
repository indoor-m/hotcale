import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'
import { startTabScroll, stopTabScroll } from './scrollControlCodes'

const Popup = () => {
  // スクロールのON/OFFステート
  const [scrollEnabled, setScrollState] = useState(false)

  // 副作用（レンダリング後に実行される）
  useEffect(() => {
    // Stateを初期化
    getInitialState()
  }, [])

  const getInitialState = () => {
    // ストレージを確認
    chrome.storage.sync.get('currentTabId', (object) => {
      // 開いているタブのURLを取得
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (
          typeof object.currentTabId == 'number' &&
          object.currentTabId == tabs[0].id
        ) {
          // URLが一致していればスクロールONで初期化
          setScrollState(true)
        }
        console.log(object)
        console.log(
          `init: ${
            typeof object.currentTabId == 'number' &&
            object.currentTabId == tabs[0].id
          }`
        )
      })
    })
  }

  // スクロール開始と停止
  const scrollControl = (on: boolean) => {
    console.log(`new state: ${on}`)

    if (on) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('add')
        chrome.storage.sync.set({ currentTabId: tabs[0].id }, () => {
          // スクロール開始処理を走らせる
          startTabScroll(tabs[0].id)

          // dump
          chrome.storage.sync.get(['currentTabId'], (object) => {
            console.log('---')
            console.log(object)
          })
        })
      })

      return
    }

    // ! off
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('remove')
      chrome.storage.sync.remove('currentTabId', () => {
        // スクロール停止処理を走らせる
        stopTabScroll(tabs[0].id)

        // dump
        chrome.storage.sync.get(['currentTabId'], (object) => {
          console.log('---')
          console.log(object)
        })
      })
    })
  }

  return (
    <div className={'w-auto py-3 px-7 whitespace-nowrap'}>
      {/*
        スクロールオプション
      */}

      <div className={'hint py-1'}>スクロールオプション</div>
      <div className={'py-1 flex justify-between items-centor'}>
        {/* 自動スクロール */}
        <div>自動スクロール有効化</div>
        {/* toggle ボタン */}
        <div className="relative inline-block w-9 ml-3 align-middle select-none transition duration-200 ease-in ">
          <input
            type="checkbox"
            onClick={() => {
              // スクロール制御
              scrollControl(!scrollEnabled)
              // State更新
              setScrollState((current) => !current)
            }}
            checked={scrollEnabled}
            name="auto-scroll"
            id="auto-scroll"
            className="auto-scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="auto-scroll"
            className={`${
              scrollEnabled ? 'is-scrollOn' : ''
            } auto-scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
          ></label>
        </div>
      </div>
    </div>
  )

  // {/* 最下部からスクロールを戻す */}
  // <div className={'py-1 flex justify-between items-centor'}>
  //   <div>最下部からスクロールを戻す</div>
  //   {/* toggleボタン */}
  //   <div className="relative inline-block w-9 ml-3 align-middle select-none transition duration-200 ease-in ">
  //     <input
  //       type="checkbox"
  //       name="scroll"
  //       id="scroll"
  //       className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
  //     />
  //     <label
  //       htmlFor="scroll"
  //       className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
  //     ></label>
  //   </div>
  // </div>

  // {/* 戻す時にリロードを行う */}
  // <div className={'py-1 flex justify-between items-centor'}>
  //   <div>戻す時にリロードを行う</div>
  //   {/* toggleボタン */}
  //   <div className="relative inline-block w-9 ml-3 align-middle select-none transition duration-200 ease-in ">
  //     <input
  //       type="checkbox"
  //       name="scroll"
  //       id="scroll"
  //       className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
  //     />
  //     <label
  //       htmlFor="scroll"
  //       className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
  //     ></label>
  //   </div>
  // </div>

  // {/* スクロールの速さ */}
  // <div>スクロールの速さ</div>

  // {/* スクロールバー */}
  // <input
  //   type="range"
  //   min="1"
  //   max="100"
  //   step="1"
  //   className={'pt-1 w-full'}
  // />

  // {/* スクロールバーの値 */}
  // <div className={'border-b-2 pb-2 flex justify-between items-centor'}>
  //   <div>遅い</div>
  //   <div>速い</div>
  // </div>

  // {/*
  //   統計
  // */}

  // <div className={'pt-2 pb-1 flex justify-between items-centor'}>
  //   <div className={'hint'}>統計</div>
  // </div>

  // {/* レポートを表示 */}
  // <div className={'py-1 flex justify-between items-centor'}>
  //   <div>レポートを表示</div>
  // </div>
  // <div className={'border-b-2 pt-1 pb-2 flex justify-between items-centor'}>
  //   <div>https://example.com</div>
  // </div>

  // {/*
  //   詳細設定
  // */}

  // <div className={'pt-2 pb-1 flex justify-between items-centor'}>
  //   <div>詳細設定</div>
  // </div>
  // {/* 巡回リンクや外部連携を設定 */}
  // <div className={'py-1 flex justify-between items-centor'}>
  //   <div>巡回リンクや外部連携を設定</div>
  // </div>
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
