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
  stopTabScroll,
} from './utils/scrollControl'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { tourActions, tourState } from './atoms/tourActions'
import { Tour } from './atoms/interfaces/tour'

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
  // Tour
  const [tour, setTour] = useState<Tour | null>(null)
  const findByTourId = tourActions.useFindByTourId()
  const saveTour = tourActions.useSaveTour()

  const tours = useRecoilValue(tourState).tours
  const reloadTour = tourActions.useReloadTour()

  // 副作用（レンダリング後に実行される）
  useEffect(() => {
    // Stateを初期化
    getInitialState()

    findByTourId({
      key: 'general',
      tourId: 'general',
      callback: (tour) => {
        setTour(tour)
      },
    })

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
        startTabScroll(
          tabs[0].id,
          tour?.scrollSpeed ?? 50,
          tour?.resumeInterval ?? 5000
        )
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
                    !backOnReachingBottomEnabled,
                    tabs[0].id
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
                  setReloadOnBack(!reloadOnBackEnabled, tabs[0].id)
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
        <InputRange
          value={tour?.scrollSpeed ?? 50}
          onChange={(v) => {
            const value = Number(v.currentTarget.value)

            if (value > 0) {
              const newTour: Tour = {
                ...tour,
                id: 'general',
                scrollSpeed: value,
              }

              setTour(newTour)

              saveTour({ key: 'general', tour: newTour })
            }
          }}
        />

        {/* スクロールバーの値 */}
        <div className={'pb-2 flex justify-between items-center'}>
          <div>遅い</div>
          <div>速い</div>
        </div>
      </div>
      <div className="border-b-2" />

      <div className="px-8 pt-1 pb-2">
        <div className={'text-captionColor py-1'}>統計</div>
        {/* TODO: リンクはここじゃない */}
        <div
          className={'border-dividerColor flex justify-between items-center'}
          onClick={() => chrome.runtime.openOptionsPage()}
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
        <select
          className="flex justify-between w-full px-2 py-1 text-xs hover:bg-dividerColor rounded-md border-2"
          onChange={(e) => {
            const value = e.target.value

            if (value != null) {
              const tour = tours[Number(value)]
              startSavedTour(tour.id)
            }
          }}
        >
          <option selected className="after:bg-mainColor" value={null}>
            選択なし
          </option>
          {tours.map((tour, i) => {
            return (
              <option key={tour.id} value={i} className="after:bg-mainColor">
                {tour.name}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
