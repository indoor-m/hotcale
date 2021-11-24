import React from 'react'
import ReactDOM from 'react-dom'

const Popup = () => {
  // スクロール処理
  const handler = () => {
    // スクロール
    const scroll = () => {
      // スクロール処理を走らせるオブジェクト
      let scrollerIntervalObject: NodeJS.Timer = null

      // 再開処理用のオブジェクト
      let resumeTimeoutObject: NodeJS.Timeout = null

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

    //タブを取得
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //表示中のタブでスクロールを実行
      chrome.tabs.executeScript(tabs[0].id, {
        // 1pxスクロールをインターバル指定で実行
        code: `(${scroll.toString()})()`,
      })
    })
  }

  return (
    <div
      style={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}
      onClick={handler}
    >
      This is popup
    </div>
  )
}

const container = document.getElementById('container')
ReactDOM.render(<Popup />, container)
