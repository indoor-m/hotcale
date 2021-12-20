import { startTabScroll, setTabNextUrl } from './utils/scrollControl'

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
      ['currentTabId', 'currentTourUrlStack'],
      (object) => {
        // スクロール中のタブid・巡回スクロールのスタックがなければ処理終了
        if (
          !Object.prototype.hasOwnProperty.call(object, 'currentTabId') &&
          !Object.prototype.hasOwnProperty.call(object, 'currentTourUrlStack')
        ) {
          return
        }

        if (Object.prototype.hasOwnProperty.call(object, 'currentTabId')) {
          /**
           * ロードで停止しているスクロールの再開
           */

          // 開いているタブを検索
          chrome.tabs.query({ active: true }, (tabs) => {
            // スクロール中のタブidと一致
            const tab = tabs.find((tab) => tab.id == object.currentTabId)
            if (tab) {
              if (
                Object.prototype.hasOwnProperty.call(
                  object,
                  'currentTourUrlStack'
                ) &&
                Array.isArray(object.currentTourUrlStack)
              ) {
                if (object.currentTourUrlStack[0] == tab.url) {
                  // 次の遷移先を指定
                  setTabNextUrl(tabId, object.currentTourUrlStack[1])

                  // 巡回リンクリストを更新
                  object.currentTourUrlStack.push(
                    object.currentTourUrlStack.shift()
                  )
                  // Storageに保存
                  chrome.storage.sync.set(
                    {
                      currentTourUrlStack: object.currentTourUrlStack,
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
        } else if (Array.isArray(object.currentTourUrlStack)) {
          /**
           * 新規Tabでの巡回スクロール開始処理
           * `currentTabId`が未登録・`currentTourUrlStack`が登録済みの場合
           */

          // urlが巡回リンクと一致するタブを取得
          chrome.tabs.query({ url: object.currentTourUrlStack[0] }, (tabs) => {
            const tab = tabs.find((tab) => tab.id == tabId)
            if (!tab) {
              return
            }

            // 次の遷移先を指定
            setTabNextUrl(tabId, object.currentTourUrlStack[1])

            // 巡回リンクリストを更新
            object.currentTourUrlStack.push(object.currentTourUrlStack.shift())
            // Storageに保存
            chrome.storage.sync.set(
              {
                currentTourUrlStack: object.currentTourUrlStack,
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
