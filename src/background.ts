import {
  startTabScroll,
  setTabNextUrl,
  setBackOnReachingBottom,
  setReloadOnBack,
  setTabTourId,
} from './utils/scrollControl'

// ロード終了時の処理
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === 'complete') {
    chrome.storage.sync.get(
      [
        'currentTabId',
        'currentScrollSpeed',
        'currentResumeInterval',
        'currentTourUrlStack',
        'currentTourId',
        'backOnReachingBottomEnabled',
        'reloadOnBackEnabled',
      ],
      ({
        currentTabId,
        currentScrollSpeed,
        currentResumeInterval,
        currentTourUrlStack,
        currentTourId,
        backOnReachingBottomEnabled,
        reloadOnBackEnabled,
      }) => {
        // スクロール中のタブid・巡回スクロールのスタックがなければ処理終了
        if (!currentTabId && !currentTourUrlStack) {
          return
        }

        // スクロール速度の取得
        const scrollSpeed =
          +currentScrollSpeed >= 0 && +currentScrollSpeed <= 100
            ? +currentScrollSpeed
            : 50

        // 再開インターバルの取得
        const resumeInterval =
          +currentResumeInterval >= 0 ? +currentResumeInterval : 5

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
                setBackOnReachingBottom(backOnReachingBottomEnabled)
              }

              // 戻るときにリロードを行うかのstateを初期化
              if (typeof reloadOnBackEnabled == 'boolean') {
                setReloadOnBack(reloadOnBackEnabled)
              }

              // 巡回リンクリストが指定されているか
              if (Array.isArray(currentTourUrlStack)) {
                // URLと巡回中のリンクが一致するか
                if (currentTourUrlStack[0] == tab.url) {
                  // 次の遷移先を指定
                  setTabNextUrl(tabId, currentTourUrlStack[1])

                  if (currentTourId) {
                    // 巡回リストIdを指定
                    setTabTourId(tabId, currentTourId)
                  }

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
                      startTabScroll(
                        tabId,
                        scrollSpeed,
                        resumeInterval * 1000,
                        backOnReachingBottomEnabled,
                        reloadOnBackEnabled
                      )
                    }
                  )

                  return
                }
              }

              // スクロール開始
              console.log(`スクロール開始 tabId: ${tabId}`)
              startTabScroll(
                tabId,
                scrollSpeed,
                resumeInterval * 1000,
                backOnReachingBottomEnabled,
                reloadOnBackEnabled
              )
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

            if (currentTourId) {
              // 巡回リストIdを指定
              setTabTourId(tabId, currentTourId)
            }

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
                startTabScroll(
                  tabId,
                  scrollSpeed,
                  resumeInterval * 1000,
                  backOnReachingBottomEnabled,
                  reloadOnBackEnabled
                )
              }
            )

            return
          })
        }
      }
    )
  }
})
