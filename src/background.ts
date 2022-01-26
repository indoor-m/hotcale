import {
  startTabScroll,
  setTabNextUrl,
  setBackOnReachingBottom,
  setReloadOnBack,
} from './utils/scrollControl'

// chrome.storage.sync.set({
//   currentTourUrlStack: [
//     'https://github.com/indoor-m/hotcale/pull/1',
//     'https://github.com/indoor-m/hotcale/pull/2',
//     'https://github.com/indoor-m/hotcale/pull/3',
//     'https://github.com/indoor-m/hotcale/pull/4',
//     'https://github.com/indoor-m/hotcale/pull/5',
//   ],
// })

// ロード終了時の処理
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === 'complete') {
    chrome.storage.sync.get(
      [
        'currentTabId',
        'currentTourUrlStack',
        'backOnReachingBottomEnabled',
        'reloadOnBackEnabled',
      ],
      ({
        currentTabId,
        currentTourUrlStack,
        backOnReachingBottomEnabled,
        reloadOnBackEnabled,
      }) => {
        // スクロール中のタブid・巡回スクロールのスタックがなければ処理終了
        if (!currentTabId && !currentTourUrlStack) {
          return
        }

        if (currentTabId) {
          /**
           * ロードで停止しているスクロールの再開
           */

          // 開いているタブを検索
          chrome.tabs.query({ active: true }, (tabs) => {
            // スクロール中のタブidと一致
            const tab = tabs.find((tab) => tab.id == currentTabId)
            if (tab) {
              // 最下部からスクロールを戻すかのstateを初期化
              if (typeof backOnReachingBottomEnabled == 'boolean') {
                setBackOnReachingBottom(tabId, backOnReachingBottomEnabled)
              }

              // 戻るときにリロードを行うかのstateを初期化
              if (typeof reloadOnBackEnabled == 'boolean') {
                setReloadOnBack(tabId, reloadOnBackEnabled)
              }

              if (Array.isArray(currentTourUrlStack)) {
                if (currentTourUrlStack[0] == tab.url) {
                  // 次の遷移先を指定
                  setTabNextUrl(tabId, currentTourUrlStack[1])

                  // 巡回リンクリストを更新
                  currentTourUrlStack.push(currentTourUrlStack.shift())
                  // Storageに保存
                  chrome.storage.sync.set(
                    {
                      currentTourUrlStack: currentTourUrlStack,
                    },
                    () => {
                      // スクロール開始
                      console.log(`スクロール開始 tabId: ${tabId}`)
                      startTabScroll(tabId)
                    }
                  )

                  return
                }
              }

              // スクロール開始
              console.log(`スクロール開始 tabId: ${tabId}`)
              startTabScroll(tabId)
            }
          })
        } else if (Array.isArray(currentTourUrlStack)) {
          /**
           * 新規Tabでの巡回スクロール開始処理
           * `currentTabId`が未登録・`currentTourUrlStack`が登録済みの場合
           */

          // urlが巡回リンクと一致するタブを取得
          chrome.tabs.query({ url: currentTourUrlStack[0] }, (tabs) => {
            const tab = tabs.find((tab) => tab.id == tabId)
            if (!tab) {
              return
            }

            // 次の遷移先を指定
            setTabNextUrl(tabId, currentTourUrlStack[1])

            // 巡回リンクリストを更新
            currentTourUrlStack.push(currentTourUrlStack.shift())
            // Storageに保存
            chrome.storage.sync.set(
              {
                currentTourUrlStack: currentTourUrlStack,
              },
              () => {
                // スクロール開始
                console.log(`スクロール開始 tabId: ${tabId}`)
                startTabScroll(tabId)
              }
            )

            return
          })
        }
      }
    )
  }
})
