import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '../static/style.css'

const Popup = () => {
  // スクロールのON/OFFステート
  const [scrollEnabled, setScrollState] = useState(false)

  useEffect(() => {
    getInitialState()
  }, [])

  const getInitialState = async () => {
    const object = await chrome.storage.sync.get('currentURL')
    if (typeof object.currentURL == 'string') {
      setScrollState(true)
    }
  }

  // スクロールの開始と停止
  const handleClick = () => {
    setScrollState(!scrollEnabled)
    // 更新後のステート保持
    const newScrollEnabledState = !scrollEnabled

    console.log(`new state: ${newScrollEnabledState}`)

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (newScrollEnabledState) {
        console.log('add')
        chrome.storage.sync.set({ currentURL: tabs[0].url })
      } else {
        console.log('remove')
        chrome.storage.sync.remove('currentURL')
      }
    })

    chrome.storage.sync.get(['currentURL'], (object) => {
      console.log('---')
      console.log(object)
    })

    /**
     * ! 以下2つの変数定義はTab上で実行されないため`scroll()`で扱うこれらの変数はTab上のJSではグローバル変数として扱われる
     */

    // スクロール処理を走らせるオブジェクト
    let scrollerIntervalObject: NodeJS.Timer = null

    // 再開処理用のオブジェクト
    let resumeTimeoutObject: NodeJS.Timeout = null

    // スクロール処理の定義とスクロール開始
    const startScroll = () => {
      // 未定義の場合にスクロール処理と再開処理利用のオブジェクトをグローバル変数として定義
      if (typeof scrollerIntervalObject == 'undefined') {
        scrollerIntervalObject = null
      }
      if (typeof resumeTimeoutObject == 'undefined') {
        resumeTimeoutObject = null
      }

      // スクロール速度
      const scrollInterval = 40

      // 再開までの時間
      const resumeInterval = 5000

      // scrollY保持用フィールド
      let observedScrollY: number

      // スクロール中断
      const pauseScroll = () => {
        // スクロール停止
        clearInterval(scrollerIntervalObject)
        scrollerIntervalObject = null
        console.log('AutoScroll stopped.')

        // 再開処理を予約
        resumeTimeoutObject = setTimeout(startScroll, resumeInterval)
      }

      // Y座標を監視しながらスクロール
      const scroll = () => {
        // 操作検知
        console.log([observedScrollY, scrollY])
        if (observedScrollY && observedScrollY + 1 != scrollY) {
          pauseScroll()
        }

        // 最下部検知
        if (
          document.documentElement.scrollHeight ==
          scrollY + document.documentElement.clientHeight
        ) {
          // 最上部に戻る
          scrollTo(scrollX, 0)
        }

        // scrollYを保持
        observedScrollY = scrollY

        // 1pxスクロール
        scrollTo(scrollX, scrollY + 1)
      }

      // スクロール開始
      const startScroll = () => {
        // scrollYを初期化
        observedScrollY = null

        // スクロール開始
        scrollerIntervalObject = setInterval(scroll, scrollInterval)

        console.log('AutoScroll started.')
      }

      // 操作を検知したときの処理
      const controlDetected = () => {
        // スクロール中の場合
        if (scrollerIntervalObject) {
          // スクロール停止
          clearInterval(scrollerIntervalObject)
          scrollerIntervalObject = null
          console.log('AutoScroll stopped.')
        }

        // 再開処理が待機している場合
        if (resumeTimeoutObject) {
          // 再開処理をキャンセル
          clearTimeout(resumeTimeoutObject)
        }

        // 再開処理を予約/再予約
        resumeTimeoutObject = setTimeout(startScroll, resumeInterval)
      }

      // マウス操作時の処理を設定
      window.onmousedown = controlDetected
      window.onmousemove = controlDetected

      // スクロール開始
      startScroll()
    }

    // スクロール停止
    const stopScroll = () => {
      // グローバル変数に保持された処理をキャンセル
      clearInterval(scrollerIntervalObject)
      clearTimeout(resumeTimeoutObject)

      // マウス操作時の検知を無効化
      window.onmousedown = null
      window.onmousemove = null

      console.log('AutoScroll stopped. stop()')
    }

    //タブを取得
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      //表示中のタブでスクロールを実行
      await chrome.tabs.executeScript(tabs[0].id, {
        // 1pxスクロールをインターバル指定で実行
        code: `(${
          newScrollEnabledState ? startScroll.toString() : stopScroll.toString()
        })()`,
      })
    })
  }

  return (
    <div className={'w-60 py-3 px-7'}>
      {/*
        スクロールオプション
      */}

      <div className={'hint py-1'}>スクロールオプション</div>
      <div className={'py-1 flex justify-between items-centor'}>
        {/* 自動スクロール */}
        <div>自動スクロール有効化</div>
        {/* toggle ボタン */}
        <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
          <input
            type="checkbox"
            onClick={handleClick}
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

      {/* 最下部からスクロールを戻す */}
      <div className={'py-1 flex justify-between items-centor'}>
        <div>最下部からスクロールを戻す</div>
        {/* toggleボタン */}
        <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
          <input
            type="checkbox"
            name="scroll"
            id="scroll"
            className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="scroll"
            className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
          ></label>
        </div>
      </div>

      {/* 戻す時にリロードを行う */}
      <div className={'py-1 flex justify-between items-centor'}>
        <div>戻す時にリロードを行う</div>
        {/* toggleボタン */}
        <div className="relative inline-block w-9 mr-2 align-middle select-none transition duration-200 ease-in ">
          <input
            type="checkbox"
            name="scroll"
            id="scroll"
            className="scroll-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="scroll"
            className={`scroll-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer`}
          ></label>
        </div>
      </div>

      {/* スクロールの速さ */}
      <div>スクロールの速さ</div>

      {/* スクロールバー */}
      <input
        type="range"
        min="1"
        max="100"
        step="1"
        className={'pt-1 w-full'}
      />

      {/* スクロールバーの値 */}
      <div className={'border-b-2 pb-2 flex justify-between items-centor'}>
        <div>遅い</div>
        <div>速い</div>
      </div>

      {/*
        統計
      */}

      <div className={'pt-2 pb-1 flex justify-between items-centor'}>
        <div className={'hint'}>統計</div>
      </div>

      {/* レポートを表示 */}
      <div className={'py-1 flex justify-between items-centor'}>
        <div>レポートを表示</div>
      </div>
      <div className={'border-b-2 pt-1 pb-2 flex justify-between items-centor'}>
        <div>https://example.com</div>
      </div>

      {/*
        詳細設定
      */}

      <div className={'pt-2 pb-1 flex justify-between items-centor'}>
        <div>詳細設定</div>
      </div>
      {/* 巡回リンクや外部連携を設定 */}
      <div className={'py-1 flex justify-between items-centor'}>
        <div>巡回リンクや外部連携を設定</div>
      </div>
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
