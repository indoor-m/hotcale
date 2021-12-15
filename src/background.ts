import { startTabScroll, setTabNextUrl } from './utils/scrollControl'

const urlStack = [
  'https://github.com/indoor-m/hotcale/pull/1',
  'https://github.com/indoor-m/hotcale/pull/2',
  'https://github.com/indoor-m/hotcale/pull/3',
  'https://github.com/indoor-m/hotcale/pull/4',
  'https://github.com/indoor-m/hotcale/pull/5',
]

// ロード終了時の処理
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === 'complete') {
    chrome.storage.sync.get('currentTabId', (object) => {
      // スクロール中のタブidがなければ処理終了
      if (!Object.prototype.hasOwnProperty.call(object, 'currentTabId')) {
        return
      }

      /**
       * ロードで停止しているスクロールがあれば再開
       */

      // 開いているタブを検索
      chrome.tabs.query({ active: true }, (tabs) => {
        // スクロール中のタブidと一致
        const tab = tabs.find((tab) => tab.id == object.currentTabId)
        if (tab) {
          if (urlStack[0] == tab.url) {
            urlStack.push(urlStack.shift())
            console.log('Rotated')

            setTabNextUrl(tabId, urlStack[0])
          }

          // スクロール開始
          console.log(`スクロール開始 tabId: ${tabId}`)
          startTabScroll(tabId)
        }
      })
    })
  }
})
