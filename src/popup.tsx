import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'
import InputRange from './components/input-range'
import { ToggleButton } from './components/togglebutton'
import {
  setBackOnReachingBottom,
  setReloadOnBack,
  startSavedTour,
  startTabScroll,
  startTour,
  stopTabScroll,
} from './utils/scrollControl'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { tourActions, tourState } from './atoms/tourActions'
import { useParams } from 'react-router-dom'

const Popup = () => {
  return (
    <RecoilRoot>
      <Body />
    </RecoilRoot>
  )
}

const Body = () => {
  // スクロールのON/OFFステート
  const [scrollEnabled, setScrollState] = useState(false)
  // 最下部からスクロールを戻すか
  const [backOnReachingBottomEnabled, setBackOnReachingBottomState] =
    useState(false)
  // 戻るときにリロードを行うか
  const [reloadOnBackEnabled, setReloadOnBackState] = useState(false)

  const tours = useRecoilValue(tourState).tours
  const reloadTour = tourActions.useReloadTour()

  // 副作用（レンダリング後に実行される）
  useEffect(() => {
    // Stateを初期化
    getInitialState()

    reloadTour()
  }, [])

  console.log(tours)

  const getInitialState = () => {
    // ストレージを確認
    chrome.storage.sync.get(
      ['currentTabId', 'backOnReachingBottomEnabled', 'reloadOnBackEnabled'],
      ({ currentTabId, backOnReachingBottomEnabled, reloadOnBackEnabled }) => {
        // 開いているタブのURLを取得
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (currentTabId == tabs[0].id) {
            // URLが一致していればスクロールONで初期化
            setScrollState(true)
          }
          // 最下部からスクロールを戻すかのstateを初期化
          setBackOnReachingBottomState(backOnReachingBottomEnabled)
          // 戻るときにリロードを行うかのstateを初期化
          setReloadOnBackState(reloadOnBackEnabled)

          console.log({
            currentTabId,
            backOnReachingBottomEnabled,
            reloadOnBackEnabled,
          })
          console.log({
            scrollEnabled: currentTabId == tabs[0].id,
            backOnReachingBottomEnabled,
            reloadOnBackEnabled,
          })
        })
      }
    )
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

  useEffect(() => {
    reloadTour()
  }, [])

  // dropdown メニューの表示・非表示を切り替え
  const [visible, setVisible] = useState(false)

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
            onChange={() => {
              // stateを更新
              setBackOnReachingBottomState((current) => !current)
              if (backOnReachingBottomEnabled) {
                // TODO: falseに変更される場合、`戻す時にリロードを行う`かのチェックボックスを無効にする
              }

              // storageを更新
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  setBackOnReachingBottom(
                    tabs[0].id,
                    !backOnReachingBottomEnabled
                  )
                }
              )
            }}
            checked={backOnReachingBottomEnabled}
            id="scroll_back_from_the_bottom"
          />
        </div>
        <div className={'py-1 flex justify-between items-center'}>
          <div>戻す時にリロードを行う</div>
          <ToggleButton
            onChange={() => {
              // stateを更新
              setReloadOnBackState((current) => !current)

              // storageを更新
              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  setReloadOnBack(tabs[0].id, !reloadOnBackEnabled)
                }
              )
            }}
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
            className="h-5 w-5"
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

      <div className="px-7 py-1">
        <div className={'text-captionColor p-1'}>保存済みリストを実行</div>
        <button
          id="dropdownButton"
          data-dropdown-toggle="dropdown"
          type="button"
          className={`${
            visible ? 'rounded-t-md border-b-0' : 'rounded-md'
          } border-2 border-gray-200 flex justify-between items-center w-full px-2`}
          onClick={() => setVisible(!visible)}
        >
          選択しない
          {visible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* <!-- Dropdown menu --> */}
        <div
          onClick={() => setVisible(false)}
          className={`${
            visible ? 'z-10 bg-white' : 'hidden'
          } text-base bg-white rounded-b-md border-2 border-gray-200`}
        >
          <ul aria-labelledby="dropdownButton">
            {tours.map((tour) => {
              return (
                <>
                  <li>
                    <button
                      onClick={() => startSavedTour(tour.id)}
                      data-dropdown-toggle="dropdownId"
                      className="py-1 px-[10px] text-sm text-black hover:bg-mainColor hover:text-white w-full text-left"
                    >
                      {tour.name}
                    </button>
                  </li>
                </>
              )
            })}
          </ul>
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
          巡回開始(テスト用)
        </button>
      </div>
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
