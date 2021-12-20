/**
 * ! 以下3つの変数定義はTab上で実行されないため`scroll()`で扱うこれらの変数はTab上のJSではグローバル変数として扱われる
 */

// 巡回先
let nextUrl: string

// スクロール処理を走らせるオブジェクト
let scrollerIntervalObject: NodeJS.Timer = null

// 再開処理用のオブジェクト
let resumeTimeoutObject: NodeJS.Timeout = null

/**
 * ! TabにexecuteScriptする関数
 */

// 巡回先のリンクをTabに渡す
// 関数を文字列に変換し、<next_url>を書き換えてexecuteScriptする
const setNextUrl = (): void => {
  nextUrl = '<next_url>'
}

// スクロール処理の定義とスクロール開始
const startScroll = (): void => {
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
    // console.log([observedScrollY, scrollY])
    // Y座標の変化値 (windows: +0.8, macOS: +1)から逸脱した場合に操作されたと判断
    if (
      observedScrollY &&
      observedScrollY + 1 < scrollY &&
      observedScrollY + 0.7 > scrollY
    ) {
      pauseScroll()
    }

    // 最下部検知 (小数部の差で一致しないため切り捨てて比較)
    if (
      Math.floor(document.documentElement.scrollHeight) ==
      Math.floor(scrollY + document.documentElement.clientHeight)
    ) {
      if (typeof nextUrl == 'string') {
        // 巡回リンクあり
        // 次の巡回先に遷移
        if (scrollerIntervalObject != null || resumeTimeoutObject != null) {
          // グローバル変数に保持された処理をキャンセル
          clearInterval(scrollerIntervalObject)
          clearTimeout(resumeTimeoutObject)

          // グローバル変数をクリア
          scrollerIntervalObject = null
          resumeTimeoutObject = null

          window.location.href = nextUrl
        }
      } else {
        // 巡回リンクなし
        // 最上部に戻る
        scrollTo(scrollX, 0)
      }
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

  // スクロール開始(スクロール・再開処理が走っていない場合のみ)
  if (scrollerIntervalObject == null && resumeTimeoutObject == null) {
    startScroll()
  }
}

// スクロール停止
const stopScroll = (): void => {
  // グローバル変数に保持された処理をキャンセル
  clearInterval(scrollerIntervalObject)
  clearTimeout(resumeTimeoutObject)

  // グローバル変数をクリア
  scrollerIntervalObject = null
  resumeTimeoutObject = null

  // マウス操作時の検知を無効化
  window.onmousedown = null
  window.onmousemove = null

  // 巡回リンクを無効化
  if (nextUrl) {
    nextUrl = undefined
  }

  console.log('AutoScroll stopped. stop()')
}

/**
 * ! exports: 他ファイルから呼び出す関数
 */

/**
 * 指定タブに巡回先のリンクを渡す
 *
 * @param tabId number
 * @param url string
 */
export const setTabNextUrl = (tabId: number, url: string): void => {
  chrome.tabs.executeScript(tabId, {
    code: `(${setNextUrl.toString().replace('<next_url>', url)})()`,
  })
}

/**
 * 指定タブでスクロール開始
 *
 * StorageにStateの更新を行い、スクロール開始のコードを実行。
 *
 * @param tabId number
 */
export const startTabScroll = (tabId: number): void => {
  chrome.storage.sync.set({ currentTabId: tabId }, () => {
    chrome.tabs.executeScript(
      tabId,
      {
        code: `(${startScroll.toString()})()`,
      },
      null
    )
  })
}

/**
 * 指定タブでスクロール停止
 *
 * StorageにStateの更新を行い、スクロール停止のコードを実行。
 *
 * @param tabId number
 */
export const stopTabScroll = (tabId: number): void => {
  chrome.storage.sync.remove(['currentTabId', 'currentTourUrlStack'], () => {
    chrome.tabs.executeScript(
      tabId,
      {
        code: `(${stopScroll.toString()})()`,
      },
      null
    )
  })
}
