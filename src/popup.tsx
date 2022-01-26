import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'
import InputRange from './components/input-range'
import { ToggleButton } from './components/togglebutton'
import { startTabScroll, startTour, stopTabScroll } from './utils/scrollControl'

const Popup = () => {
  // スクロールのON/OFFステート
  const [scrollEnabled, setScrollState] = useState(false)
  // 最下部からスクロールを戻すか
  const [backOnReachingBottomEnabled, setBackOnReachingBottomState] =
    useState(false)
  // 戻るときにリロードを行うか
  const [reloadOnBackEnabled, setReloadOnBackState] = useState(false)

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
      <div className="px-8">
        <div className={'text-captionColor pb-1'}>スクロールオプション</div>
        <div className={'py-1 flex justify-between items-center'}>
          <div>自動スクロール有効化</div>
          <ToggleButton
            onChange={() => {
              // スクロール制御
              scrollControl(!scrollEnabled)
              // State更新
              setScrollState((current) => !current)
            }}
            checked={scrollEnabled}
            id="auto-scroll"
          />
        </div>
        <div className={'py-1 flex justify-between items-center'}>
          <div>最下部からスクロールを戻す</div>
          <ToggleButton
            checked={backOnReachingBottomEnabled}
            id="scroll_back_from_the_bottom"
          />
        </div>
        <div className={'py-1 flex justify-between items-center'}>
          <div>戻す時にリロードを行う</div>
          <ToggleButton
            checked={reloadOnBackEnabled}
            id="reload_when_reverting"
          />
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
      <div className="border-b-2" />

      <div className="px-8 pt-1 pb-2">
        <div className={'text-captionColor py-1'}>統計</div>
        <div
          className={'border-dividerColor flex justify-between items-center'}
        >
          <div>レポートを表示</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="border-b-2" />

      <div className="px-8 py-1">
        <div className={'text-captionColor py-1'}>保存済みリストを実行</div>
        {/* <select className="border-2 w-full mb-3 after:color-mainColor">
          <option selected className="after:bg-mainColor">
            選択なし
          </option>
          <option value="1" className="after:bg-mainColor">
            indoor
          </option>
          <option value="2" className="after:bg-mainColor">
            E展
          </option>
        </select> */}
        <div className="">
          <button
            className="flex justify-between w-full px-2 py-1 text-xs hover:bg-dividerColor rounded-md border-2"
            type="button"
            data-dropdown-toggle="dropdown"
          >
            選択しない
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* DropDown Menu */}

          <div
            className="hidden bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4"
            id="dropdown"
          >
            <ul className="py-1" aria-labelledby="dropdown">
              <li>
                <a
                  href="#"
                  className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                >
                  Earnings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-b-2" />

      <div className={'flex pt-2 px-8'}>
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
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
