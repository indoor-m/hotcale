import { Tour } from '../atoms/interfaces/tour'
import { chromeStorageActions } from './base/chromeStorage'

/**
 * ! 以下の変数定義はTab上で実行されないためこれらの変数はTab上のJSではグローバル変数として扱われる
 */

// 巡回先
let nextUrl: string

// 巡回リストid
let currentTourId: string

// 最下部からスクロールを戻すか
let backOnReachingBottom: boolean

// 戻るときにリロードを行うか
let reloadOnBack: boolean

// スクロール処理を走らせるオブジェクト
let scrollerIntervalObject: NodeJS.Timer = null

// 再開処理用のオブジェクト
let resumeTimeoutObject: NodeJS.Timeout = null

/**
 * ログ追加
 *
 * @param tourId string
 * @param log Log
 */
let addLog: (tourId: string, log: unknown) => void

/**
 * ! TabにexecuteScriptする関数
 */

// 巡回先のリンクをTabに渡す
// 関数を文字列に変換し、<next_url>を書き換えてexecuteScriptする
const setNextUrlVariable = (): void => {
  nextUrl = '<next_url>'
}

// 巡回リストのidをTabに渡す
// 関数を文字列に変換し、<tour_id>を書き換えてexecuteScriptする
const setTourId = (): void => {
  currentTourId = '<tour_id>'
}

// 最下部からスクロールを戻すかのstateを渡す
// 関数を文字列に変換し、falseを書き換えてexecuteScriptする
const setBackOnReachingBottomState = (): void => {
  backOnReachingBottom = false
}

// 戻るときにリロードを行うかのstateを渡す
// 関数を文字列に変換し、falseを書き換えてexecuteScriptする
const setReloadOnBackState = (): void => {
  reloadOnBack = false
}

// スクロール処理の定義とスクロール開始
const startScroll = (): void => {
  // ログ登録処理の定義
  if (typeof addLog == 'undefined') {
    addLog = (tourId: string, log: unknown): void => {
      chrome.storage.sync.get('tours', ({ tours }) => {
        // Tourが存在しない場合
        if (!tours || !Array.isArray(tours)) {
          return
        }
        // Tourを検索
        const tour = tours.find((tour) => tour.id == tourId)
        // Tourが存在しない場合
        if (!tour) {
          return
        }
        // Tourを更新
        ;(tour.logs as any[]).push(log)
        const newTours = tours.filter((tour) => tour.id != tourId)
        chrome.storage.sync.set(
          {
            tours: newTours,
          },
          null
        )
      })
    }
  }
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
      (observedScrollY + 1 < scrollY || observedScrollY + 0.6 > scrollY)
    ) {
      pauseScroll()
    }

    // 最下部検知 (小数部の差で一致しないため切り捨てて比較)
    if (
      Math.floor(document.documentElement.scrollHeight) ==
      Math.floor(Math.ceil(scrollY) + document.documentElement.clientHeight)
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

        if (typeof backOnReachingBottom == 'boolean' && backOnReachingBottom) {
          // 最下部からスクロールを戻す場合
          if (typeof reloadOnBack == 'boolean' && reloadOnBack) {
            // リロードする場合

            // スクロールを一時停止
            pauseScroll()
            // 最上部に戻る
            scrollTo(scrollX, 0)
            // リロード
            window.location.reload()
          } else {
            // リロードしない場合

            // 最上部に戻る
            scrollTo(scrollX, 0)
          }
        } else {
          // 最下部からスクロールを戻さない場合

          // マウス操作時の検知を無効化
          window.onmousedown = null
          window.onmousemove = null

          // グローバル変数に保持された処理をキャンセル
          clearInterval(scrollerIntervalObject)

          // 再開処理が待機している場合
          if (resumeTimeoutObject) {
            // 再開処理をキャンセル
            clearTimeout(resumeTimeoutObject)
          }

          // グローバル変数をクリア
          scrollerIntervalObject = null
          resumeTimeoutObject = null

          // 状態を反映
          chrome.storage.sync.remove(['currentTabId'], null)
        }
      }
    }

    // scrollYを保持
    observedScrollY = scrollY

    // 1pxスクロール
    scrollTo(scrollX, scrollY + 1)
  }

  // スクロール開始
  const startScroll = () => {
    // マウス操作時の処理を設定
    window.onmousedown = controlDetected
    window.onmousemove = controlDetected

    // scrollYを初期化
    observedScrollY = null

    // スクロール開始
    scrollerIntervalObject = setInterval(scroll, scrollInterval)

    console.log('AutoScroll started.')
  }

  // 操作を検知したときの処理
  const controlDetected = () => {
    // マウス操作時の検知を無効化
    window.onmousedown = null
    window.onmousemove = null

    // スクロール中の場合
    if (scrollerIntervalObject) {
      // スクロール停止
      clearInterval(scrollerIntervalObject)
      scrollerIntervalObject = null
      console.log('AutoScroll stopped.')

      if (typeof currentTourId == 'string') {
        // 操作検知のログ登録
        addLog(currentTourId, {
          url: window.location.href,
          type: 'CONTROL_DETECTION',
          date: new Date().getTime(),
          yCoordinate: scrollY,
        })
      }
    }

    // 再開処理が待機している場合
    if (resumeTimeoutObject) {
      // 再開処理をキャンセル
      clearTimeout(resumeTimeoutObject)
    }

    // 再開処理を予約/再予約
    resumeTimeoutObject = setTimeout(() => {
      if (typeof currentTourId == 'string') {
        // 再開ログ登録
        addLog(currentTourId, {
          url: window.location.href,
          type: 'RESTART',
          date: new Date().getTime(),
          yCoordinate: scrollY,
        })
      }
      startScroll()
    }, resumeInterval)
  }

  // スクロール開始(スクロール・再開処理が走っていない場合のみ)
  if (scrollerIntervalObject == null && resumeTimeoutObject == null) {
    if (typeof currentTourId == 'string') {
      // 開始ログ登録
      addLog(currentTourId, {
        url: window.location.href,
        type: 'START',
        date: new Date().getTime(),
        yCoordinate: scrollY,
      })
    }
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
  if (typeof nextUrl == 'string') {
    nextUrl = undefined
  }

  if (typeof currentTourId == 'string') {
    // 停止ログ登録
    addLog(currentTourId, {
      url: window.location.href,
      type: 'STOP',
      date: new Date().getTime(),
      yCoordinate: scrollY,
    })
  }

  // 巡回リストidを無効化
  if (typeof currentTourId == 'string') {
    currentTourId = undefined
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
  chrome.tabs.executeScript(
    tabId,
    {
      code: `(${setNextUrlVariable.toString().replace('<next_url>', url)})()`,
    },
    null
  )
}

/**
 * 指定タブに巡回先のリンクを渡す
 *
 * @param tabId number
 * @param url string
 */
export const setTabTourId = (tabId: number, tourId: string): void => {
  chrome.tabs.executeScript(
    tabId,
    {
      code: `(${setTourId.toString().replace('<tour_id>', tourId)})()`,
    },
    null
  )
}

/**
 * 指定タブに最下部からスクロールを戻すかのstateを渡し、storageも更新
 *
 * @param tabId number
 * @param backOnReachingBottom boolean
 */
export const setBackOnReachingBottom = (
  tabId: number,
  backOnReachingBottom: boolean
): void => {
  chrome.tabs.executeScript(
    tabId,
    {
      code: `(${setBackOnReachingBottomState
        .toString()
        .replace('false', `${backOnReachingBottom}`)})()`,
    },
    () => {
      chrome.storage.sync.set(
        { backOnReachingBottomEnabled: backOnReachingBottom },
        null
      )
    }
  )
}

/**
 * 指定タブに戻るときにリロードを行うかのstateを渡し、storageも更新
 *
 * @param tabId number
 * @param reloadOnBack boolean
 */
export const setReloadOnBack = (tabId: number, reloadOnBack: boolean): void => {
  chrome.tabs.executeScript(
    tabId,
    {
      code: `(${setReloadOnBackState
        .toString()
        .replace('false', `${reloadOnBack}`)})()`,
    },
    () => {
      chrome.storage.sync.set({ reloadOnBackEnabled: reloadOnBack }, null)
    }
  )
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

/**
 * 巡回するURLのリストをストレージに保存し新規タブでスクロール開始
 *
 * @param urls 巡回リンクリスト
 * @param startIdx 巡回の開始位置 urls[startIdx]から開始する
 */
export const startTour = (urls: string[], startIdx = 0): void => {
  // 開始位置の調整
  while (startIdx) {
    startIdx -= 1
    urls.push(urls.shift())
  }
  chrome.storage.sync.set(
    {
      currentTourUrlStack: urls,
    },
    () => {
      chrome.tabs.create({
        url: urls[0],
      })
    }
  )
}

/**
 * 保存済みの巡回リストで巡回を開始
 *
 * @param tourId string
 * @param startIdx number
 */
export const startSavedTour = (tourId: string, startIdx = 0): void => {
  // Tourを取得
  chromeStorageActions.findById<Tour>('tours', tourId, (tour) => {
    // `currentTabId`を削除
    chrome.storage.sync.remove('currentTabId', () => {
      // `currentTourId`を指定
      chrome.storage.sync.set({ currentTourId: tour.id }, () => {
        // 巡回開始
        startTour(tour.urls, startIdx)
      })
    })
  })
}
