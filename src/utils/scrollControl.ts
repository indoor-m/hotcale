import { Tour } from '../atoms/interfaces/tour'
import { chromeStorageActions } from './base/chromeStorage'

/**
 * ! 以下の変数定義はTab上で実行されないためこれらの変数はTab上のJSではグローバル変数として扱われる
 */

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

// スクロール処理の定義とスクロール開始
const startScroll = (
  scrollInterval: number,
  resumeInterval: number,
  backOnReachingBottom: boolean,
  reloadOnBack: boolean
): void => {
  // ログ登録処理の定義
  addLog = (
    tourId: string,
    log: {
      url: string
      type: 'START' | 'STOP' | 'RESTART' | 'CONTROL_DETECTION'
      date: string
      yCoordinate: number
    }
  ): void => {
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
      ;(tour.logs as unknown[]).push(log)
      const newTours = tours.filter((tour) => tour.id != tourId)
      newTours.push(tour)
      chrome.storage.sync.set(
        {
          tours: newTours,
        },
        null
      )

      // 操作検知時に通知
      if (log.type == 'CONTROL_DETECTION') {
        // 連携先を取得
        chrome.storage.sync.get(['notification'], ({ notification }) => {
          // call API
          console.log(notification)
          // LINE
          if (notification[0].isLineEnabled) {
            fetch('https://api-hotcale.tingtt.jp/line', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: notification[0].lineToken,
                message: `# ${tour.name}\nURL: "${log.url}", Y: ${log.yCoordinate}\n操作検知`,
              }),
            })
          }
          // Slack
          if (notification[0].isSLackEnabled) {
            fetch('https://api-hotcale.tingtt.jp/slack', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                webhook_url: notification[0].slackWebhookUrl,
                text: `# ${tour.name}\nURL: "${log.url}", Y: ${log.yCoordinate}\n操作検知`,
              }),
            })
          }
        })
      }
    })
  }

  // スクロール処理と再開処理利用のオブジェクト
  chrome.storage.sync.remove(['scrollerInterval', 'resumeTimeout'], null)

  // scrollY保持用フィールド
  let observedScrollY: number

  // スクロール中断
  const pauseScroll = (
    interval = resumeInterval,
    callback: () => void = null
  ) => {
    // スクロール停止
    chrome.storage.sync.get(['scrollerInterval'], ({ scrollerInterval }) => {
      clearInterval(scrollerInterval)
      console.log('AutoScroll stopped.')
      chrome.storage.sync.remove('scrollerInterval', null)
    })

    // 再開処理を予約しTimeoutIDをStorageに保存
    chrome.storage.sync.set({
      resumeTimeout: setTimeout(() => {
        start()
        if (callback) {
          callback()
        }
      }, interval),
    })
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
      chrome.storage.sync.get('nextUrl', ({ nextUrl }) => {
        if (nextUrl != undefined) {
          // 巡回リンクあり
          // 次の巡回先に遷移

          // 停止とStorageの変数を削除
          chrome.storage.sync.get(
            ['scrollerInterval', 'resumeTimeout'],
            ({ scrollerInterval, resumeTimeout }) => {
              if (scrollerInterval != undefined || resumeTimeout != undefined) {
                clearInterval(scrollerInterval)
                clearTimeout(resumeTimeout)
              }
              // 次の巡回先に遷移
              window.location.href = nextUrl

              chrome.storage.sync.remove(
                ['scrollerInterval', 'resumeTimeout', 'nextUrl'],
                null
              )
            }
          )
        } else {
          // 巡回リンクなし

          if (backOnReachingBottom) {
            // 最下部からスクロールを戻す場合
            if (reloadOnBack) {
              // リロードする場合

              // スクロールを一時停止
              pauseScroll()
              // 最上部に戻る
              scrollTo(scrollX, 0)
              // リロード
              window.location.reload()
            } else {
              // リロードしない場合

              // スクロールを一時停止
              pauseScroll(0, () => {
                // 最上部に戻る
                scrollTo(scrollX, 0)
              })
            }
          } else {
            // 最下部からスクロールを戻さない場合

            // マウス操作時の検知を無効化
            window.onmousedown = null
            window.onmousemove = null

            // 停止とStorageの変数を削除
            chrome.storage.sync.get(
              ['scrollerInterval', 'resumeTimeout'],
              ({ scrollerInterval, resumeTimeout }) => {
                // スクロール処理をキャンセル
                clearInterval(scrollerInterval)

                // 再開処理が待機している場合
                if (resumeTimeout) {
                  // 再開処理をキャンセル
                  clearTimeout(resumeTimeout)
                }

                chrome.storage.sync.remove(
                  ['scrollerInterval', 'resumeTimeout'],
                  null
                )
              }
            )

            // 状態を反映
            chrome.storage.sync.remove(['currentTabId'], null)
          }
        }
      })
    }

    // scrollYを保持
    observedScrollY = scrollY

    // 1pxスクロール
    scrollTo(scrollX, scrollY + 1)
  }

  // スクロール開始
  const start = () => {
    // マウス操作時の処理を設定
    window.onmousedown = controlDetected
    window.onmousemove = controlDetected

    // scrollYを初期化
    observedScrollY = null

    // スクロール開始とIntervalIdをStorageに保存
    chrome.storage.sync.set({
      scrollerInterval: setInterval(scroll, scrollInterval),
    })

    console.log('AutoScroll started.')
  }

  // 操作を検知したときの処理
  const controlDetected = () => {
    // マウス操作時の検知を無効化
    window.onmousedown = null
    window.onmousemove = null

    chrome.storage.sync.get(
      ['scrollerInterval', 'resumeTimeout', 'currentTourId'],
      ({ scrollerInterval, resumeTimeout, currentTourId }) => {
        // スクロール中の場合
        if (scrollerInterval != undefined) {
          // スクロール停止
          clearInterval(scrollerInterval)
          scrollerInterval = null
          console.log('AutoScroll stopped.')

          if (currentTourId != undefined) {
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
        if (resumeTimeout != undefined) {
          // 再開処理をキャンセル
          clearTimeout(resumeTimeout)
        }

        // 再開処理を予約/再予約
        chrome.storage.sync.set(
          {
            resumeTimeout: setTimeout(() => {
              if (currentTourId != undefined) {
                // 再開ログ登録
                addLog(currentTourId, {
                  url: window.location.href,
                  type: 'RESTART',
                  date: new Date().getTime(),
                  yCoordinate: scrollY,
                })
              }
              start()
            }, resumeInterval),
          },
          null
        )
      }
    )
  }

  // スクロール開始(スクロール・再開処理が走っていない場合のみ)
  chrome.storage.sync.get(
    ['scrollerInterval', 'resumeTimeout', 'currentTourId'],
    ({ scrollerInterval, resumeTimeout, currentTourId }) => {
      if (scrollerInterval == undefined && resumeTimeout == undefined) {
        if (currentTourId != undefined) {
          // 開始ログ登録
          addLog(currentTourId, {
            url: window.location.href,
            type: 'START',
            date: new Date().getTime(),
            yCoordinate: scrollY,
          })
        }
        start()
      }
    }
  )
}

// スクロール停止
const stopScroll = (): void => {
  // マウス操作時の検知を無効化
  window.onmousedown = null
  window.onmousemove = null

  // 停止とStorageの変数を削除
  chrome.storage.sync.get(
    ['scrollerInterval', 'resumeTimeout', 'currentTourId'],
    ({ scrollerInterval, resumeTimeout, currentTourId }) => {
      clearInterval(scrollerInterval)
      clearTimeout(resumeTimeout)

      if (currentTourId != undefined) {
        // 停止ログ登録
        addLog(currentTourId, {
          url: window.location.href,
          type: 'STOP',
          date: new Date().getTime(),
          yCoordinate: scrollY,
        })

        // 巡回リストidを無効化
        currentTourId = undefined
      }

      chrome.storage.sync.remove([
        'scrollerInterval',
        'resumeTimeout',
        'currentTourId',
      ])
    }
  )

  console.log('AutoScroll stopped. stop()')
}

/**
 * ! exports: 他ファイルから呼び出す関数
 */

/**
 * 指定タブに最下部からスクロールを戻すかのstateを渡し、storageも更新
 *
 * @param tabId number
 * @param backOnReachingBottom boolean
 */
export const setBackOnReachingBottom = (
  backOnReachingBottom: boolean
): void => {
  chrome.storage.sync.set(
    { backOnReachingBottomEnabled: backOnReachingBottom },
    null
  )
}

/**
 * 指定タブに戻るときにリロードを行うかのstateを渡し、storageも更新
 *
 * @param tabId number
 * @param reloadOnBack boolean
 */
export const setReloadOnBack = (reloadOnBack: boolean): void => {
  chrome.storage.sync.set({ reloadOnBackEnabled: reloadOnBack }, null)
}

/**
 * 指定タブでスクロール開始
 *
 * StorageにStateの更新を行い、スクロール開始のコードを実行。
 *
 * @param tabId number
 * @param scrollSpeed number 0 to 100
 * @param resumeInterval number (ms)
 */
export const startTabScroll = (
  tabId: number,
  scrollSpeed = 50,
  resumeInterval = 5000,
  backOnReachingBottom = false,
  reloadOnBack = false
): void => {
  // スクロール中のタブがあれば停止
  chrome.storage.sync.get('currentTabId', ({ currentTabId }) => {
    if (currentTabId) {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: stopScroll,
        },
        null
      )
    }
  })

  chrome.storage.sync.set({ currentTabId: tabId }, () => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: startScroll,
        args: [
          100 - scrollSpeed,
          resumeInterval,
          backOnReachingBottom,
          reloadOnBack,
        ],
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
  chrome.storage.sync.remove(
    ['currentTabId', 'currentTourUrlStack', 'nextUrl'],
    () => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: stopScroll,
        },
        null
      )
    }
  )
}

/**
 * 巡回するURLのリストをストレージに保存し新規タブでスクロール開始
 *
 * @param urls 巡回リンクリスト
 * @param startIdx 巡回の開始位置 urls[startIdx]から開始する
 */
export const startTour = (
  urls: string[],
  scrollSpeed = 50,
  resumeInterval = 5000,
  startIdx = 0
): void => {
  // 開始位置の調整
  while (startIdx) {
    startIdx -= 1
    urls.push(urls.shift())
  }
  chrome.storage.sync.set(
    {
      currentTourUrlStack: urls,
      currentScrollSpeed: scrollSpeed,
      currentResumeInterval: resumeInterval,
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
        startTour(tour.urls, tour.scrollSpeed, tour.resumeInterval, startIdx)
      })
    })
  })
}
