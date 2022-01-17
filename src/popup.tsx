import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'
import { InputRange } from './components/input-range'
import { startTabScroll, startTour, stopTabScroll } from './utils/scrollControl'

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

  // スクロール開始・停止
  const scrollControl = (on: boolean) => {
    console.log(`new state: ${on}`)

    if (on) {
      // 開いているタブでスクロール開始
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        startTabScroll(tabs[0].id)
      })

      return
    }

    // ! off
    // 開いているタブでスクロール停止
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      stopTabScroll(tabs[0].id)
    })
  }

  return (
    <div className={'w-auto py-3 whitespace-nowrap'}>
      {/*
        スクロールオプション
      */}
      <div className="px-7">
        <div className={'text-captionColor pb-1'}>スクロールオプション</div>
        <div className={'py-1 flex justify-between items-center'}>
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
        <div className={'py-1 flex justify-between items-center'}>
          <div>最下部からスクロールを戻す</div>
          {/* toggle ボタン */}
          <div className="relative inline-block w-9 ml-3 align-middle select-none transition duration-200 ease-in ">
            <input
              type="checkbox"
              name="auto-scroll"
              id="auto-scroll"
              className="auto-scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="auto-scroll"
              className={`auto-scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
            ></label>
          </div>
        </div>
        <div className={'py-1 flex justify-between items-center'}>
          <div>戻す時にリロードを行う</div>
          {/* toggle ボタン */}
          <div className="relative inline-block w-9 ml-3 align-middle select-none transition duration-200 ease-in ">
            <input
              type="checkbox"
              name="auto-scroll"
              id="auto-scroll"
              className="auto-scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="auto-scroll"
              className={`auto-scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
            ></label>
          </div>
        </div>
        {/* スクロールの速さ */}
        <div>スクロールの速さ</div>

        {/* スクロールバー */}
        <InputRange />

        {/* スクロールバーの値 */}
        <div className={'pb-2 flex justify-between items-center'}>
          <div>遅い</div>
          <div>速い</div>
        </div>
      </div>
      <div className="border-b-2"></div>

      <div className="px-7">
        <div className={'text-captionColor py-1'}>統計</div>
        <div
          className={
            'py-1 border-dividerColor flex justify-between items-center'
          }
        >
          <div>レポートを表示</div>
        </div>
      </div>
      <div className="border-b-2"></div>

      <div className="px-7">
        <div className={'text-captionColor py-1'}>保存済みリストを実行</div>
        <div className="">
          <select className="border-2 w-full my-2 after:color-mainColor">
            <option selected className="after:bg-mainColor">
              選択なし
            </option>
            <option value="1" className="after:bg-mainColor">
              indoor
            </option>
            <option value="2" className="after:bg-mainColor">
              E展
            </option>
          </select>
        </div>
      </div>
      <div className="border-b-2"></div>

      <div className={'flex mt-2 px-7'}>
        <button
          onClick={() => {
            // TODO: 巡回リンク選択時に`currentTourUrlStack`を登録
            startTour([
              'https://github.com/indoor-m/hotcale/pull/1',
              'https://github.com/indoor-m/hotcale/pull/2',
              'https://github.com/indoor-m/hotcale/pull/3',
              'https://github.com/indoor-m/hotcale/pull/4',
              'https://github.com/indoor-m/hotcale/pull/5',
            ])
          }}
        >
          巡回開始
        </button>
      </div>
    </div>
  )

  // {/* 最下部からスクロールを戻す */}
  // <div className={'py-1 flex justify-between items-center'}>
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
  // <div className={'py-1 flex justify-between items-center'}>
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
  // <InputRange />

  // {/* スクロールバーの値 */}
  // <div className={'border-b-2 pb-2 flex justify-between items-center'}>
  //   <div>遅い</div>
  //   <div>速い</div>
  // </div>

  // {/*
  //   統計
  // */}

  // <div className={'pt-2 pb-1 flex justify-between items-center'}>
  //   <div className={'hint'}>統計</div>
  // </div>

  // {/* レポートを表示 */}
  // <div className={'py-1 flex justify-between items-center'}>
  //   <div>レポートを表示</div>
  // </div>
  // <div className={'border-b-2 pt-1 pb-2 flex justify-between items-center'}>
  //   <div>https://example.com</div>
  // </div>

  // {/*
  //   詳細設定
  // */}

  // <div className={'pt-2 pb-1 flex justify-between items-center'}>
  //   <div>詳細設定</div>
  // </div>
  // {/* 巡回リンクや外部連携を設定 */}
  // <div className={'py-1 flex justify-between items-center'}>
  //   <div>巡回リンクや外部連携を設定</div>
  // </div>
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
