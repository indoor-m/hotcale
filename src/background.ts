import { startTabScroll } from './scrollControlCodes'

// ロード終了時の処理
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === 'complete') {
    chrome.storage.sync.get('currentTabId', (object) => {
      // スクロール中のタブidがなければ処理終了
      if (!Object.prototype.hasOwnProperty.call(object, 'currentTabId')) {
        return
      }

      // 開いているタブを検索
      chrome.tabs.query({ active: true }, (tabs) => {
        // スクロール中のタブidと一致
        if (tabs.find((tab) => tab.id == object.currentTabId)) {
          // スクロール処理
          console.log(`スクロール開始 tabId: ${tabId}`)
          startTabScroll(tabId)
        }
      })
    })
  }
})
